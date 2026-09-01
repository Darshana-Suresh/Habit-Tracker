using HabitTracker.Api.Models;
using Npgsql;

namespace HabitTracker.Api.Services;

/// <summary>
/// Same responsibilities as the earlier in-memory HabitStore — the
/// controllers didn't need to know it changed, only await was added to
/// each call. Uses NpgsqlDataSource (registered as a singleton in
/// Program.cs), which pools connections internally.
/// </summary>
public class HabitStore
{
    private static readonly string[] Accents =
        { "#8FA681", "#D8A657", "#C97064", "#7C9EB2", "#B490C0" };

    private readonly NpgsqlDataSource _dataSource;

    public HabitStore(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    // GET /api/habits — active (non-deleted) habits only.
    public async Task<List<Habit>> GetActiveHabitsAsync()
    {
        var habits = new List<Habit>();

        await using var cmd = _dataSource.CreateCommand(
            "SELECT id, name, color FROM habits WHERE deleted_at IS NULL ORDER BY created_at");
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            habits.Add(new Habit
            {
                Id = reader.GetString(0),
                Name = reader.GetString(1),
                Color = reader.GetString(2),
            });
        }

        return habits;
    }

    // GET /api/entries?month=YYYY-MM — every habit with activity that
    // month (including habits since soft-deleted) plus that month's
    // slice of the grid.
    public async Task<MonthData> GetMonthEntriesAsync(string monthKey)
    {
        var result = new MonthData();
        var seen = new HashSet<string>();

        await using var cmd = _dataSource.CreateCommand(
            @"SELECT h.id, h.name, h.color, e.entry_date, e.state
              FROM entries e
              JOIN habits h ON h.id = e.habit_id
              WHERE to_char(e.entry_date, 'YYYY-MM') = $1
              ORDER BY h.created_at");
        cmd.Parameters.AddWithValue(monthKey);

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            var id = reader.GetString(0);
            var dateStr = reader.GetDateTime(3).ToString("yyyy-MM-dd");
            var state = reader.GetString(4);

            if (seen.Add(id))
            {
                result.Habits.Add(new Habit
                {
                    Id = id,
                    Name = reader.GetString(1),
                    Color = reader.GetString(2),
                });
            }

            if (!result.Grid.TryGetValue(id, out var byDate))
            {
                byDate = new Dictionary<string, string>();
                result.Grid[id] = byDate;
            }
            byDate[dateStr] = state;
        }

        return result;
    }

    // POST /api/habits — same validation as before: non-empty, no
    // active duplicate.
    public async Task<Habit> CreateHabitAsync(string name)
    {
        var trimmed = name?.Trim() ?? "";
        if (string.IsNullOrEmpty(trimmed))
            throw new ArgumentException("Habit name can't be empty.");

        await using (var dupCmd = _dataSource.CreateCommand(
            "SELECT 1 FROM habits WHERE deleted_at IS NULL AND lower(name) = lower($1)"))
        {
            dupCmd.Parameters.AddWithValue(trimmed);
            await using var dupReader = await dupCmd.ExecuteReaderAsync();
            if (await dupReader.ReadAsync())
                throw new ArgumentException($"\"{trimmed}\" is already on your list.");
        }

        long count;
        await using (var countCmd = _dataSource.CreateCommand("SELECT count(*) FROM habits"))
        {
            count = (long)(await countCmd.ExecuteScalarAsync() ?? 0L);
        }
        var color = Accents[count % Accents.Length];
        var id = Guid.NewGuid().ToString();

        await using (var insertCmd = _dataSource.CreateCommand(
            "INSERT INTO habits (id, name, color) VALUES ($1, $2, $3)"))
        {
            insertCmd.Parameters.AddWithValue(id);
            insertCmd.Parameters.AddWithValue(trimmed);
            insertCmd.Parameters.AddWithValue(color);
            await insertCmd.ExecuteNonQueryAsync();
        }

        return new Habit { Id = id, Name = trimmed, Color = color };
    }

    // DELETE /api/habits/{id} — soft delete; entries stay in place.
    public async Task DeleteHabitAsync(string id)
    {
        await using var cmd = _dataSource.CreateCommand(
            "UPDATE habits SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL");
        cmd.Parameters.AddWithValue(id);
        await cmd.ExecuteNonQueryAsync();
    }

    // PATCH /api/entries — upsert one cell.
    public async Task SetEntryAsync(string habitId, string date, string state)
    {
        await using var cmd = _dataSource.CreateCommand(
            @"INSERT INTO entries (habit_id, entry_date, state)
              VALUES ($1, $2::date, $3)
              ON CONFLICT (habit_id, entry_date)
              DO UPDATE SET state = EXCLUDED.state, updated_at = now()");
        cmd.Parameters.AddWithValue(habitId);
        cmd.Parameters.AddWithValue(date);
        cmd.Parameters.AddWithValue(state);
        await cmd.ExecuteNonQueryAsync();
    }
}

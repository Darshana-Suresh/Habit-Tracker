namespace HabitTracker.Api.Models;

public class MonthData
{
    public List<Habit> Habits { get; set; } = new();

    // habitId -> "YYYY-MM-DD" -> "empty" | "done" | "skipped"
    public Dictionary<string, Dictionary<string, string>> Grid { get; set; } = new();
}

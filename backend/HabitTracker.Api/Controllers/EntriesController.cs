using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using HabitTracker.Api.Models;
using HabitTracker.Api.Services;

namespace HabitTracker.Api.Controllers;

[ApiController]
[Route("api/entries")]
public class EntriesController : ControllerBase
{
    private static readonly Regex MonthPattern = new(@"^\d{4}-\d{2}$");
    private static readonly string[] ValidStates = { "empty", "done", "skipped" };

    private readonly HabitStore _store;

    public EntriesController(HabitStore store)
    {
        _store = store;
    }

    // GET /api/entries?month=YYYY-MM
    [HttpGet]
    public async Task<ActionResult<MonthData>> GetMonthEntries([FromQuery] string month)
    {
        if (string.IsNullOrEmpty(month) || !MonthPattern.IsMatch(month))
        {
            return BadRequest(new { error = "Query param 'month' must look like YYYY-MM." });
        }
        return Ok(await _store.GetMonthEntriesAsync(month));
    }

    public record SetEntryRequest(string HabitId, string Date, string State);

    // PATCH /api/entries — upsert one cell.
    [HttpPatch]
    public async Task<IActionResult> SetEntry([FromBody] SetEntryRequest request)
    {
        if (string.IsNullOrEmpty(request.HabitId) ||
            string.IsNullOrEmpty(request.Date) ||
            !ValidStates.Contains(request.State))
        {
            return BadRequest(new { error = "Expected { habitId, date, state }." });
        }

        await _store.SetEntryAsync(request.HabitId, request.Date, request.State);
        return NoContent();
    }
}

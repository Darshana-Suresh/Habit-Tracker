using Microsoft.AspNetCore.Mvc;
using HabitTracker.Api.Models;
using HabitTracker.Api.Services;

namespace HabitTracker.Api.Controllers;

[ApiController]
[Route("api/habits")]
public class HabitsController : ControllerBase
{
    private readonly HabitStore _store;

    public HabitsController(HabitStore store)
    {
        _store = store;
    }

    // GET /api/habits — active (non-deleted) habits only.
    [HttpGet]
    public async Task<ActionResult<List<Habit>>> GetActiveHabits()
    {
        return Ok(await _store.GetActiveHabitsAsync());
    }

    public record CreateHabitRequest(string Name);

    // POST /api/habits — mirrors the earlier version's validation:
    // non-empty name, no active duplicate.
    [HttpPost]
    public async Task<ActionResult<Habit>> CreateHabit([FromBody] CreateHabitRequest request)
    {
        try
        {
            var habit = await _store.CreateHabitAsync(request.Name);
            return StatusCode(201, habit);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // DELETE /api/habits/{id} — soft delete; history stays intact.
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHabit(string id)
    {
        await _store.DeleteHabitAsync(id);
        return NoContent();
    }
}

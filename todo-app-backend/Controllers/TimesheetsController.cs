using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Interfaces;

namespace TodoAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimesheetsController : ControllerBase
    {
        private readonly ITimesheetService _timesheetService;

        public TimesheetsController(ITimesheetService timesheetService)
        {
            _timesheetService = timesheetService;
        }

        [HttpGet("{assigneeId}/{date}")]
        public async Task<IActionResult> GetTimesheet(string assigneeId, DateTime date, [FromQuery] string apiKey)
        {
            try
            {
                var timesheets = await _timesheetService.GetTimesheetAsync(assigneeId, date, apiKey);
                return Ok(timesheets);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(503, new { Message = "Service unavailable. Please try again later.", Details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }
    }
}

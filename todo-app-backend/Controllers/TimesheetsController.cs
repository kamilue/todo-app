using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Services;

namespace TodoAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimesheetsController : ControllerBase
    {
        private readonly TimesheetService _timesheetService;

        public TimesheetsController(TimesheetService timesheetService)
        {
            _timesheetService = timesheetService;
        }

        [HttpGet("{assigneeId}/{date}")]
        public async Task<IActionResult> GetTimesheet(int assigneeId, DateTime date, [FromQuery] string apiKey)
        {
            var timesheets = await _timesheetService.GetTimesheetAsync(assigneeId, date, apiKey);
            return Ok(timesheets);
        }
    }
}

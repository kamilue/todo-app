using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Services;

namespace TodoAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssigneesController : ControllerBase
    {
        private readonly AssigneeService _assigneeService;

        public AssigneesController(AssigneeService assigneeService)
        {
            _assigneeService = assigneeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssignees([FromQuery] string apiKey)
        {
            var assignees = await _assigneeService.GetAssigneesAsync(apiKey);
            return Ok(assignees);
        }
    }
}

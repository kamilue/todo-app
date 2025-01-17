using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Interfaces;

namespace TodoAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssigneesController : ControllerBase
    {
        private readonly IAssigneeService _assigneeService;

        public AssigneesController(IAssigneeService assigneeService)
        {
            _assigneeService = assigneeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssignees([FromQuery] string apiKey)
        {
            try
            {
                var assignees = await _assigneeService.GetAssigneesAsync(apiKey);
                return Ok(assignees);
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

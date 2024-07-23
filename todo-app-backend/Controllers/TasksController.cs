using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Services;
using Task = TodoAppBackend.Models.Task;

namespace TodoAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private static List<Task> tasks = new List<Task>();
        private readonly TimesheetService _timesheetService;
        private readonly TaskCompletionEstimator _taskCompletionEstimator;

        public TasksController(TimesheetService timesheetService, TaskCompletionEstimator taskCompletionEstimator)
        {
            _timesheetService = timesheetService;
            _taskCompletionEstimator = taskCompletionEstimator;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Task>> GetTasks()
        {
            try
            {
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult<Task> CreateTask(Task task)
        {
            try
            {
                task.Id = tasks.Count > 0 ? tasks.Max(t => t.Id) + 1 : 1;
                tasks.Add(task);
                return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }

        [HttpPatch("{id}")]
        public ActionResult<Task> UpdateTask(int id, [FromBody] Task updatedTask)
        {
            try
            {
                var task = tasks.FirstOrDefault(t => t.Id == id);
                if (task == null)
                {
                    return NotFound(new { Message = "Task not found." });
                }

                task.Title = updatedTask.Title;
                task.AssigneeId = updatedTask.AssigneeId;
                task.Estimate = updatedTask.Estimate;
                task.Status = updatedTask.Status;

                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteTask(int id)
        {
            try
            {
                var task = tasks.FirstOrDefault(t => t.Id == id);
                if (task == null)
                {
                    return NotFound(new { Message = "Task not found." });
                }

                tasks.Remove(task);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
            }
        }
    }
}

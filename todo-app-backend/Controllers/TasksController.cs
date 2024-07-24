using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Interfaces;
using Task = TodoAppBackend.Models.Task;

namespace TodoAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        internal static List<Task> tasks = new List<Task>();
        private readonly ITimesheetService _timesheetService;
        private readonly ITaskCompletionEstimator _taskCompletionEstimator;

        public TasksController(ITimesheetService timesheetService, ITaskCompletionEstimator taskCompletionEstimator)
        {
            _timesheetService = timesheetService;
            _taskCompletionEstimator = taskCompletionEstimator;
        }

        [HttpGet]
        public IActionResult GetTasks()
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
        public async Task<IActionResult> CreateTask(Task task)
        {
            try
            {
                if (string.IsNullOrEmpty(task.AssigneeId))
                {
                    task.Id = tasks.Count > 0 ? tasks.Max(t => t.Id) + 1 : 1;
                    tasks.Add(task);
                    return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
                }

                var timesheets = await _timesheetService.GetTimesheetAsync(task.AssigneeId, DateTime.Now, "test");
                var availableHours = _taskCompletionEstimator.CalculateAvailableHoursFromToday(timesheets.ToList());

                var assignedHours = tasks.Where(t => t.AssigneeId == task.AssigneeId && t.Status == "TODO").Sum(t => t.Estimate);
                if (assignedHours + task.Estimate > availableHours)
                {
                    return BadRequest(new { Message = "Assignee does not have enough available hours for this task.", availableHours });
                }

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
        public async Task<IActionResult> UpdateTask(int id, [FromBody] Task updatedTask)
        {
            try
            {
                var task = tasks.FirstOrDefault(t => t.Id == id);
                if (task == null)
                {
                    return NotFound(new { Message = "Task not found." });
                }

                if (string.IsNullOrEmpty(updatedTask.AssigneeId))
                {
                    task.Title = updatedTask.Title;
                    task.AssigneeId = updatedTask.AssigneeId;
                    task.Estimate = updatedTask.Estimate;
                    task.Status = updatedTask.Status;

                    return Ok(task);
                }

                var timesheets = await _timesheetService.GetTimesheetAsync(updatedTask.AssigneeId, DateTime.Now, "test");
                var availableHours = _taskCompletionEstimator.CalculateAvailableHoursFromToday(timesheets.ToList());

                var assignedHours = tasks.Where(t => t.AssigneeId == updatedTask.AssigneeId && t.Status == "TODO").Sum(t => t.Estimate);
                if (assignedHours + updatedTask.Estimate > availableHours)
                {
                    return BadRequest(new { Message = "Assignee does not have enough available hours for this task.", availableHours });
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
        public IActionResult DeleteTask(int id)
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

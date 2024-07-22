using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Models;
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
            return Ok(tasks);
        }

        [HttpPost]
        public ActionResult<Task> CreateTask(Task task)
        {
            task.Id = tasks.Count > 0 ? tasks.Max(t => t.Id) + 1 : 1;
            tasks.Add(task);
            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }

        [HttpPatch("{id}")]
        public ActionResult<Task> UpdateTask(int id, [FromBody] Task updatedTask)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }

            task.Title = updatedTask.Title;
            task.AssigneeId = updatedTask.AssigneeId;
            task.Estimate = updatedTask.Estimate;
            task.Status = updatedTask.Status;

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteTask(int id)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }

            tasks.Remove(task);
            return NoContent();
        }
    }
}

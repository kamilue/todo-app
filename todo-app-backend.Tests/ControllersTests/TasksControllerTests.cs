using Moq;
using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Controllers;
using TodoAppBackend.Interfaces;
using TodoAppBackend.Models;
using Task = TodoAppBackend.Models.Task;

namespace TodoAppBackend.Tests
{
    public class TasksControllerTests
    {
        private readonly Mock<ITimesheetService> _mockTimesheetService;
        private readonly Mock<ITaskCompletionEstimator> _mockTaskCompletionEstimator;
        private readonly TasksController _controller;

        public TasksControllerTests()
        {
            _mockTimesheetService = new Mock<ITimesheetService>();
            _mockTaskCompletionEstimator = new Mock<ITaskCompletionEstimator>();
            _controller = new TasksController(_mockTimesheetService.Object, _mockTaskCompletionEstimator.Object);
        }

        [Fact]
        public void GetTasks_ReturnsOkResult_WithListOfTasks()
        {
            TasksController.tasks = new List<Task>
            {
                new Task { Id = 1, Title = "Task1", AssigneeId = "1", Estimate = 2, Status = "TODO" },
                new Task { Id = 2, Title = "Task2", AssigneeId = "2", Estimate = 3, Status = "DONE" }
            };

            var result = _controller.GetTasks() as OkObjectResult;

            Assert.NotNull(result);
            var returnedTasks = Assert.IsAssignableFrom<IEnumerable<Task>>(result.Value);
            Assert.Equal(2, returnedTasks.Count());
        }

        [Fact]
        public async System.Threading.Tasks.Task CreateTask_ReturnsCreatedAtActionResult_WhenTaskIsValid()
        {
            var newTask = new Task { Title = "New Task", Estimate = 2 };

            var result = await _controller.CreateTask(newTask) as CreatedAtActionResult;

            Assert.NotNull(result);
            var createdTask = Assert.IsAssignableFrom<Task>(result.Value);
            Assert.Equal("New Task", createdTask.Title);
            Assert.Equal(2, createdTask.Estimate);
            Assert.Equal(nameof(_controller.GetTasks), result.ActionName);
        }

        [Fact]
        public async System.Threading.Tasks.Task CreateTask_ReturnsBadRequest_WhenAssigneeHasInsufficientHours()
        {
            var newTask = new Task { Title = "New Task", AssigneeId = "1", Estimate = 5 };
            var timesheets = new List<Timesheet> { new Timesheet { Hours = "9:00-12:00" } };
            _mockTimesheetService.Setup(service => service.GetTimesheetAsync("1", It.IsAny<DateTime>(), It.IsAny<string>()))
                                 .ReturnsAsync(timesheets);
            _mockTaskCompletionEstimator.Setup(estimator => estimator.CalculateAvailableHoursFromToday(It.IsAny<List<Timesheet>>()))
                                        .Returns(3);

            var result = await _controller.CreateTask(newTask) as BadRequestObjectResult;

            Assert.NotNull(result);
            var errorDetails = result.Value as dynamic;
            Assert.Equal("Assignee does not have enough available hours for this task.", errorDetails.Message);
        }

        [Fact]
        public async System.Threading.Tasks.Task UpdateTask_ReturnsOkResult_WhenTaskIsValid()
        {
            var existingTask = new Task { Id = 1, Title = "Existing Task", AssigneeId = "1", Estimate = 2, Status = "TODO" };
            TasksController.tasks.Add(existingTask);

            var updatedTask = new Task { Id = 1, Title = "Updated Task", AssigneeId = "1", Estimate = 2, Status = "TODO" };
            var timesheets = new List<Timesheet> { new Timesheet { Hours = "9:00-12:00" } };
            _mockTimesheetService.Setup(service => service.GetTimesheetAsync("1", It.IsAny<DateTime>(), It.IsAny<string>()))
                                 .ReturnsAsync(timesheets);
            _mockTaskCompletionEstimator.Setup(estimator => estimator.CalculateAvailableHoursFromToday(It.IsAny<List<Timesheet>>()))
                                        .Returns(5);

            var result = await _controller.UpdateTask(1, updatedTask) as OkObjectResult;

            Assert.NotNull(result);
            var returnedTask = Assert.IsAssignableFrom<Task>(result.Value);
            Assert.Equal("Updated Task", returnedTask.Title);
        }

        [Fact]
        public async System.Threading.Tasks.Task UpdateTask_ReturnsNotFound_WhenTaskDoesNotExist()
        {
            var result = await _controller.UpdateTask(999, new Task { Id = 999 }) as NotFoundObjectResult;

            Assert.NotNull(result);
            var errorDetails = result.Value as dynamic;
            Assert.Equal("Task not found.", errorDetails.Message);
        }

        [Fact]
        public void DeleteTask_ReturnsNoContent_WhenTaskIsDeleted()
        {
            var task = new Task { Id = 1, Title = "Task to be deleted" };
            TasksController.tasks.Add(task);

            var result = _controller.DeleteTask(1) as NoContentResult;

            Assert.NotNull(result);
        }

        [Fact]
        public void DeleteTask_ReturnsNotFound_WhenTaskDoesNotExist()
        {
            var result = _controller.DeleteTask(999) as NotFoundObjectResult;

            Assert.NotNull(result);
            var errorDetails = result.Value as dynamic;
            Assert.Equal("Task not found.", errorDetails.Message);
        }
    }
}

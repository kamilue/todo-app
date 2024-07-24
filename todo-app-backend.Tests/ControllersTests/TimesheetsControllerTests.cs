using Moq;
using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Controllers;
using TodoAppBackend.Interfaces;
using TodoAppBackend.Models;

namespace todo_app_backend.Tests.ControllersTests
{
    public class TimesheetsControllerTests
    {
        private readonly Mock<ITimesheetService> _mockTimesheetService;
        private readonly TimesheetsController _controller;

        public TimesheetsControllerTests()
        {
            _mockTimesheetService = new Mock<ITimesheetService>();
            _controller = new TimesheetsController(_mockTimesheetService.Object);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetTimesheet_ReturnsOkResult_WithListOfTimesheets()
        {
            var assigneeId = "1";
            var date = DateTime.Now;
            var apiKey = "test";
            var timesheets = new List<Timesheet>
            {
                new Timesheet { Date = date, Hours = "9:00-12:00" }
            };

            _mockTimesheetService.Setup(service => service.GetTimesheetAsync(assigneeId, date, apiKey))
                                 .ReturnsAsync(timesheets);

            var result = await _controller.GetTimesheet(assigneeId, date, apiKey) as OkObjectResult;

            Assert.NotNull(result);
            var returnedTimesheets = Assert.IsAssignableFrom<IEnumerable<Timesheet>>(result.Value);
            Assert.Single(returnedTimesheets);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetTimesheet_Returns503ServiceUnavailable_OnHttpRequestException()
        {
            var assigneeId = "1";
            var date = DateTime.Now;
            var apiKey = "test";

            _mockTimesheetService.Setup(service => service.GetTimesheetAsync(assigneeId, date, apiKey))
                                 .ThrowsAsync(new HttpRequestException("Service is down"));

            var result = await _controller.GetTimesheet(assigneeId, date, apiKey) as ObjectResult;

            Assert.NotNull(result);
            Assert.Equal(503, result.StatusCode);
            var errorDetails = result.Value as dynamic;
            Assert.Equal("Service unavailable. Please try again later.", errorDetails.Message);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetTimesheet_Returns500InternalServerError_OnGenericException()
        {
            var assigneeId = "1";
            var date = DateTime.Now;
            var apiKey = "test";

            _mockTimesheetService.Setup(service => service.GetTimesheetAsync(assigneeId, date, apiKey))
                                 .ThrowsAsync(new Exception("Unexpected error"));

            var result = await _controller.GetTimesheet(assigneeId, date, apiKey) as ObjectResult;

            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode);
            var errorDetails = result.Value as dynamic;
            Assert.Equal("An unexpected error occurred.", errorDetails.Message);
        }
    }
}

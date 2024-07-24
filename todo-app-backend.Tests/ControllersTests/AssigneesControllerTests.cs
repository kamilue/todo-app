using Moq;
using Microsoft.AspNetCore.Mvc;
using TodoAppBackend.Controllers;
using TodoAppBackend.Interfaces;
using TodoAppBackend.Models;

namespace todo_app_backend.Tests.ControllersTests
{
    public class AssigneesControllerTests
    {
        private readonly Mock<IAssigneeService> _mockAssigneeService;
        private readonly AssigneesController _controller;

        public AssigneesControllerTests()
        {
            _mockAssigneeService = new Mock<IAssigneeService>();
            _controller = new AssigneesController(_mockAssigneeService.Object);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAssignees_ReturnsOkResult_WithListOfAssignees()
        {
            var apiKey = "validApiKey";
            var assignees = new List<Assignee>
            {
                new Assignee { Id = "1", Name = "Assignee1" },
                new Assignee { Id = "2", Name = "Assignee2" }
            };

            _mockAssigneeService.Setup(service => service.GetAssigneesAsync(apiKey))
                .ReturnsAsync(assignees);

            var result = await _controller.GetAssignees(apiKey) as OkObjectResult;

            Assert.NotNull(result);
            var returnedAssignees = Assert.IsAssignableFrom<IEnumerable<Assignee>>(result.Value);
            Assert.Equal(2, returnedAssignees.Count());
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAssignees_Returns503ServiceUnavailable_OnHttpRequestException()
        {
            var apiKey = "invalidApiKey";

            _mockAssigneeService.Setup(service => service.GetAssigneesAsync(apiKey))
                .ThrowsAsync(new HttpRequestException("Service is down"));

            var result = await _controller.GetAssignees(apiKey) as ObjectResult;

            Assert.NotNull(result);
            Assert.Equal(503, result.StatusCode);
            var errorDetails = result.Value as dynamic;
            Assert.Equal("Service unavailable. Please try again later.", errorDetails.Message);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAssignees_Returns500InternalServerError_OnGenericException()
        {
            var apiKey = "anotherInvalidApiKey";

            _mockAssigneeService.Setup(service => service.GetAssigneesAsync(apiKey))
                .ThrowsAsync(new Exception("Unexpected error"));

            var result = await _controller.GetAssignees(apiKey) as ObjectResult;

            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode);
            var errorDetails = result.Value as dynamic;
            Assert.Equal("An unexpected error occurred.", errorDetails.Message);
        }
    }
}

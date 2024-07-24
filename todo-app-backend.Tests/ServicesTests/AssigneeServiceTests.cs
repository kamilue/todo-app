using Moq;
using System.Net;
using TodoAppBackend.Services;
using TodoAppBackend.Models;
using Newtonsoft.Json;
using Moq.Protected;

namespace todo_app_backend.Tests.ServicesTests
{
    public class AssigneeServiceTests
    {
        private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
        private readonly HttpClient _httpClient;
        private readonly AssigneeService _service;

        public AssigneeServiceTests()
        {
            _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
            _httpClient = new HttpClient(_mockHttpMessageHandler.Object);
            _service = new AssigneeService(_httpClient);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAssigneesAsync_ReturnsAssignees_WhenApiResponseIsSuccessful()
        {
            var apiKey = "test";
            var assignees = new List<Assignee>
            {
                new Assignee { Id = "1", Name = "Assignee1" },
                new Assignee { Id = "2", Name = "Assignee2" }
            };
            var responseContent = JsonConvert.SerializeObject(assignees);
            _mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(responseContent)
                });

            var result = await _service.GetAssigneesAsync(apiKey);

            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Equal(assignees[0].Name, result.First().Name);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAssigneesAsync_ThrowsException_WhenApiResponseIsUnsuccessful()
        {
            var apiKey = "test";
            _mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.InternalServerError
                });

            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetAssigneesAsync(apiKey));
            Assert.Contains("Error while fetching assignees.", exception.Message);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAssigneesAsync_ThrowsException_WhenHttpRequestExceptionOccurs()
        {
            var apiKey = "test";
            _mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .Throws<HttpRequestException>();

            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetAssigneesAsync(apiKey));
            Assert.Contains("Error while fetching assignees.", exception.Message);
        }
    }
}

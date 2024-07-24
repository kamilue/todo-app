using Moq;
using System.Net;
using TodoAppBackend.Services;
using TodoAppBackend.Models;
using Newtonsoft.Json;
using Moq.Protected;

namespace todo_app_backend.Tests.ServicesTests
{
    public class TimesheetServiceTests
    {
        private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
        private readonly HttpClient _httpClient;
        private readonly TimesheetService _service;

        public TimesheetServiceTests()
        {
            _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
            _httpClient = new HttpClient(_mockHttpMessageHandler.Object);
            _service = new TimesheetService(_httpClient);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetTimesheetAsync_ReturnsTimesheets_WhenApiResponseIsSuccessful()
        {
            var assigneeId = "1";
            var date = DateTime.Now;
            var apiKey = "test";
            var timesheets = new List<Timesheet>
            {
                new Timesheet { Date = date, Hours = "9:00-12:00" }
            };
            var responseContent = JsonConvert.SerializeObject(timesheets);
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

            var result = await _service.GetTimesheetAsync(assigneeId, date, apiKey);

            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(timesheets[0].Hours, result.First().Hours);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetTimesheetAsync_ThrowsException_WhenApiResponseIsUnsuccessful()
        {
            var assigneeId = "1";
            var date = DateTime.Now;
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

            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetTimesheetAsync(assigneeId, date, apiKey));
            Assert.Contains("Error while fetching timesheets.", exception.Message);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetTimesheetAsync_ThrowsException_WhenHttpRequestExceptionOccurs()
        {
            var assigneeId = "1";
            var date = DateTime.Now;
            var apiKey = "test";
            _mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .Throws<HttpRequestException>();

            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetTimesheetAsync(assigneeId, date, apiKey));
            Assert.Contains("Error while fetching timesheets.", exception.Message);
        }
    }
}

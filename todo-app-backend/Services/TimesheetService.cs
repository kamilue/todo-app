using Newtonsoft.Json;
using TodoAppBackend.Models;

namespace TodoAppBackend.Services
{
    public class TimesheetService
    {
        private readonly HttpClient _httpClient;

        public TimesheetService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<Timesheet>> GetTimesheetAsync(int assigneeId, DateTime date, string apiKey)
        {
            var response = await _httpClient.GetAsync($"http://remote-assignee-service-stretto.us-east-2.elasticbeanstalk.com/api/assignee/{assigneeId}/timesheet/{date:yyyy-MM}?apiKey={apiKey}");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<IEnumerable<Timesheet>>(content);
        }
    }
}

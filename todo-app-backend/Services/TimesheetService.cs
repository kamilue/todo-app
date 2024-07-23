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

        public async Task<IEnumerable<Timesheet>> GetTimesheetAsync(string assigneeId, DateTime date, string apiKey)
        {
            try
            {
                var url = $"http://remote-assignee-service-stretto.us-east-2.elasticbeanstalk.com/api/assignee/{assigneeId}/timesheet/{date:yyyy-MM}?apiKey={apiKey}";
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var timesheets = JsonConvert.DeserializeObject<List<Timesheet>>(content);

                if (timesheets != null)
                {
                    foreach (var timesheet in timesheets)
                    {
                        timesheet.AssigneeId = assigneeId;
                    }
                }

                return timesheets;
            }
            catch (HttpRequestException ex)
            {
                throw new Exception("Error while fetching timesheets.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred.", ex);
            }
        }
    }
}

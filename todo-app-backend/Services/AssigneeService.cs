using Newtonsoft.Json;
using TodoAppBackend.Interfaces;
using TodoAppBackend.Models;

namespace TodoAppBackend.Services
{
    public class AssigneeService : IAssigneeService
    {
        private readonly HttpClient _httpClient;

        public AssigneeService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<Assignee>> GetAssigneesAsync(string apiKey)
        {
            try
            {
                var response = await _httpClient.GetAsync($"http://remote-assignee-service-stretto.us-east-2.elasticbeanstalk.com/api/assignee?apiKey={apiKey}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<IEnumerable<Assignee>>(content);
            }
            catch (HttpRequestException ex)
            {
                throw new Exception("Error while fetching assignees.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred.", ex);
            }
        }
    }
}

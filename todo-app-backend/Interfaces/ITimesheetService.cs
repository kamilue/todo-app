using TodoAppBackend.Models;

namespace TodoAppBackend.Interfaces
{
    public interface ITimesheetService
    {
        Task<IEnumerable<Timesheet>> GetTimesheetAsync(string assigneeId, DateTime date, string apiKey);
    }
}

using TodoAppBackend.Models;

namespace TodoAppBackend.Interfaces
{
    public interface IAssigneeService
    {
        Task<IEnumerable<Assignee>> GetAssigneesAsync(string apiKey);
    }
}

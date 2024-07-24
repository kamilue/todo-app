using TodoAppBackend.Models;

namespace TodoAppBackend.Interfaces
{
    public interface ITaskCompletionEstimator
    {
        int CalculateAvailableHours(List<Timesheet> timesheets);
        int CalculateAvailableHoursFromToday(List<Timesheet> timesheets);
    }
}

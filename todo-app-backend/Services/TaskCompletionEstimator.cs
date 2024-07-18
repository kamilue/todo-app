using TodoAppBackend.Models;
using Task = TodoAppBackend.Models.Task;

namespace TodoAppBackend.Services
{
    public class TaskCompletionEstimator
    {
        public DateTime EstimateCompletionDate(List<Task> tasks, List<Timesheet> timesheets)
        {
            var totalEstimateHours = tasks.Where(t => t.Status == "TODO").Sum(t => t.Estimate);
            var availableHours = timesheets.SelectMany(t => t.AvailableHours).Sum(tr => (tr.End - tr.Start).TotalHours);

            if (availableHours == 0) return DateTime.MaxValue;

            var daysRequired = Math.Ceiling(totalEstimateHours / availableHours);
            return DateTime.Today.AddDays(daysRequired);
        }
    }
}

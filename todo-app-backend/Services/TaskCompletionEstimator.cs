using TodoAppBackend.Models;

namespace TodoAppBackend.Services
{
    public class TaskCompletionEstimator
    {
        public int CalculateAvailableHours(List<Timesheet> timesheets)
        {
            int totalHours = 0;
            try
            {
                foreach (var timesheet in timesheets)
                {
                    if (!string.IsNullOrEmpty(timesheet.Hours))
                    {
                        var ranges = timesheet.Hours.Split(',');
                        foreach (var range in ranges)
                        {
                            var hours = range.Split('-');
                            if (hours.Length == 2)
                            {
                                TimeSpan startTime = TimeSpan.Parse(hours[0]);
                                TimeSpan endTime = TimeSpan.Parse(hours[1]);
                                totalHours += (int)(endTime - startTime).TotalHours;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calculating available hours: {ex.Message}");
                throw new InvalidOperationException("Failed to calculate available hours.", ex);
            }
            return totalHours;
        }

        public int CalculateAvailableHoursFromToday(List<Timesheet> timesheets)
        {
            int totalHours = 0;
            DateTime today = DateTime.Today;

            try
            {
                foreach (var timesheet in timesheets)
                {
                    if (timesheet.Date >= today && !string.IsNullOrEmpty(timesheet.Hours))
                    {
                        var ranges = timesheet.Hours.Split(',');
                        foreach (var range in ranges)
                        {
                            var hours = range.Split('-');
                            if (hours.Length == 2)
                            {
                                TimeSpan startTime = TimeSpan.Parse(hours[0]);
                                TimeSpan endTime = TimeSpan.Parse(hours[1]);
                                totalHours += (int)(endTime - startTime).TotalHours;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calculating available hours: {ex.Message}");
                throw new InvalidOperationException("Failed to calculate available hours.", ex);
            }
            return totalHours;
        }
    }
}

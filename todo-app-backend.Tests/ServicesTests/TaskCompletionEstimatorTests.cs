using TodoAppBackend.Services;
using TodoAppBackend.Models;

namespace TodoAppBackend.Tests
{
    public class TaskCompletionEstimatorTests
    {
        private readonly TaskCompletionEstimator _estimator;

        public TaskCompletionEstimatorTests()
        {
            _estimator = new TaskCompletionEstimator();
        }

        [Fact]
        public void CalculateAvailableHours_ReturnsCorrectTotalHours()
        {
            var timesheets = new List<Timesheet>
            {
                new Timesheet { Hours = "9:00-12:00,13:00-15:00" },
                new Timesheet { Hours = "10:00-11:00,14:00-17:00" }
            };

            var totalHours = _estimator.CalculateAvailableHours(timesheets);

            Assert.Equal(9, totalHours);
        }

        [Fact]
        public void CalculateAvailableHoursFromToday_ReturnsCorrectTotalHours()
        {
            var today = DateTime.Today;
            var timesheets = new List<Timesheet>
            {
                new Timesheet { Date = today, Hours = "9:00-12:00" },
                new Timesheet { Date = today.AddDays(1), Hours = "10:00-12:00" },
                new Timesheet { Date = today.AddDays(-1), Hours = "8:00-10:00" }
            };

            var totalHours = _estimator.CalculateAvailableHoursFromToday(timesheets);

            Assert.Equal(5, totalHours);
        }
    }
}

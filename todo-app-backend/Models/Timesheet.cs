namespace TodoAppBackend.Models
{
    public class Timesheet
    {
        public int AssigneeId { get; set; }
        public DateTime Date { get; set; }
        public List<TimeRange> AvailableHours { get; set; }
    }
}

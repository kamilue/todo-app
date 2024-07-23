namespace TodoAppBackend.Models
{
    public class Timesheet
    {
        public string AssigneeId { get; set; }
        public DateTime Date { get; set; }
        public string Hours { get; set; }
    }
}

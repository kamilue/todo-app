namespace TodoAppBackend.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string AssigneeId { get; set; }
        public int Estimate { get; set; }
        public string Status { get; set; }
    }
}

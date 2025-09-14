namespace lms_be.DTOs
{
    public class QuizSubmissionDto
    {
        public Dictionary<int, int> Answers { get; set; } = new();
    }
}

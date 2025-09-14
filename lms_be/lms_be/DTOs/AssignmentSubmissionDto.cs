using System;

namespace lms_be.DTOs
{
    public class AssignmentSubmissionDto
    {
        public int AssignmentId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public int StudentId { get; set; }

        public string StudentName { get; set; } = string.Empty;

        public string SubmissionLink { get; set; } = string.Empty;

        public DateTime SubmittedAt { get; set; }
    }
}

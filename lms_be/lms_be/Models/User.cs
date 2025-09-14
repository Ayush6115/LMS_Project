using System.Collections.Generic;

namespace lms_be.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public string Role { get; set; }

        public ICollection<CourseEnrollment> Enrollments { get; set; } = new List<CourseEnrollment>();

        public ICollection<AssignmentSubmission> AssignmentSubmissions { get; set; } = new List<AssignmentSubmission>();

        public ICollection<QuizSubmission> QuizSubmissions { get; set; } = new List<QuizSubmission>();
    }
}

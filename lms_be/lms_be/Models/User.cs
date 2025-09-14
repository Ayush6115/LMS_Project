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

        // Course enrollments
        public ICollection<CourseEnrollment> Enrollments { get; set; } = new List<CourseEnrollment>();

        // NEW: assignment submissions by this user
        public ICollection<AssignmentSubmission> AssignmentSubmissions { get; set; } = new List<AssignmentSubmission>();

        // NEW: quiz submissions by this user
        public ICollection<QuizSubmission> QuizSubmissions { get; set; } = new List<QuizSubmission>();
    }
}

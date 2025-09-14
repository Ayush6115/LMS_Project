using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace lms_be.Models
{
    public class Quiz
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CourseId { get; set; }

        public Course Course { get; set; } // Navigation property

        [Required]
        public string Title { get; set; } = string.Empty;

        public List<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Optional
        public DateTime? DueDate { get; set; }
        public int DurationMinutes { get; set; } = 0;

        // NEW: submissions for this quiz
        public ICollection<QuizSubmission> Submissions { get; set; } = new List<QuizSubmission>();
    }
}

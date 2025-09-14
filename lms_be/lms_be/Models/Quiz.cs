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

        public Course Course { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public List<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? DueDate { get; set; }
        public int DurationMinutes { get; set; } = 0;

        public ICollection<QuizSubmission> Submissions { get; set; } = new List<QuizSubmission>();
    }
}

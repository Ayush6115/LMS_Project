using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace lms_be.DTOs
{
    public class QuizDto
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public List<QuizQuestionDto> Questions { get; set; } = new List<QuizQuestionDto>();

        // NEW: student submission info
        public int? Submission { get; set; }  // Score
        public bool IsSubmitted { get; set; } = false;
    }
}

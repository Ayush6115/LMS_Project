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

        public int? Submission { get; set; }

        public bool IsSubmitted { get; set; } = false;
    }
}

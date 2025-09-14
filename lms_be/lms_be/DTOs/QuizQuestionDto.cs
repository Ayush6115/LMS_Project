using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace lms_be.DTOs
{
    public class QuizQuestionDto
    {
        public int Id { get; set; }

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        [Required]
        public List<string> Options { get; set; } = new List<string>();

        [Required]
        public int CorrectAnswer { get; set; }
    }
}

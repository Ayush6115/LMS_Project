using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace lms_be.Models
{
    public class QuizQuestion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string QuestionText { get; set; } = string.Empty;

        [Required]
        public List<string> Options { get; set; } = new List<string>();

        [Required]
        public int CorrectAnswer { get; set; }

        // Foreign key
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
    }
}

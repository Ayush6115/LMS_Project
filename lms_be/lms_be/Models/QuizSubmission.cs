using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace lms_be.Models
{
    public class QuizSubmission
    {
        [Key]
        public int Id { get; set; }

        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }

        public int StudentId { get; set; }
        public User Student { get; set; }

        [NotMapped]
        public Dictionary<int, int> Answers { get; set; } = new();

        // Store dictionary as JSON in DB
        public string AnswersJson
        {
            get => JsonSerializer.Serialize(Answers);
            set => Answers = string.IsNullOrEmpty(value)
                ? new Dictionary<int, int>()
                : JsonSerializer.Deserialize<Dictionary<int, int>>(value);
        }

        public int Score { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}

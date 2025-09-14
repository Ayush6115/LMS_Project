using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace lms_be.Models
{
    public class AssignmentSubmission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Assignment")]
        public int AssignmentId { get; set; }
        public Assignment Assignment { get; set; }

        [Required]
        [ForeignKey("User")]
        public int StudentId { get; set; }
        public User Student { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}

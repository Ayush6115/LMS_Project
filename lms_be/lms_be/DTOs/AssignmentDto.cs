using System;
using System.ComponentModel.DataAnnotations;

namespace lms_be.DTOs
{
    public class AssignmentDto
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime DueDate { get; set; }

        // NEW: student submission info
        public string? Submission { get; set; }  // Submitted content
        public bool IsSubmitted { get; set; } = false;
    }
}

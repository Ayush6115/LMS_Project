using System;
using System.Collections.Generic;

namespace lms_be.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string? Thumbnail { get; set; }

        public int TeacherId { get; set; }

        public List<AssignmentDto> Assignments { get; set; } = new List<AssignmentDto>();

        public List<QuizDto> Quizzes { get; set; } = new List<QuizDto>();
    }
}

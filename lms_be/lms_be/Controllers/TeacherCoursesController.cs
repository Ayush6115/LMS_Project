using lms_be.DTOs;
using lms_be.Models;
using lms_be.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace lms_be.Controllers
{
    [ApiController]
    [Route("api/teacher/courses")]
    [Authorize(Roles = "Teacher")]
    public class TeacherCoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly IAssignmentService _assignmentService;
        private readonly IQuizService _quizService;

        public TeacherCoursesController(
            ICourseService courseService,
            IAssignmentService assignmentService,
            IQuizService quizService)
        {
            _courseService = courseService;
            _assignmentService = assignmentService;
            _quizService = quizService;
        }

        // -------------------- COURSES --------------------
        [HttpPost("create-course")]
        public IActionResult CreateCourse([FromBody] CourseDto dto)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            if (teacherId == 0) return Unauthorized("Teacher ID not found in token");

            var course = _courseService.CreateCourse(teacherId, dto);
            return Ok(course);
        }

        [HttpGet("get-courses")]
        public IActionResult GetCourses()
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var courses = _courseService.GetCoursesByTeacher(teacherId);

            var courseDtos = courses.Select(c => new CourseDto
            {
                Id = c.Id,
                Title = c.Title,
                Content = c.Content,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                Thumbnail = c.Thumbnail
            }).ToList();


            return Ok(courseDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetCourseDetail(int id)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var course = _courseService.GetCourseById(id);
            if (course == null || course.TeacherId != teacherId)
                return NotFound(new { error = "Course not found or not authorized" });

            var courseDto = new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Content = course.Content,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Thumbnail = course.Thumbnail
            };

            return Ok(courseDto);
        }

        [HttpPut("update-course/{id}")]
        public IActionResult UpdateCourse(int id, [FromBody] CourseDto dto)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var updatedCourse = _courseService.UpdateCourse(teacherId, id, dto);
            if (updatedCourse == null)
                return NotFound(new { error = "Course not found or not authorized" });

            return Ok(updatedCourse);
        }

        [HttpDelete("delete-course/{id}")]
        public IActionResult DeleteCourse(int id)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var deleted = _courseService.DeleteCourse(teacherId, id);
            if (!deleted)
                return NotFound(new { error = "Course not found or not authorized" });

            return Ok(new { message = "Course deleted successfully" });
        }

        // -------------------- ASSIGNMENTS --------------------
        [HttpPost("{courseId}/assignments")]
        public IActionResult CreateAssignment(int courseId, [FromBody] AssignmentDto dto)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var assignment = _assignmentService.CreateAssignment(teacherId, courseId, dto);
            if (assignment == null)
                return NotFound(new { error = "Course not found or not authorized" });

            return Ok(new AssignmentDto
            {
                Id = assignment.Id,
                Title = assignment.Title,
                Description = assignment.Description,
                DueDate = assignment.DueDate
            });
        }

        [HttpGet("{courseId}/assignments")]
        public IActionResult GetAssignments(int courseId)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var assignments = _assignmentService.GetAssignmentsByCourse(teacherId, courseId);

            var assignmentDtos = assignments.Select(a => new AssignmentDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                DueDate = a.DueDate
            }).ToList();

            return Ok(assignmentDtos);
        }

        [HttpPut("{courseId}/assignments/{assignmentId}")]
        public IActionResult UpdateAssignment(int courseId, int assignmentId, [FromBody] AssignmentDto dto)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var updated = _assignmentService.UpdateAssignment(teacherId, courseId, assignmentId, dto);
            if (updated == null)
                return NotFound(new { error = "Assignment not found or not authorized" });

            return Ok(new AssignmentDto
            {
                Title = updated.Title,
                Description = updated.Description,
                DueDate = updated.DueDate
            });
        }

        [HttpDelete("{courseId}/assignments/{assignmentId}")]
        public IActionResult DeleteAssignment(int courseId, int assignmentId)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var deleted = _assignmentService.DeleteAssignment(teacherId, courseId, assignmentId);
            if (!deleted)
                return NotFound(new { error = "Assignment not found or not authorized" });

            return Ok(new { message = "Assignment deleted successfully" });
        }

        [HttpGet("{courseId}/student-assignments")]
        public IActionResult GetStudentAssignments(int courseId)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");

            // Get all assignments for this course belonging to the teacher
            var assignments = _assignmentService.GetAssignmentsByCourse(teacherId, courseId);
            if (assignments == null || !assignments.Any())
                return Ok(new List<object>()); // no assignments yet

            // Get submissions
            var submissions = assignments
                .SelectMany(a => a.Submissions.Select(s => new
                {
                    s.Id,
                    StudentId = s.StudentId,
                    StudentName = s.Student.Name,
                    AssignmentId = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    SubmissionLink = s.Content,
                    SubmittedAt = s.SubmittedAt
                }))
                .ToList();

            return Ok(submissions);
        }


        // -------------------- QUIZZES --------------------
        [HttpPost("{courseId}/quizzes")]
        public IActionResult CreateQuiz(int courseId, [FromBody] QuizDto dto)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var quiz = _quizService.CreateQuiz(teacherId, courseId, dto);
            if (quiz == null)
                return NotFound(new { error = "Course not found or not authorized" });

            var quizResponse = new QuizDto
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Questions = quiz.Questions.Select(q => new QuizQuestionDto
                {
                    QuestionText = q.QuestionText,
                    Options = q.Options.ToList(),
                    CorrectAnswer = q.CorrectAnswer
                }).ToList()
            };

            return Ok(quizResponse);
        }

        [HttpGet("{courseId}/quizzes")]
        public IActionResult GetQuizzes(int courseId)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var quizzes = _quizService.GetQuizzesByCourse(teacherId, courseId);

            var quizDtos = quizzes.Select(q => new QuizDto
            {
                Id = q.Id,
                Title = q.Title,
                Questions = q.Questions.Select(qq => new QuizQuestionDto
                {
                    QuestionText = qq.QuestionText,
                    Options = qq.Options.ToList(),
                    CorrectAnswer = qq.CorrectAnswer
                }).ToList()
            }).ToList();

            return Ok(quizDtos);
        }

        [HttpPut("{courseId}/quizzes/{quizId}")]
        public IActionResult UpdateQuiz(int courseId, int quizId, [FromBody] QuizDto dto)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var updated = _quizService.UpdateQuiz(teacherId, courseId, quizId, dto);
            if (updated == null)
                return NotFound(new { error = "Quiz not found or not authorized" });

            var quizResponse = new QuizDto
            {
                Title = updated.Title,
                Questions = updated.Questions.Select(q => new QuizQuestionDto
                {
                    QuestionText = q.QuestionText,
                    Options = q.Options.ToList(),
                    CorrectAnswer = q.CorrectAnswer
                }).ToList()
            };

            return Ok(quizResponse);
        }

        [HttpDelete("{courseId}/quizzes/{quizId}")]
        public IActionResult DeleteQuiz(int courseId, int quizId)
        {
            var teacherId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var deleted = _quizService.DeleteQuiz(teacherId, courseId, quizId);

            if (!deleted)
                return NotFound(new { error = "Quiz not found or not authorized" });

            return Ok(new { message = "Quiz deleted successfully" });
        }

    }
}

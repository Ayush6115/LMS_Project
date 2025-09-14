using lms_be.Services;
using lms_be.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lms_be.Data;
using System.Linq;
using lms_be.Models;

namespace lms_be.Controllers
{
    [ApiController]
    [Route("api/student/courses")]
    [Authorize(Roles = "Student")]
    public class StudentCoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly LmsDbContext _context;

        public StudentCoursesController(ICourseService courseService, LmsDbContext context)
        {
            _courseService = courseService;
            _context = context;
        }

        // GET: api/student/courses/all
        [HttpGet("all")]
        public IActionResult GetAllCourses()
        {
            var courses = _courseService.GetAllCourses()
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Content = c.Content,
                    Thumbnail = c.Thumbnail ?? "",
                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .ToList();

            return Ok(courses);
        }

        // GET: api/student/courses/{id}/preview
        [HttpGet("{id}/preview")]
        public IActionResult GetCoursePreview(int id)
        {
            var course = _context.Courses
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Content = c.Content,
                    Thumbnail = c.Thumbnail,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    TeacherId = c.TeacherId
                })
                .FirstOrDefault(c => c.Id == id);

            if (course == null)
                return NotFound(new { error = "Course not found" });

            return Ok(course);
        }

        // GET: api/student/courses/enrolled
        [HttpGet("enrolled")]
        public async Task<IActionResult> GetEnrolledCourses()
        {
            var studentIdClaim = User.FindFirst("id")?.Value;
            if (studentIdClaim == null) return Unauthorized("Student ID not found");

            var studentId = int.Parse(studentIdClaim);

            var courses = await _context.CourseEnrollments
                .Where(e => e.StudentId == studentId)
                .Include(e => e.Course)
                .Select(e => e.Course)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Content = c.Content,
                    Thumbnail = c.Thumbnail ?? "",
                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .ToListAsync();

            return Ok(courses);
        }

        // GET: api/student/courses/{id}
[HttpGet("{id}")]
public async Task<IActionResult> GetCourse(int id)
{
    var studentIdClaim = User.FindFirst("id")?.Value;
    if (studentIdClaim == null) return Unauthorized("Student ID not found");

    var studentId = int.Parse(studentIdClaim);

    // Check if student is enrolled in this course
    var enrolled = await _context.CourseEnrollments
        .AnyAsync(e => e.StudentId == studentId && e.CourseId == id);

    if (!enrolled)
        return NotFound(new { error = "You are not enrolled in this course" });

    // Get course with assignments and quizzes
    var course = await _context.Courses
        .Include(c => c.Assignments)
        .Include(c => c.Quizzes)
        .ThenInclude(q => q.Questions)
        .FirstOrDefaultAsync(c => c.Id == id);

    if (course == null)
        return NotFound(new { error = "Course not found" });

    // Fetch student submissions
    var assignmentSubmissions = await _context.AssignmentSubmissions
        .Where(s => s.StudentId == studentId && s.Assignment.CourseId == id)
        .ToListAsync();

    var quizSubmissions = await _context.QuizSubmissions
        .Where(s => s.StudentId == studentId && s.Quiz.CourseId == id)
        .ToListAsync();

    // Build response DTO
    var courseDto = new
    {
        course.Id,
        course.Title,
        course.Content,
        course.Thumbnail,
        course.StartDate,
        course.EndDate,
        Assignments = course.Assignments.Select(a => new
        {
            a.Id,
            a.Title,
            a.DueDate,
            a.Description,
            Submission = assignmentSubmissions.FirstOrDefault(s => s.AssignmentId == a.Id)?.Content,
            IsSubmitted = assignmentSubmissions.Any(s => s.AssignmentId == a.Id)
        }),
        Quizzes = course.Quizzes.Select(q => new
        {
            q.Id,
            q.Title,
            Questions = q.Questions.Select(qq => new
            {
                qq.Id,
                qq.QuestionText,
                Options = qq.Options.ToList(),
                qq.CorrectAnswer
            }).ToList(),
            Submission = quizSubmissions.FirstOrDefault(s => s.QuizId == q.Id)?.Score,
            IsSubmitted = quizSubmissions.Any(s => s.QuizId == q.Id)
        })
    };

    return Ok(courseDto);
}



        // POST: api/student/courses/enroll/{id}
        [HttpPost("enroll/{id}")]
        public IActionResult EnrollInCourse(int id)
        {
            var studentIdClaim = User.FindFirst("id")?.Value;
            if (studentIdClaim == null) return Unauthorized("Student ID not found");

            var studentId = int.Parse(studentIdClaim);
            var result = _courseService.EnrollStudent(studentId, id);

            if (!result) return BadRequest(new { error = "Enrollment failed or already enrolled" });

            return Ok(new { message = "Enrolled successfully" });
        }

        [HttpPost("{courseId}/assignments/{assignmentId}/submit")]
        public async Task<IActionResult> SubmitAssignment(int courseId, int assignmentId, [FromBody] AssignmentSubmissionDto submissionDto)
        {
            var studentIdClaim = User.FindFirst("id")?.Value;
            if (studentIdClaim == null) return Unauthorized("Student ID not found");

            var studentId = int.Parse(studentIdClaim);

            // Check enrollment
            var enrolled = await _context.CourseEnrollments
                .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);
            if (!enrolled) return BadRequest(new { error = "You are not enrolled in this course" });

            // Check if assignment exists
            var assignment = await _context.Assignments
                .FirstOrDefaultAsync(a => a.Id == assignmentId && a.CourseId == courseId);
            if (assignment == null) return NotFound(new { error = "Assignment not found" });

            // Check if student already submitted
            var existingSubmission = await _context.AssignmentSubmissions
                .FirstOrDefaultAsync(s => s.AssignmentId == assignmentId && s.StudentId == studentId);

            if (existingSubmission != null)
            {
                return BadRequest(new { error = "You have already submitted this assignment" });
            }

            // Create new submission
            var newSubmission = new AssignmentSubmission
            {
                AssignmentId = assignmentId,
                StudentId = studentId,
                Content = submissionDto.Content,
                SubmittedAt = DateTime.UtcNow
            };
            _context.AssignmentSubmissions.Add(newSubmission);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Assignment submitted successfully" });
        }


        // POST: api/student/courses/{courseId}/quizzes/{quizId}/submit
        [HttpPost("{courseId}/quizzes/{quizId}/submit")]
        public async Task<IActionResult> SubmitQuiz(int courseId, int quizId, [FromBody] QuizSubmissionDto quizSubmission)
        {
            var studentIdClaim = User.FindFirst("id")?.Value;
            if (studentIdClaim == null) return Unauthorized("Student ID not found");

            var studentId = int.Parse(studentIdClaim);

            // Check enrollment
            var enrolled = await _context.CourseEnrollments
                .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);
            if (!enrolled) return BadRequest(new { error = "You are not enrolled in this course" });

            // Get quiz and questions
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == quizId && q.CourseId == courseId);

            if (quiz == null) return NotFound(new { error = "Quiz not found" });

            // Calculate score
            int totalQuestions = quiz.Questions.Count;
            int correctAnswers = 0;

            foreach (var question in quiz.Questions)
            {
                if (quizSubmission.Answers.TryGetValue(question.Id, out int answer) &&
                    answer == question.CorrectAnswer)
                {
                    correctAnswers++;
                }
            }

            var score = (int)((double)correctAnswers / totalQuestions * 100);

            // Save quiz submission
            var existingSubmission = await _context.QuizSubmissions
                .FirstOrDefaultAsync(s => s.QuizId == quizId && s.StudentId == studentId);

            if (existingSubmission != null)
            {
                existingSubmission.Answers = quizSubmission.Answers;
                existingSubmission.Score = score;
                existingSubmission.SubmittedAt = DateTime.UtcNow;
            }
            else
            {
                var newSubmission = new QuizSubmission
                {
                    QuizId = quizId,
                    StudentId = studentId,
                    Answers = quizSubmission.Answers,
                    Score = score,
                    SubmittedAt = DateTime.UtcNow
                };
                _context.QuizSubmissions.Add(newSubmission);
            }

            await _context.SaveChangesAsync();
            return Ok(new { score });
        }
    }
}

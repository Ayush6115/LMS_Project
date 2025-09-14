using lms_be.Data;
using lms_be.DTOs;
using lms_be.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace lms_be.Services
{
    public class CourseService : ICourseService
    {
        private readonly LmsDbContext _context;

        public CourseService(LmsDbContext context)
        {
            _context = context;
        }

        // -------------------- TEACHER METHODS --------------------

        public Course CreateCourse(int teacherId, CourseDto dto)
        {
            var course = new Course
            {
                Title = dto.Title,
                Content = dto.Content,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Thumbnail = dto.Thumbnail,
                TeacherId = teacherId
            };

            _context.Courses.Add(course);
            _context.SaveChanges();
            return course;
        }

        public IEnumerable<AssignmentSubmissionDto> GetStudentAssignmentsForTeacher(int teacherId, int courseId)
        {
            var assignments = _context.Assignments
                .Include(a => a.Submissions)
                .ThenInclude(s => s.Student)
                .Where(a => a.CourseId == courseId && a.Course.TeacherId == teacherId)
                .ToList();

            return assignments
                .SelectMany(a => a.Submissions.Select(s => new AssignmentSubmissionDto
                {
                    AssignmentId = a.Id,
                    Title = a.Title,
                    StudentId = s.StudentId,
                    StudentName = s.Student.Name,
                    SubmissionLink = s.Content,
                    SubmittedAt = s.SubmittedAt
                }))
                .ToList();
        }


        public IEnumerable<CourseDto> GetCoursesByTeacher(int teacherId)
        {
            return _context.Courses
                .Where(c => c.TeacherId == teacherId)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Content = c.Content,
                    Thumbnail = c.Thumbnail ?? "",
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    TeacherId = c.TeacherId
                })
                .ToList();
        }

        public CourseDto? GetCourseById(int courseId)
        {
            var course = _context.Courses.FirstOrDefault(c => c.Id == courseId);
            if (course == null) return null;

            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Content = course.Content,
                Thumbnail = course.Thumbnail ?? "",
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                TeacherId = course.TeacherId
            };
        }

        public CourseDto? UpdateCourse(int teacherId, int courseId, CourseDto dto)
        {
            var course = _context.Courses.FirstOrDefault(c => c.Id == courseId && c.TeacherId == teacherId);
            if (course == null) return null;

            course.Title = dto.Title;
            course.Content = dto.Content;
            course.StartDate = dto.StartDate;
            course.EndDate = dto.EndDate;
            course.Thumbnail = dto.Thumbnail;

            _context.SaveChanges();

            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Content = course.Content,
                Thumbnail = course.Thumbnail ?? "",
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                TeacherId = course.TeacherId
            };
        }

        public bool DeleteCourse(int teacherId, int courseId)
        {
            var course = _context.Courses.FirstOrDefault(c => c.Id == courseId && c.TeacherId == teacherId);
            if (course == null) return false;

            _context.Courses.Remove(course);
            _context.SaveChanges();
            return true;
        }

        // -------------------- STUDENT METHODS --------------------

        public bool EnrollStudent(int studentId, int courseId)
        {
            if (_context.CourseEnrollments.Any(e => e.StudentId == studentId && e.CourseId == courseId))
                return false;

            _context.CourseEnrollments.Add(new CourseEnrollment
            {
                StudentId = studentId,
                CourseId = courseId
            });

            _context.SaveChanges();
            return true;
        }

        public IEnumerable<CourseDto> GetCoursesByStudent(int studentId)
        {
            return _context.CourseEnrollments
                .Where(e => e.StudentId == studentId)
                .Select(e => e.Course)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Content = c.Content,
                    Thumbnail = c.Thumbnail ?? "",
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    TeacherId = c.TeacherId
                })
                .ToList();
        }

        public IEnumerable<CourseDto> GetAllCourses()
        {
            return _context.Courses
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Content = c.Content,
                    Thumbnail = c.Thumbnail ?? "",
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    TeacherId = c.TeacherId
                })
                .ToList();
        }

        // -------------------- NEW: STUDENT COURSE DETAIL --------------------

        public CourseDto? GetCourseWithDetailsForStudent(int courseId, int studentId)
        {
            // Check enrollment
            var enrolled = _context.CourseEnrollments
                .Any(e => e.StudentId == studentId && e.CourseId == courseId);

            if (!enrolled) return null;

            var course = _context.Courses
                .Include(c => c.Assignments)
                .Include(c => c.Quizzes)
                .ThenInclude(q => q.Questions)
                .FirstOrDefault(c => c.Id == courseId);

            if (course == null) return null;

            // Fetch student submissions
            var assignmentSubmissions = _context.AssignmentSubmissions
                .Where(s => s.StudentId == studentId && s.Assignment.CourseId == courseId)
                .ToList();

            var quizSubmissions = _context.QuizSubmissions
                .Where(s => s.StudentId == studentId && s.Quiz.CourseId == courseId)
                .ToList();

            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Content = course.Content,
                Thumbnail = course.Thumbnail,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                TeacherId = course.TeacherId,
                Assignments = course.Assignments.Select(a => new AssignmentDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    DueDate = a.DueDate,
                    Submission = assignmentSubmissions.FirstOrDefault(s => s.AssignmentId == a.Id)?.Content,
                    IsSubmitted = assignmentSubmissions.Any(s => s.AssignmentId == a.Id)
                }).ToList(),
                Quizzes = course.Quizzes.Select(q => new QuizDto
                {
                    Id = q.Id,
                    Title = q.Title,
                    Questions = q.Questions.Select(qq => new QuizQuestionDto
                    {
                        Id = qq.Id,
                        QuestionText = qq.QuestionText,
                        Options = qq.Options,
                        CorrectAnswer = qq.CorrectAnswer
                    }).ToList(),
                    Submission = quizSubmissions.FirstOrDefault(s => s.QuizId == q.Id)?.Score,
                    IsSubmitted = quizSubmissions.Any(s => s.QuizId == q.Id)
                }).ToList()
            };
        }
    }
}

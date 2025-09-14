using lms_be.Data;
using lms_be.DTOs;
using lms_be.Models;
using lms_be.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace lms_be.Services
{
    public class QuizService : IQuizService
    {
        private readonly LmsDbContext _context;

        public QuizService(LmsDbContext context)
        {
            _context = context;
        }

        public Quiz CreateQuiz(int teacherId, int courseId, QuizDto dto)
        {
            var course = _context.Courses.FirstOrDefault(c => c.Id == courseId && c.TeacherId == teacherId);
            if (course == null) return null;

            var quiz = new Quiz
            {
                CourseId = courseId,
                Title = dto.Title,
                Questions = dto.Questions.Select(q => new QuizQuestion
                {
                    QuestionText = q.QuestionText,
                    Options = q.Options,
                    CorrectAnswer = q.CorrectAnswer
                }).ToList()
            };

            _context.Quizzes.Add(quiz);
            _context.SaveChanges();
            return quiz;
        }

        public List<Quiz> GetQuizzesByCourse(int teacherId, int courseId)
        {
            return _context.Quizzes
                .Where(q => q.CourseId == courseId && q.Course.TeacherId == teacherId)
                .Include(q => q.Questions)
                .ToList();
        }

        // Updated to include courseId
        public Quiz? UpdateQuiz(int teacherId, int courseId, int quizId, QuizDto dto)
        {
            var quiz = _context.Quizzes.FirstOrDefault(q => q.Id == quizId && q.CourseId == courseId && q.Course.TeacherId == teacherId);
            if (quiz == null) return null;

            quiz.Title = dto.Title;
            quiz.Questions.Clear();

            quiz.Questions = dto.Questions.Select(q => new QuizQuestion
            {
                QuestionText = q.QuestionText,
                Options = q.Options,
                CorrectAnswer = q.CorrectAnswer
            }).ToList();

            _context.SaveChanges();
            return quiz;
        }

        // Updated to include courseId
        public bool DeleteQuiz(int teacherId, int courseId, int quizId)
        {
            var quiz = _context.Quizzes.FirstOrDefault(q => q.Id == quizId && q.CourseId == courseId && q.Course.TeacherId == teacherId);
            if (quiz == null) return false;

            _context.Quizzes.Remove(quiz);
            _context.SaveChanges();
            return true;
        }
    }
}

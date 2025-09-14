using lms_be.DTOs;
using lms_be.Models;
using System.Collections.Generic;

namespace lms_be.Services
{
    public interface IQuizService
    {
        Quiz CreateQuiz(int teacherId, int courseId, QuizDto dto);
        List<Quiz> GetQuizzesByCourse(int teacherId, int courseId);

        Quiz? UpdateQuiz(int teacherId, int courseId, int quizId, QuizDto dto);
        bool DeleteQuiz(int teacherId, int courseId, int quizId);
    }
}

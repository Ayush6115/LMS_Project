using lms_be.DTOs;
using lms_be.Models;
using System.Collections.Generic;

namespace lms_be.Services
{
    public interface ICourseService
    {
        // -------------------- TEACHER METHODS --------------------
        Course CreateCourse(int teacherId, CourseDto dto);
        IEnumerable<CourseDto> GetCoursesByTeacher(int teacherId);
        CourseDto? GetCourseById(int courseId);
        CourseDto? UpdateCourse(int teacherId, int courseId, CourseDto dto);
        bool DeleteCourse(int teacherId, int courseId);

        IEnumerable<AssignmentSubmissionDto> GetStudentAssignmentsForTeacher(int teacherId, int courseId);

        // -------------------- STUDENT METHODS --------------------
        bool EnrollStudent(int studentId, int courseId);
        IEnumerable<CourseDto> GetCoursesByStudent(int studentId);
        IEnumerable<CourseDto> GetAllCourses();

        // -------------------- NEW METHOD FOR STUDENT COURSE DETAIL --------------------
        CourseDto? GetCourseWithDetailsForStudent(int courseId, int studentId);
    }
}

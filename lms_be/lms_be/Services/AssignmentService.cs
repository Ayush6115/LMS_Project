using lms_be.Data;
using lms_be.DTOs;
using lms_be.Models;
using lms_be.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace lms_be.Services
{
    public class AssignmentService : IAssignmentService
    {
        private readonly LmsDbContext _context;

        public AssignmentService(LmsDbContext context)
        {
            _context = context;
        }

        public Assignment CreateAssignment(int teacherId, int courseId, AssignmentDto dto)
        {
            // Ensure teacher owns the course
            var course = _context.Courses.FirstOrDefault(c => c.Id == courseId && c.TeacherId == teacherId);
            if (course == null) return null;

            var assignment = new Assignment
            {
                CourseId = courseId,
                Title = dto.Title,
                Description = dto.Description,
                DueDate = dto.DueDate
            };

            _context.Assignments.Add(assignment);
            _context.SaveChanges();
            return assignment;
        }

        public List<Assignment> GetAssignmentsByCourse(int teacherId, int courseId)
        {
            return _context.Assignments
                .Where(a => a.CourseId == courseId && a.Course.TeacherId == teacherId)
                .ToList();
        }

        // Updated to include courseId
        public Assignment? UpdateAssignment(int teacherId, int courseId, int assignmentId, AssignmentDto dto)
        {
            var assignment = _context.Assignments.FirstOrDefault(a => a.Id == assignmentId && a.CourseId == courseId && a.Course.TeacherId == teacherId);
            if (assignment == null) return null;

            assignment.Title = dto.Title;
            assignment.Description = dto.Description;
            assignment.DueDate = dto.DueDate;

            _context.SaveChanges();
            return assignment;
        }

        // Updated to include courseId
        public bool DeleteAssignment(int teacherId, int courseId, int assignmentId)
        {
            var assignment = _context.Assignments.FirstOrDefault(a => a.Id == assignmentId && a.CourseId == courseId && a.Course.TeacherId == teacherId);
            if (assignment == null) return false;

            _context.Assignments.Remove(assignment);
            _context.SaveChanges();
            return true;
        }
    }
}

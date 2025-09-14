using lms_be.DTOs;
using lms_be.Models;
using System.Collections.Generic;

namespace lms_be.Services
{
    public interface IAssignmentService
    {
        Assignment CreateAssignment(int teacherId, int courseId, AssignmentDto dto);
        List<Assignment> GetAssignmentsByCourse(int teacherId, int courseId);

        Assignment? UpdateAssignment(int teacherId, int courseId, int assignmentId, AssignmentDto dto);
        bool DeleteAssignment(int teacherId, int courseId, int assignmentId);
    }
}

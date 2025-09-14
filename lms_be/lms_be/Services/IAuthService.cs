using lms_be.DTOs;
using lms_be.Models;
using System.Collections.Generic;

namespace lms_be.Services
{
    public interface IAuthService
    {
        User Register(RegisterDto dto);
        string Login(LoginDto dto);
        bool DeleteUser(int id);
        IEnumerable<User> GetAllUsers();
    }
}

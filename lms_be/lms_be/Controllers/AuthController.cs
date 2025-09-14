using lms_be.DTOs;
using lms_be.Models;
using lms_be.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace lms_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            if (dto == null)
                return BadRequest(new { error = "Request body is empty" });

            try
            {
                dto.Role = "Student";

                var user = _authService.Register(dto);

                return Ok(new
                {
                    message = "User registered successfully",
                    user = new
                    {
                        user.Id,
                        user.Name,
                        user.Email,
                        user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            if (dto == null)
                return BadRequest(new { error = "Request body is empty" });

            try
            {
                var token = _authService.Login(dto);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("create-user")]
        [Authorize(Roles = "Admin")] 
        public IActionResult CreateUser([FromBody] RegisterDto dto)
        {
            if (dto == null)
                return BadRequest(new { error = "Request body is empty" });

            try
            {
                var user = _authService.Register(dto);
                return Ok(new
                {
                    message = "User created successfully",
                    user = new { user.Id, user.Name, user.Email, user.Role }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/auth/users
        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = _authService.GetAllUsers();
                var result = users.Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Role
                });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }



        // DELETE: api/auth/users/{id}
        [HttpDelete("users/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                var deleted = _authService.DeleteUser(id);
                if (!deleted)
                    return NotFound(new { error = "User not found" });

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
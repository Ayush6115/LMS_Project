using lms_be.Data;
using lms_be.Models;
using System.Collections.Generic;
using System.Linq;

namespace lms_be.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly LmsDbContext _context;

        public UserRepository(LmsDbContext context)
        {
            _context = context;
        }

        public User GetByEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }

        public User GetById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public void Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Remove(User user)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        }
    }
}

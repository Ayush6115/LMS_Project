using lms_be.Models;
using System.Collections.Generic;

namespace lms_be.Repositories
{
    public interface IUserRepository
    {
        User GetByEmail(string email);

        User GetById(int id);

        void Add(User user);

        void Remove(User user);

        List<User> GetAll();
    }
}

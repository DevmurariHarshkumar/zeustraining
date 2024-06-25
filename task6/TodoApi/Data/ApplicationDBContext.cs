
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.data
{
    public class ApplicationDBContext(DbContextOptions dbContextOptions) : DbContext(dbContextOptions)
    {
        public DbSet<User> user { get; set; }
    }
}
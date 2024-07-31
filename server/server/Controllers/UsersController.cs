using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.data;
using MySql.Data.MySqlClient;
using Dapper;

namespace api.Controllers
{
    [Route("api/v1/user")]
    [ApiController]

    public class UserController(ApplicationDBContext context) : ControllerBase
    {
        private readonly ApplicationDBContext _context = context;

        [HttpGet]
        public IActionResult GetAll()
        {
            var x = _context.user.ToList();
            return Ok(x);
        }


        [HttpGet("getdb")]
        public async Task<IActionResult> GetFromDB()
        {
            string connectionString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
        
            MySqlConnection connection = new(connectionString);
            
            try{
                connection.Open();
                string query = "SELECT * FROM user LIMIT 500";
                MySqlCommand command = new(query, connection)
                {
                    Connection = connection
                };
                List<User> users = (List<User>)await connection.QueryAsync<User>(query);                
                Console.WriteLine(users);
                return Ok(users);
            }

            catch (Exception ex){
                Console.WriteLine("Error: " + ex.Message);
            }
            finally{
                if (connection.State == System.Data.ConnectionState.Open)
                    connection.Close();
            }

            return Ok();
        }
    }
}

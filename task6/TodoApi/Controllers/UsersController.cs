using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.data;
using Microsoft.VisualBasic.FileIO;
using System.Text;
using MySql;
using Humanizer;
using System.Runtime.CompilerServices;
using System.Diagnostics;
using System.Data;
using MySql.Data.MySqlClient;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using mmongo;
using System;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using Dapper;




namespace api.Controllers
{
    [Route("api")]
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


        // OLD METHOD 2 MINUTES
        [HttpPost("uploadonebyone")]
        public ActionResult Uploadlong(IFormFile file)
        {
            Upload fileobj = new Upload();
            var result = fileobj.UploadLong(file);
            if(result){
                return Ok();
            }
            return BadRequest("file process failed");
        }



        // NEW METHOD STORED PROCEDURES
        [HttpPost("uploadstoredprocedure")]
        public ActionResult uploadStoredProcedures(IFormFile file)
        {
            Upload fileobj = new Upload();
            var result = fileobj.UploadStoredProcedure(file);
            if(result){
                Mongo connector = new Mongo();
                connector.EstablishMongoConn();
                return Ok();
            }
            return BadRequest("file process failed");
        }


        [HttpPost("uploadsinglequery")]

        public IActionResult Fastestupload(IFormFile file)
        {
            Upload fileobj = new Upload();
            var result = fileobj.FastestUpload(file);
            if(result){

                return Ok();
            }
            return BadRequest("file process failed");
        }


        [HttpGet("getdb")]
        public async Task<IActionResult> GetFromDB()
        {

            // var conString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
            // StringBuilder sCommand = new StringBuilder("SELECT * FROM user;");
            // // Console.WriteLine(sCommand);
            // using (MySqlConnection mConnection = new MySqlConnection(conString))
            // {
            //     Console.WriteLine(sCommand);
            //     using (MySqlCommand myCmd = new MySqlCommand(sCommand.ToString(), mConnection))
            //     {
            //         MySqlTransaction myTrans;
            //         myTrans = mConnection.BeginTransaction();
            //         myCmd.Connection = mConnection;
            //         myCmd.Transaction = myTrans;
            //         myCmd.CommandType = System.Data.CommandType.Text;
            //         // await myCmd.ExecuteNonQueryAsync();
            //         myCmd.ExecuteNonQuery();
            //         myTrans.Commit();
            //     }
            // }



            string connectionString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
        
            MySqlConnection connection = new MySqlConnection(connectionString);
            
            try
            {
                connection.Open();
                string query = "SELECT * FROM user LIMIT 100";
                MySqlCommand command = new MySqlCommand(query, connection);
                // using (MySqlDataReader reader = command.ExecuteReader())
                // {
                //     Console.WriteLine("reader......"+ reader);
                //     while (reader.Read())
                //     {
                //         // Example: Accessing data by column name
                //         string Name = reader.GetString("Name");
                //         string Email = reader.GetString("Email");
                //         // return Ok();
                //         // Console.WriteLine($"Name: {Name}, Email: {Email}");
                //     }
                // }
                command.Connection = connection;
                List<User> users = (List<User>)await connection.QueryAsync<User>(query);                
                Console.WriteLine(users);
                return Ok(users);
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            finally
            {
                if (connection.State == System.Data.ConnectionState.Open)
                    connection.Close();
            }


            // var x = _context.user;
            // Console.WriteLine(x);
            return Ok();
        }
    }
}

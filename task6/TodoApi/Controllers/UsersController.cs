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




namespace api.Controllers
{
    [Route("[controller]")]
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
    }
}

using Microsoft.AspNetCore.Mvc;
using api.data;
using mmongo;


namespace api.Controllers
{
    [Route("api/v1/upload")]
    [ApiController]
    public class UploadController(ApplicationDBContext context) : ControllerBase
    {
        private readonly ApplicationDBContext _context = context;


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

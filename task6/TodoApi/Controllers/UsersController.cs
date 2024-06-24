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


namespace api.Controllers{
    [Route("[controller]")]
    [ApiController]

    public class UserController(ApplicationDBContext context) : ControllerBase{
    private readonly ApplicationDBContext _context = context;

    [HttpGet]
    public IActionResult GetAll()
    {
        var x = _context.Xyz.ToList();
        Console.WriteLine("asdfasdf"+ Ok(x).Value);
        Console.WriteLine("fghhd"+ string.Join(", ",  Ok(x).Value ));

        return Ok(x);
        
    }

    [HttpPost("upload")]
    public async Task<ActionResult> Postingfunc(IFormFile file)
    {
        // Console.WriteLine("filename", file);
        Console.WriteLine("filename", file.FileName[0]);
        if (file == null){
            Console.WriteLine("NULL");
        }

        // using (var reader = new StreamReader(file.OpenReadStream()))
        // Console.WriteLine("reader", reader);
        string aConnectionString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh";
        
        Stopwatch stopWatch =new Stopwatch();

        using (MySql.Data.MySqlClient.MySqlConnection mConnection = new MySql.Data.MySqlClient.MySqlConnection(aConnectionString)){
            mConnection.Open();

            stopWatch.Start();
            using (TextFieldParser parser = new TextFieldParser(file.OpenReadStream()))
            {
                // Console.WriteLine("parser", parser);
                // parser.TextFieldType = FieldType.Delimited;


                parser.TextFieldType = FieldType.Delimited;
                parser.SetDelimiters(",");  
                
                while (!parser.EndOfData)
                {         
                    //Process row
                    string[] fields = parser.ReadFields();
                    string f0 = fields[0];
                    string f1 = fields[1];
                    string f2 = fields[2];
                    string f3 = fields[3];
                    string f4 = fields[4];
                    string f5 = fields[5];
                    string f6 = fields[6];
                    string f7 = fields[7];
                    string f8 = fields[8];
                    string f9 = fields[9];
                    float f10 = float.Parse(fields[10]);
                    float f11 = float.Parse(fields[11]);
                    float f12 = float.Parse(fields[12]);
                    float f13 = float.Parse(fields[13]);

                    // Console.WriteLine(f10 + "----------------------------------");

                    // foreach (string field in fields)
                    // {
                    //     // Processing logic to be done afterwards
                    //     Console.WriteLine(string.Join(", ", field));

                    // }

                    // string arow = string.Join(", ", fields);
                    // Console.WriteLine("arow"+ arow);


                    StringBuilder ssCommand = new StringBuilder("INSERT INTO xyz (Email, Name, Country, State, City, Tno, A1, A2, DOB, GS1920, GS2021, GS2122, GS2223, GS2324) VALUES (");

                    // ssCommand.Append(arow);

                    string y;
                    y = String.Format("\"{0}\", \"{1}\", \"{2}\", \"{3}\", \"{4}\", \"{5}\", \"{6}\", \"{7}\", \"{8}\", {9}, {10}, {11}, {12}, {13}", f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13);
                    // Console.WriteLine("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy : "+ y);
                    ssCommand.Append(y);
                    ssCommand.Append(");");

                    // Console.WriteLine("ssCommand : "+ ssCommand);

                    // INSERT NOW
                    
                    using (MySql.Data.MySqlClient.MySqlCommand myCmd = new MySql.Data.MySqlClient.MySqlCommand(ssCommand.ToString(), mConnection))
                    {
                        // myCmd.CommandType = CommandType.Text;
                        myCmd.ExecuteNonQuery();
                    }
                    
                }

            }
            
        }
















        //
        // string ConnectionString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh";
        // StringBuilder sCommand = new StringBuilder("INSERT INTO xyz VALUES ");


        stopWatch.Stop();
        Console.WriteLine("asfasdfasdfasdf"+ stopWatch.Elapsed);
        return Ok(file);
    }

    }
}



// public static void BulkToMySQL()
// {
//     string ConnectionString = "server=192.168.1xxx";
//     StringBuilder sCommand = new StringBuilder("INSERT INTO User (FirstName, LastName) VALUES ");           
//     using (MySqlConnection mConnection = new MySqlConnection(ConnectionString))
//     {
//         List<string> Rows = new List<string>();
//         for (int i = 0; i < 100000; i++)
//         {
//             Rows.Add(string.Format("('{0}','{1}')", MySqlHelper.EscapeString("test"), MySqlHelper.EscapeString("test")));
//         }
//         sCommand.Append(string.Join(",", Rows));
//         sCommand.Append(";");
//         mConnection.Open();
//         using (MySqlCommand myCmd = new MySqlCommand(sCommand.ToString(), mConnection))
//         {
//             myCmd.CommandType = CommandType.Text;
//             myCmd.ExecuteNonQuery();
//         }
//     }
// }














// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;
// using api.Data;
// using api.Dto;
// using api.Mappers;
// using api.Models;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
 
// namespace api.Controllers
// {
//     [Route("api/User")]
//     [ApiController]
   
//     public class UserController:ControllerBase
//     {
//         private readonly ApplicationDBContext _context;
//         public UserController(ApplicationDBContext context)
//         {
//             _context = context;
//         }
 
//         [HttpGet]
//         public async Task<IActionResult> GetAll()
//         {
//             var users=await _context.Users.ToListAsync();
//             var userModel=users.Select(u=>u.ToUserDto());
//             return Ok(userModel);
//         }
 
 
//         [HttpGet("{id}")]
//         public async Task<IActionResult> GetById([FromRoute]int id)
//         {
//             var user=await _context.Users.FirstOrDefaultAsync(x => x.UserID == id);
//             if(user == null)
//             {
//                 return NotFound();
//             }
//             return Ok(user.ToUserDto());
 
//         }
//         [HttpPost]
//         public async Task<IActionResult> Create(CreateUserDto user)
//         {
//             var userModel=user.ToUserFromUserDto();
//             await _context.Users.AddAsync(userModel);
//             await _context.SaveChangesAsync();
//             return CreatedAtAction(nameof(GetById),new {id=userModel.UserID},userModel.ToUserDto());
//         }
 
//     [HttpPost("upload")]
//     public async Task<IActionResult> UploadCsv(IFormFile file)
//     {
//         List<User> userToUpload = new List<User>();
//         bool isFirstLine = true;
//         if (file == null || file.Length == 0)
//             return BadRequest("No file uploaded.");
 
//         // Read the file content line by line
//         using (var reader = new StreamReader(file.OpenReadStream(), Encoding.UTF8))
//         {
//             while (!reader.EndOfStream)
//             {
//                 if(isFirstLine)
//                 {
//                     isFirstLine=false;
//                     continue;
//                 }
//                 var line = await reader.ReadLineAsync();
//                 var fields=line.Split(",");
//                 var user=new User{
//                 Email=fields[0],
//                 Name=fields[1],
//                 Country=fields[2],
//                 State=fields[3],
//                 City=fields[4],
//                 Telephone=fields[5],
//                 AddressLine1=fields[6],
//                 AddressLine2=fields[7],
//                 DateOfBirth=fields[8],
//                 SalaryFY2019=float.fields[9],
//                 SalaryFY2020=decimal.fields[10],
//                 SalaryFY2021=decimal.fields[11],
//                 SalaryFY2022=decimal.fields[12],
//                 SalaryFY2023=decimal.fields[13]
 
//                 };
//                 // Process each line as needed (e.g., validate, parse, save to database)
//                Console.WriteLine(line);
//             }
//         }
 
//         return Ok("CSV file uploaded and processed successfully.");
//     }
//      }
// }
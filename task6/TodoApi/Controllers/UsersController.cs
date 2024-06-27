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


namespace api.Controllers{
    [Route("[controller]")]
    [ApiController]

    public class UserController(ApplicationDBContext context) : ControllerBase{
    private readonly ApplicationDBContext _context = context;

    [HttpGet]
    public IActionResult GetAll()
    {
        var x = _context.user.ToList();
        // Console.WriteLine("ok val"+ Ok(x).Value);
        // Console.WriteLine("--"+ string.Join(", ",  Ok(x).Value ));

        return Ok(x);
        
    }


    // OLD METHOD 2 MINUTES
    [HttpPost("uploadonebyone")]
    public async Task<ActionResult> uploadLong(IFormFile file)
    {
        // Console.WriteLine("filename", file);
        Console.WriteLine("filename", file.FileName[0]);
        if (file == null){
            Console.WriteLine("NULL");
        }
        string aConnectionString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh";
        Stopwatch stopWatch =new Stopwatch();

        using (MySql.Data.MySqlClient.MySqlConnection mConnection = new MySql.Data.MySqlClient.MySqlConnection(aConnectionString)){
            mConnection.Open();
            stopWatch.Start();
            using (TextFieldParser parser = new TextFieldParser(file.OpenReadStream()))
            {
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

                    StringBuilder ssCommand = new StringBuilder("REPLACE INTO user (Email, Name, Country, State, City, Tno, A1, A2, DOB, GS1920, GS2021, GS2122, GS2223, GS2324) VALUES (");
                    string y;
                    y = String.Format("\"{0}\", \"{1}\", \"{2}\", \"{3}\", \"{4}\", \"{5}\", \"{6}\", \"{7}\", \"{8}\", {9}, {10}, {11}, {12}, {13}", f0, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13);
                    // Console.WriteLine("yyyy: "+ y);
                    ssCommand.Append(y);
                    ssCommand.Append(");");
                    
                    // INSERT NOW
                    using (MySql.Data.MySqlClient.MySqlCommand myCmd = new MySql.Data.MySqlClient.MySqlCommand(ssCommand.ToString(), mConnection))
                    {
                        // myCmd.CommandType = CommandType.Text;
                        myCmd.ExecuteNonQuery();
                    }
                }
            }
        }
        stopWatch.Stop();
        Console.WriteLine("TOTAL TIME"+ stopWatch.Elapsed);
        return Ok(file);
    }


    // NEW METHOD TO BE DONE.......
    // [HttpPost("upload")]
    // public async Task<ActionResult> Postingfunc(IFormFile file)
    // {
    //     // Console.WriteLine("filename", file);
    //     Console.WriteLine("filename", file.FileName);
    //     if (file == null)
    //     {
    //         Console.WriteLine("NULL");
    //         return BadRequest("File is null");
    //     }

    //     string aConnectionString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh";
    //     Stopwatch stopWatch = new Stopwatch();

    //     using (MySql.Data.MySqlClient.MySqlConnection mConnection = new MySql.Data.MySqlClient.MySqlConnection(aConnectionString))
    //     {
    //         mConnection.Open();
    //         stopWatch.Start();

    //         using (TextFieldParser parser = new TextFieldParser(file.OpenReadStream()))
    //         {
    //             parser.TextFieldType = FieldType.Delimited;
    //             parser.SetDelimiters(",");

    //             while (!parser.EndOfData)
    //             {
    //                 string[] fields = parser.ReadFields();
    //                 if (fields.Length < 14)
    //                 {
    //                     // Handle the case where there are not enough fields in the row
    //                     continue;
    //                 }

    //                 // Process row
    //                 string f0 = fields[0];
    //                 string f1 = fields[1];
    //                 string f2 = fields[2];
    //                 string f3 = fields[3];
    //                 string f4 = fields[4];
    //                 string f5 = fields[5];
    //                 string f6 = fields[6];
    //                 string f7 = fields[7];
    //                 string f8 = fields[8];
    //                 string f9 = fields[9];
    //                 float f10 = float.Parse(fields[10]);
    //                 float f11 = float.Parse(fields[11]);
    //                 float f12 = float.Parse(fields[12]);
    //                 float f13 = float.Parse(fields[13]);

    //                 // Call stored procedure
    //                 using (MySql.Data.MySqlClient.MySqlCommand myCmd = new MySql.Data.MySqlClient.MySqlCommand("InsertIntoXYZ", mConnection))
    //                 {
    //                     myCmd.CommandType = CommandType.StoredProcedure;
    //                     myCmd.Parameters.AddWithValue("@Email", f0);
    //                     myCmd.Parameters.AddWithValue("@Name", f1);
    //                     myCmd.Parameters.AddWithValue("@Country", f2);
    //                     myCmd.Parameters.AddWithValue("@State", f3);
    //                     myCmd.Parameters.AddWithValue("@City", f4);
    //                     myCmd.Parameters.AddWithValue("@Tno", f5);
    //                     myCmd.Parameters.AddWithValue("@A1", f6);
    //                     myCmd.Parameters.AddWithValue("@A2", f7);
    //                     myCmd.Parameters.AddWithValue("@DOB", f8);
    //                     myCmd.Parameters.AddWithValue("@GS1920", f9);
    //                     myCmd.Parameters.AddWithValue("@GS2021", f10);
    //                     myCmd.Parameters.AddWithValue("@GS2122", f11);
    //                     myCmd.Parameters.AddWithValue("@GS2223", f12);
    //                     myCmd.Parameters.AddWithValue("@GS2324", f13);
    //                     await myCmd.ExecuteNonQueryAsync();
    //                 }
    //             }
    //         }

    //         stopWatch.Stop();
    //         Console.WriteLine("TOTAL TIME: " + stopWatch.Elapsed);
    //     }

    //     return Ok(file);
    // }




    // NEW METHOD STORED PROCEDURES
    [HttpPost("uploadstoredprocedure")]
    public async Task<ActionResult> uploadStoredProcedures(IFormFile file){
        Console.WriteLine("filename: ", file.FileName[0]);
        if (file == null){
            Console.WriteLine("NULL");
        }

        string aConnectionString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
        //for loop for each row
            using (MySql.Data.MySqlClient.MySqlConnection mConnection = new MySql.Data.MySqlClient.MySqlConnection(aConnectionString)){
                mConnection.Open();
                // string ssCommand;
                // ssCommand = "";
                using (TextFieldParser parser = new TextFieldParser(file.OpenReadStream())){
                    parser.TextFieldType = FieldType.Delimited;
                    parser.SetDelimiters(",");
                    Stopwatch stopWatch2 =new Stopwatch();
                    stopWatch2.Start();
                    while (!parser.EndOfData)
                    {
                        //Process row
                        string[] fields = parser.ReadFields();
                    
                    using (var myCmd = new MySql.Data.MySqlClient.MySqlCommand("InsertIntoXYZ", mConnection)){
                        myCmd.CommandType = CommandType.StoredProcedure;
                        myCmd.Parameters.AddWithValue("p_Email", fields[0]);
                        myCmd.Parameters.AddWithValue("p_Name", fields[1]);
                        myCmd.Parameters.AddWithValue("p_Country", fields[2]);
                        myCmd.Parameters.AddWithValue("p_State", fields[3]);
                        myCmd.Parameters.AddWithValue("p_City", fields[4]);
                        myCmd.Parameters.AddWithValue("p_Tno", fields[5]);
                        myCmd.Parameters.AddWithValue("p_A1", fields[6]);
                        myCmd.Parameters.AddWithValue("p_A2", fields[7]);
                        myCmd.Parameters.AddWithValue("p_DOB", fields[8]);
                        myCmd.Parameters.AddWithValue("p_GS1920", fields[9]);
                        myCmd.Parameters.AddWithValue("p_GS2021", fields[10]);
                        myCmd.Parameters.AddWithValue("p_GS2122", fields[11]);
                        myCmd.Parameters.AddWithValue("p_GS2223", fields[12]);
                        myCmd.Parameters.AddWithValue("p_GS2324", fields[13]);
                        myCmd.ExecuteNonQuery();
                    }
                    }
                stopWatch2.Stop();
                Console.WriteLine("TOTAL TIME"+ stopWatch2.Elapsed);
            }
        return Ok(file);
    }
    }


    [HttpPost("uploadsinglequery")]

        public async Task<IActionResult> FasterUploadCs21(IFormFile file)
        {

            var time = new Stopwatch();
            time.Start();
            List<User> userToUpload = new List<User>();
            List<User> userToUpload1 = new List<User>();
            bool isFirstLine = true;

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            try
            {
                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    while (!reader.EndOfStream)
                    {
                        var line = await reader.ReadLineAsync();
                        if (string.IsNullOrEmpty(line))
                            continue; // if any empty lines

                        var fields = line.Split(",");

                        if (DateTime.TryParseExact(fields[8], "yyyy-M-d", null, System.Globalization.DateTimeStyles.None, out DateTime dateOfBirth))
                        {
                            User user = new User
                            {
                                Email = fields[0],
                                Name = fields[1],
                                Country = fields[2],
                                State = fields[3],
                                City = fields[4],
                                Tno = fields[5],
                                A1 = fields[6],
                                A2 = fields[7],
                                DOB = dateOfBirth,
                                GS1920 = decimal.Parse(fields[9]),
                                GS2021 = decimal.Parse(fields[10]),
                                GS2122 = decimal.Parse(fields[11]),
                                GS2223 = decimal.Parse(fields[12]),
                                GS2324 = decimal.Parse(fields[13]) 
                            };
                            userToUpload.Add(user);
                        }
                        else
                        {
                            // agar invalid date format
                            continue;
                        }
                    }
                }

                userToUpload1 = userToUpload.Distinct().ToList();
                var conString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
                StringBuilder sCommand = new StringBuilder("REPLACE INTO user (Email, Name, Country, State, City, Tno, A1, A2, DOB, GS1920, GS2021, GS2122, GS2223, GS2324) VALUES ");
                Console.WriteLine(sCommand);
                using (MySqlConnection mConnection = new MySqlConnection(conString))
                {
                    mConnection.Open();
                    List<string> Rows = new List<string>();
                    // Console.WriteLine(userToUpload[100000].id);

                    for (int i = 0; i < 99999; i++)
                    {
                        Rows.Add(string.Format("('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}', {9}, {10}, {11}, {12}, {13})",
                        MySqlHelper.EscapeString(userToUpload1[i].Email),
                        MySqlHelper.EscapeString(userToUpload1[i].Name),
                        MySqlHelper.EscapeString(userToUpload1[i].Country),
                        MySqlHelper.EscapeString(userToUpload1[i].State),
                        MySqlHelper.EscapeString(userToUpload1[i].City),
                        MySqlHelper.EscapeString(userToUpload1[i].Tno),
                        MySqlHelper.EscapeString(userToUpload1[i].A1),
                        MySqlHelper.EscapeString(userToUpload1[i].A2),
                        userToUpload[i].DOB.ToString("yyyy-MM-dd"),
                        userToUpload1[i].GS1920,
                        userToUpload1[i].GS2021,
                        userToUpload1[i].GS2122,
                        userToUpload1[i].GS2223,
                        userToUpload1[i].GS2324));
                    }
                    sCommand.Append(string.Join(",", Rows));
                    sCommand.Append(";");

                    using (MySqlCommand myCmd = new MySqlCommand(sCommand.ToString(), mConnection))
                    {
                        myCmd.CommandType = System.Data.CommandType.Text;
                        await myCmd.ExecuteNonQueryAsync();
                    }
                }
                Console.WriteLine(time.Elapsed);
                return Ok("CSV file uploaded and processed successfully.");
            }

            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            finally
            {
                // System.IO.File.Exists(userToUpload);
            }
        }
    }
}




























// OLDEST METHOD
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





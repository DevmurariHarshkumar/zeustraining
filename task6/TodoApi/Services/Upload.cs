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

namespace api.Controllers{
    public class Upload{
        
        public bool UploadLong(IFormFile file){
            
            Console.WriteLine("filename", file.FileName[0]);
            if (file == null)
            {
                Console.WriteLine("NULL");
            }
            string aConnectionString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh";
            Stopwatch stopWatch = new Stopwatch();

            using (MySql.Data.MySqlClient.MySqlConnection mConnection = new MySql.Data.MySqlClient.MySqlConnection(aConnectionString))
            {
                mConnection.Open();
                stopWatch.Start();
                using (TextFieldParser parser = new TextFieldParser(file?.OpenReadStream()!))
                {
                    parser.TextFieldType = FieldType.Delimited;
                    parser.SetDelimiters(",");
                    while (!parser!.EndOfData)
                    {
                        //Process row
                        string[] fields = parser?.ReadFields()!;
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
            Console.WriteLine("TOTAL TIME" + stopWatch.Elapsed);
            return true;
        }



        public bool UploadStoredProcedure(IFormFile file){
            Console.WriteLine("filename: ", file.FileName[0]);
            if (file == null)
            {
                Console.WriteLine("NULL");
            }

            string aConnectionString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
            //for loop for each row
            using (MySql.Data.MySqlClient.MySqlConnection mConnection = new MySql.Data.MySqlClient.MySqlConnection(aConnectionString))
            {
                mConnection.Open();
                // string ssCommand;
                // ssCommand = "";
                using (TextFieldParser parser = new TextFieldParser(file?.OpenReadStream()!))
                {
                    parser.TextFieldType = FieldType.Delimited;
                    parser.SetDelimiters(",");
                    Stopwatch stopWatch2 = new Stopwatch();
                    stopWatch2.Start();
                    while (!parser!.EndOfData)
                    {
                        if (parser == null){
                            Console.WriteLine("asdfafj");
                        }
                        //Process row
                        string[] fields = parser?.ReadFields()!;

                        using (var myCmd = new MySql.Data.MySqlClient.MySqlCommand("InsertIntoXYZ", mConnection))
                        {
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
                    Console.WriteLine("TOTAL TIME" + stopWatch2.Elapsed);
                }
            }
            return true;
        }


        public bool FastestUpload(IFormFile file){
            var factory = new ConnectionFactory { HostName = "localhost" };
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.QueueDeclare(queue: "queue1",
                    durable: false,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);

            using var memoryStream = new MemoryStream();
            file?.CopyTo(memoryStream);
            var fileBytes = memoryStream.ToArray();

            channel.BasicPublish(exchange: string.Empty,
                                routingKey: "queue1",
                                basicProperties: null,
                                body: fileBytes);
                                
            Console.WriteLine($" [x] Sent {fileBytes}");
            Mongo connector = new Mongo();
            connector.EstablishMongoConn();

            Console.WriteLine(" Press [enter] to exit.");
            return true;
        }
    }
}

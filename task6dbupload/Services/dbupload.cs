using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using MySqlConnector;
using System.Runtime.CompilerServices;
using System.Diagnostics;
using System.Data;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text.Json;
using Newtonsoft.Json.Serialization;
using System.Drawing.Printing;
using api.Models;


namespace dbupload{
    public class FastestUpload
    {
        public string UploadToDb()
        {
            Console.WriteLine("inside fastest upload");
            var factory = new ConnectionFactory { HostName = "localhost" };
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.QueueDeclare(queue: "queue2",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);

            Console.WriteLine(" [*] Waiting for messages.");

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                Console.WriteLine("received in callback func");

                List<User> userToUpload = new List<User>();
                List<User> userToUpload1 = new List<User>();
                
                var fileBytes = ea.Body.ToArray();
                var batch = Encoding.UTF8.GetString(fileBytes);
                userToUpload = JsonSerializer.Deserialize<List<User>>(batch);
                // Console.WriteLine("user to upload : " + userToUpload);


                var conString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
                StringBuilder sCommand = new StringBuilder("REPLACE INTO user (Email, Name, Country, State, City, Tno, A1, A2, DOB, GS1920, GS2021, GS2122, GS2223, GS2324) VALUES ");
                Console.WriteLine(sCommand);
                using (MySqlConnection mConnection = new MySqlConnection(conString))
                {
                    mConnection.Open();
                    List<string> Rows = new List<string>();
                    Console.WriteLine(userToUpload.Count);
                    for (int i = 0; i < userToUpload.Count; i++)
                    {
                        Rows.Add(string.Format("('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}', {9}, {10}, {11}, {12}, {13})",
                        MySqlHelper.EscapeString(userToUpload[i].Email),
                        MySqlHelper.EscapeString(userToUpload[i].Name),
                        MySqlHelper.EscapeString(userToUpload[i].Country),
                        MySqlHelper.EscapeString(userToUpload[i].State),
                        MySqlHelper.EscapeString(userToUpload[i].City),
                        MySqlHelper.EscapeString(userToUpload[i].Tno),
                        MySqlHelper.EscapeString(userToUpload[i].A1),
                        MySqlHelper.EscapeString(userToUpload[i].A2),
                        userToUpload[i].DOB.ToString("yyyy-MM-dd"),
                        userToUpload[i].GS1920,
                        userToUpload[i].GS2021,
                        userToUpload[i].GS2122,
                        userToUpload[i].GS2223,
                        userToUpload[i].GS2324));
                    }
                    sCommand.Append(string.Join(",", Rows));
                    sCommand.Append(";");
                    // Console.WriteLine(sCommand);
                    using (MySqlCommand myCmd = new MySqlCommand(sCommand.ToString(), mConnection))
                    {
                        myCmd.CommandType = System.Data.CommandType.Text;
                        await myCmd.ExecuteNonQueryAsync();
                    }
                }
                // Console.WriteLine(time.Elapsed);
                Console.WriteLine(" Press [enter] to exit.");
            };

            channel.BasicConsume(queue: "queue2",
                                autoAck: true,
                                consumer: consumer);

            Console.WriteLine(" Press [enter] to exit.");
            Console.ReadLine();

            return "end of dbupload";
    }
}
}














                // using MemoryStream memoryStream = new MemoryStream(fileBytes);
                // using StreamReader reader = new StreamReader(memoryStream, Encoding.UTF8);

        //         var time = new Stopwatch();
        //         time.Start();
                

        //         int num = 0;
        //         int batch_size = 1000;
        //         try
        //         {
        //             while (!reader.EndOfStream)
        //             {
        //                 var line = await reader.ReadLineAsync();
        //                 if (string.IsNullOrEmpty(line))
        //                     continue; // if any empty lines


        //                 if (DateTime.TryParseExact(fields[8], "yyyy-M-d", null, System.Globalization.DateTimeStyles.None, out DateTime dateOfBirth))
        //                 {
        //                     User user = new User
        //                     {
        //                         Email = fields[0],
        //                         Name = fields[1],
        //                         Country = fields[2],
        //                         State = fields[3],
        //                         City = fields[4],
        //                         Tno = fields[5],
        //                         A1 = fields[6],
        //                         A2 = fields[7],
        //                         DOB = dateOfBirth,
        //                         GS1920 = decimal.Parse(fields[9]),
        //                         GS2021 = decimal.Parse(fields[10]),
        //                         GS2122 = decimal.Parse(fields[11]),
        //                         GS2223 = decimal.Parse(fields[12]),
        //                         GS2324 = decimal.Parse(fields[13])
        //                     };
        //                     userToUpload.Add(user);
        //                     num++;
        //                     if (num > batch_size){
        //                         // add to queue
        //                         Console.WriteLine("batch uploaded");
        //                         AddToQueue(userToUpload);
        //                         userToUpload.Clear();
        //                         num = 0;
        //                     }
        //                 }
        //                 else
        //                 {
        //                     // agar invalid date format
        //                     continue;
        //                 }
        //             }
        //             if(num!=0){
        //                 Console.WriteLine("batch uploaded");
        //                 AddToQueue(userToUpload);
        //                 userToUpload.Clear();
        //                 num = 0;
        //             }

        //             userToUpload1 = userToUpload.Distinct().ToList();

                    
        //         }

        //         catch (Exception ex)
        //         {
        //             Console.WriteLine($"Internal server error: {ex.Message}");
        //         }
        //         Console.WriteLine("END OF BLOCK OF RESPONSE");
        //     };


        //     channel.BasicConsume(queue: "hello",
        //                         autoAck: true,
        //                         consumer: consumer);

        //     Console.WriteLine(" Press [enter] to exit.");
        //     Console.ReadLine();



        //     return "dbuploded successfully.";
        // }








            // var factory = new ConnectionFactory { HostName = "localhost" };
            // using var connection = factory.CreateConnection();
            // using var channel = connection.CreateModel();

            // channel.QueueDeclare(queue: "todb",
            //         durable: false,
            //         exclusive: false,
            //         autoDelete: false,
            //         arguments: null);

            // var consumer = new EventingBasicConsumer(channel);
            // consumer.Received +=  (model, ea) =>
            // {
                // Console.WriteLine("received in task6dbupload func");
                // byte[] body = ea.Body.ToArray();
                // var message = Encoding.UTF8.GetString(body);
                // var data = message.Split('|');
                // var Uid = data[1];
                // var Fid = data[2];
                // List<Employee> userToUpload = new List<Employee>();
                // if (data != null && data.Length > 0)
                // {
                //     var list = data[0];
                //     try
                //     {
                //         userToUpload = JsonSerializer.Deserialize<List<Employee>>(list);
                //     }
                //     catch (JsonException ex)
                //     {
                //         Console.WriteLine($"Error deserializing JSON: {ex.Message}");
                //         return;
                //     }
                // }
                // else
                // {
                //     Console.WriteLine("No data found in the message.");
                //     return;
                // }
                // if (userToUpload != null)
                // {
                //     var cancellationToken = new CancellationTokenSource();
                //     // await InsertEmployeeToDatabaseAsync(userToUpload);
                //     await pipeline.ExecuteAsync(async token =>
                //         {
                //             await InsertEmployeeToDatabaseAsync(userToUpload, Uid, Fid);
                //             //  await GetCustomResponseAsync(token);
                //         }, cancellationToken.Token);
                // }
                // else
                // {
                // Console.WriteLine("userToUpload list is null");
                // }



            // var conString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
            // StringBuilder sCommand = new StringBuilder("REPLACE INTO user (Email, Name, Country, State, City, Tno, A1, A2, DOB, GS1920, GS2021, GS2122, GS2223, GS2324) VALUES ");
            // Console.WriteLine(sCommand);
            // using (MySqlConnection mConnection = new MySqlConnection(conString))
            // {
            //     mConnection.Open();
            //     List<string> Rows = new List<string>();
            //     for (int i = 0; i < 99999; i++)
            //     {
            //         Rows.Add(string.Format("('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}', {9}, {10}, {11}, {12}, {13})",
            //         MySqlHelper.EscapeString(userToUpload1[i].Email),
            //         MySqlHelper.EscapeString(userToUpload1[i].Name),
            //         MySqlHelper.EscapeString(userToUpload1[i].Country),
            //         MySqlHelper.EscapeString(userToUpload1[i].State),
            //         MySqlHelper.EscapeString(userToUpload1[i].City),
            //         MySqlHelper.EscapeString(userToUpload1[i].Tno),
            //         MySqlHelper.EscapeString(userToUpload1[i].A1),
            //         MySqlHelper.EscapeString(userToUpload1[i].A2),
            //         userToUpload[i].DOB.ToString("yyyy-MM-dd"),
            //         userToUpload1[i].GS1920,
            //         userToUpload1[i].GS2021,
            //         userToUpload1[i].GS2122,
            //         userToUpload1[i].GS2223,
            //         userToUpload1[i].GS2324));
            //     }
            //     sCommand.Append(string.Join(",", Rows));
            //     sCommand.Append(";");
            //     using (MySqlCommand myCmd = new MySqlCommand(sCommand.ToString(), mConnection))
            //     {
            //         myCmd.CommandType = System.Data.CommandType.Text;
            //         await myCmd.ExecuteNonQueryAsync();
            //     }
            // }
            // Console.WriteLine(time.Elapsed);
            // Console.WriteLine(" Press [enter] to exit.");
            // return true;
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MySqlConnector;
using System.Text.Json;
using api.Models;

using MongoDB.Driver;
using MongoDB.Bson;


namespace dbupload{
    public class FastestUpload
    {
        public string UploadToDb()
        {
            Console.WriteLine("inside fastest upload...");
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
            //consumer.Received += async (model, ea) =>
            consumer.Received += (model, ea) =>
            {
                Console.WriteLine("received in callback func");

                List<User> userToUpload = new List<User>();
                List<User> userToUpload1 = new List<User>();
                
                var fileBytes = ea.Body.ToArray();
                var batch = Encoding.UTF8.GetString(fileBytes);
                userToUpload = JsonSerializer.Deserialize<List<User>>(batch)!;

                var conString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
                StringBuilder sCommand = new StringBuilder("REPLACE INTO user (Email, Name, Country, State, City, Tno, A1, A2, DOB, GS1920, GS2021, GS2122, GS2223, GS2324) VALUES ");
                // Console.WriteLine(sCommand);
                using (MySqlConnection mConnection = new MySqlConnection(conString))
                {
                    mConnection.Open();
                    List<string> Rows = new List<string>();
                    // Console.WriteLine(userToUpload?.Count);
                    for (int i = 0; i < userToUpload?.Count; i++)
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
                        // await myCmd.ExecuteNonQueryAsync();
                        myCmd.ExecuteNonQuery();
                    }
                }
                // Console.WriteLine(time.Elapsed);

            };

            channel.BasicConsume(queue: "queue2",
                                autoAck: true,
                                consumer: consumer);

            Console.WriteLine(" Press [enter] to exit.");
            Console.ReadLine();

            return "done";
    }
}
}

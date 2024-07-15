using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MySqlConnector;
using System.Text.Json;
using api.Models;
using mmongo;
using MongoDB.Driver;
using MongoDB.Bson;


namespace dbupload
{
    public class FastestUpload
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public string UploadToDb()
        {
            Console.WriteLine("inside fastest upload...");
            var factory = new ConnectionFactory { HostName = "localhost" };
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            var watch = new System.Diagnostics.Stopwatch();

            channel.QueueDeclare(queue: "queue2",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);

            Console.WriteLine(" [*] Waiting for messages.");

            var consumer = new EventingBasicConsumer(channel);
            // consumer.Received += async (model, ea) =>
            consumer.Received += (model, ea) =>
            {
                Console.WriteLine("batch received in callback func");
                watch.Start();

                List<User> userToUpload = new List<User>();
                List<User> userToUpload1 = new List<User>();

                var fileBytes = ea.Body.ToArray();
                var batch = Encoding.UTF8.GetString(fileBytes);
                userToUpload = JsonSerializer.Deserialize<List<User>>(batch)!;

                StringBuilder sCommand = new StringBuilder("REPLACE INTO user (Email, Name, Country, State, City, Tno, A1, A2, DOB, GS1920, GS2021, GS2122, GS2223, GS2324) VALUES ");
                List<string> Rows = new List<string>();
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

                var myConnString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";

                MySqlConnection myConnection = new MySqlConnection(myConnString);
                myConnection.Open();
                MySqlCommand myCommand = myConnection.CreateCommand();
                MySqlTransaction myTrans;
                myTrans = myConnection.BeginTransaction();
                myCommand.Connection = myConnection;
                myCommand.Transaction = myTrans;

                try{
                    myCommand.CommandText = sCommand.ToString();
                    myCommand.ExecuteNonQuery();
                    myTrans.Commit();
                    watch.Stop();
                    log.Info($"Execution Time: {watch.ElapsedMilliseconds} ms");
                }
                catch(Exception e){
                    try{
                        myTrans.Rollback();
                    }
                    catch (MySqlException ex){
                            if (myTrans.Connection != null){
                            log.Error("An exception of type " + ex.GetType() + " was encountered while attempting to roll back the transaction.");
                        }
                    }
                    log.Error("An exception of type " + e.GetType() + " was encountered while inserting the data.");
                    log.Info("Neither record was written to database.");
                }
                finally{
                    myConnection.Close();
                }




                // OLD CODE WITH DEADLOCK
                // from here
                // var conString = "Server=127.0.0.1; User ID=root; Password=root; Database=harsh; CharSet=utf8";
                // StringBuilder sCommand = new StringBuilder("REPLACE INTO user (Email, Name, Country, State, City, Tno, A1, A2, DOB, GS1920, GS2021, GS2122, GS2223, GS2324) VALUES ");
                // // Console.WriteLine(sCommand);
                // using (MySqlConnection mConnection = new MySqlConnection(conString))
                // {
                //     mConnection.Open();


                //     List<string> Rows = new List<string>();
                //     // Console.WriteLine(userToUpload?.Count);
                //     for (int i = 0; i < userToUpload?.Count; i++)
                //     {
                //         Rows.Add(string.Format("('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}', {9}, {10}, {11}, {12}, {13})",
                //         MySqlHelper.EscapeString(userToUpload[i].Email),
                //         MySqlHelper.EscapeString(userToUpload[i].Name),
                //         MySqlHelper.EscapeString(userToUpload[i].Country),
                //         MySqlHelper.EscapeString(userToUpload[i].State),
                //         MySqlHelper.EscapeString(userToUpload[i].City),
                //         MySqlHelper.EscapeString(userToUpload[i].Tno),
                //         MySqlHelper.EscapeString(userToUpload[i].A1),
                //         MySqlHelper.EscapeString(userToUpload[i].A2),
                //         userToUpload[i].DOB.ToString("yyyy-MM-dd"),
                //         userToUpload[i].GS1920,
                //         userToUpload[i].GS2021,
                //         userToUpload[i].GS2122,
                //         userToUpload[i].GS2223,
                //         userToUpload[i].GS2324));
                //     }
                //     sCommand.Append(string.Join(",", Rows));
                //     sCommand.Append(";");
                //     // Console.WriteLine(sCommand);
                //     using (MySqlCommand myCmd = new MySqlCommand(sCommand.ToString(), mConnection))
                //     {
                //         MySqlTransaction myTrans;
                //         myTrans = mConnection.BeginTransaction();
                //         myCmd.Connection = mConnection;
                //         myCmd.Transaction = myTrans;
                //         myCmd.CommandType = System.Data.CommandType.Text;
                //         await myCmd.ExecuteNonQueryAsync();
                //         // myCmd.ExecuteNonQuery();
                //         myTrans.Commit();
                //     }
                // }
                // till here
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

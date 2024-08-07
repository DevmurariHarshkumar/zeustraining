using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using api.Models;
using System.Diagnostics;
using System.Text.Json;
using mmongo;
using log4net;

namespace preprocess{
    public class Processing{
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod()?.DeclaringType);
        public void AddToQueue2(List<User> userToUpload){
            
            var factory = new ConnectionFactory { HostName = "localhost" };
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.QueueDeclare(queue: "queue2",
                    durable: false,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
            
            var serialized = JsonSerializer.Serialize(userToUpload);
            byte[] byteofbatch = Encoding.ASCII.GetBytes(serialized);

            channel.BasicPublish(exchange: string.Empty,
                                routingKey: "queue2",
                                basicProperties: null,
                                body: byteofbatch);
            Console.WriteLine($" [x] Sent todb {byteofbatch}");
        }


        public string FastestUpload()
        {
            var factory = new ConnectionFactory { HostName = "localhost" };
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.QueueDeclare(queue: "queue1",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);
            
            Console.WriteLine(" [*] Waiting for messages.");
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                Console.WriteLine("received in callback func");
                var fileBytes = ea.Body.ToArray();
                using MemoryStream memoryStream = new(fileBytes);
                using StreamReader reader = new(memoryStream, Encoding.UTF8);

                var time = new Stopwatch();
                time.Start();
                List<User> userToUpload = [];
                List<User> userToUpload1 = [];

                int num = 0;
                int batch_size = 1000;
                try
                {
                    while (!reader.EndOfStream)
                    {
                        var line = await reader.ReadLineAsync();
                        if (string.IsNullOrEmpty(line))
                            continue; // if any empty lines
                        var fields = line.Split(",");
                        if (DateTime.TryParseExact(fields[8], "yyyy-M-d", null, System.Globalization.DateTimeStyles.None, out DateTime dateOfBirth))
                        {
                            User user = new()
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
                            num++;
                            if (num > batch_size){
                                // add to queue
                                AddToQueue2(userToUpload);
                                log.Info("batch uploaded to queue");
                                userToUpload.Clear();
                                num = 0;
                            }
                        }
                        else
                        {
                            // agar invalid date format
                            continue;
                        }
                    }
                    if(num!=0){
                        log.Info("batch uploaded to queue");
                        Mongo connector = new();
                        connector.EstablishMongoConn();
                        AddToQueue2(userToUpload);
                        userToUpload.Clear();
                        num = 0;
                    }
                    userToUpload1 = userToUpload.Distinct().ToList();
                }
                catch (Exception ex)
                {
                    log.Error($"Internal server error: {ex.Message}");
                }
                Console.WriteLine("end of callback block");
            };

            channel.BasicConsume(queue: "queue1",
                                autoAck: true,
                                consumer: consumer);

            Console.WriteLine(" Press [enter] to exit.");
            Console.ReadLine();

            return "CSV file uploaded to backend and processed successfully.";
        }
    }
}
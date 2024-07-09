using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MySqlConnector;
using System.Text.Json;
using api.Models;

using MongoDB.Driver;
using MongoDB.Bson;


namespace mmongo{
    public class Mongo
    {
        public void EstablishMongoConn()
        {
            // MONGODB CONNECTION
                // mongodb+srv://harsh:Harsh@2003@mycluster.abcd1.mongodb.net/myFirstDatabase?appName=mongosh+2.2.10
                // var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
                Console.WriteLine("mongo db connection initiating...");
                var connectionString = "mongodb+srv://harsh:Harsh@2003@mycluster.abcd1.mongodb.net/myFirstDatabase?appName=mongosh+2.2.10";
                if (connectionString == null)
                {
                    Console.WriteLine("You must set your 'MONGODB_URI' environment variable. To learn how to set it, see https://www.mongodb.com/docs/drivers/csharp/current/quick-start/#set-your-connection-string");
                    Environment.Exit(0);
                }
                var client = new MongoClient(connectionString);
                var collection = client.GetDatabase("sample_mflix").GetCollection<BsonDocument>("movies");
                Console.WriteLine("mongo db connection done.");
        }
    }
}
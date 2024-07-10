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
        public async void EstablishMongoConn()
        {
            // MONGODB CONNECTION
                // mongodb+srv://harsh:Harsh@2003@mycluster.abcd1.mongodb.net/myFirstDatabase?appName=mongosh+2.2.10
                //ENV VAR CONNECTION METHOD: var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
                Console.WriteLine("mongo db connection initiating...");
                // var connectionString = "mongodb+srv://harsh:Harsh@2003@mycluster.abcd1.mongodb.net/myFirstDatabase?appName=mongosh+2.2.10";
                var connectionString = "mongodb://localhost:27017/logs";

                if (connectionString == null){
                    Console.WriteLine("You must set your 'MONGODB_URI' environment variable. To learn how to set it, see https://www.mongodb.com/docs/drivers/csharp/current/quick-start/#set-your-connection-string");
                    Environment.Exit(0);
                }
                var client = new MongoClient(connectionString);
                var collection = client.GetDatabase("logging").GetCollection<BsonDocument>("statuslogging");
                Console.WriteLine("collection : "+collection);
                Console.WriteLine("mongo db connection done.");

                Logging newlogging = new(){
                    CurrentStatus = "DB UPLOAD DONE"
                };

                BsonDocument bsonDoc = new BsonDocument
                {
                    { "Name", BsonString.Create(newlogging.CurrentStatus) }
                };
                // await collection.InsertOneAsync(bsonDoc);
                collection.InsertOne(bsonDoc);
                
                Console.WriteLine("mongo db insertion done.");

        }
    }
}
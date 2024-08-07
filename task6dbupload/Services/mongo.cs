using api.Models;

using MongoDB.Driver;
using MongoDB.Bson;
using log4net;
[assembly: log4net.Config.XmlConfigurator(Watch=true)]


namespace mmongo{
    public class Mongo
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod()?.DeclaringType);

        public async void EstablishMongoConn()
        {
            // MONGODB CONNECTION
                // mongodb+srv://harsh:Harsh@2003@mycluster.abcd1.mongodb.net/myFirstDatabase?appName=mongosh+2.2.10
                //ENV VAR CONNECTION METHOD: var connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
                log.Info("mongo db connection initiating...");
                // var connectionString = "mongodb+srv://harsh:Harsh@2003@mycluster.abcd1.mongodb.net/myFirstDatabase?appName=mongosh+2.2.10";
                var connectionString = "mongodb://localhost:27017/logs";

                if (connectionString == null){
                    Console.WriteLine("You must set your 'MONGODB_URI' environment variable. To learn how to set it, see https://www.mongodb.com/docs/drivers/csharp/current/quick-start/#set-your-connection-string");
                    Environment.Exit(0);
                }
                var client = new MongoClient(connectionString);
                var collection = client.GetDatabase("logging").GetCollection<BsonDocument>("statuslogging");
                // Console.WriteLine("collection : "+collection);
                log.Info("mongo db connection done.");

                Logging newlogging = new(){
                    CurrentStatus = "DB UPLOAD DONE"
                };

                BsonDocument bsonDoc = new()
                {
                    { "Name", BsonString.Create(newlogging.CurrentStatus) }
                };
                // await collection.InsertOneAsync(bsonDoc);
                await collection.InsertOneAsync(bsonDoc);
                
                log.Info("mongo db insertion done.");
        }
    }
}
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Microsoft.EntityFrameworkCore;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using MySqlConnector;
using System.Runtime.CompilerServices;
using System.Diagnostics;
using System.Data;
using mmongo;

namespace preprocess{
    public class Program(){
        public static void Main()
        {
            Console.WriteLine("receiver online");
            Processing obj = new Processing();
            var x = obj.FastestUpload();
            if (x != null){
                Mongo connector = new Mongo();
                connector.EstablishMongoConn();
            }
            
            Console.WriteLine("end of program.cs");
            
    }
}
}
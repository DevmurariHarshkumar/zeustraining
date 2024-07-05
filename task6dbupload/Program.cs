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

namespace dbupload{
    public class Program(){
        public static void Main(string[] args){
            Console.WriteLine("receiver on the fooking line");

            FastestUpload dbUpload = new FastestUpload();
            var x = dbUpload.UploadToDb();

            Console.WriteLine("program.cs end");
        }
    }
}
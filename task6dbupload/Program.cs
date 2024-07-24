﻿using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using MySqlConnector;
using System.Runtime.CompilerServices;
using System.Diagnostics;
using System.Data;
using mmongo;

namespace dbupload{
    public class Program(){
        public static void Main(string[] args){
            Console.WriteLine("dbupload receiver online...");

            FastestUpload dbUpload = new();
            var x = dbUpload.UploadToDb();
            if (x != null){
                Mongo connector = new();
                connector.EstablishMongoConn();
            }
        }
    }
}
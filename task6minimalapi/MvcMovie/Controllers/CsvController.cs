using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;

namespace MvcMovie.Controllers;

public class CsvController : Controller
{
    // 
    // GET: /HelloWorld/
    public string Csv()
    {
        return "This is my def csv action...";
    }
    // 
    // GET: /HelloWorld/Welcome/ 
    public string Welcome()
    {
        return "This is the ewl csv action method...";
    }
}
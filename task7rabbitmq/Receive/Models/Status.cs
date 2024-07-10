// using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Logging
{
    [Key]
    public int FId { get; set; }
    [Required]
    public string CurrentStatus { get; set; } = string.Empty;


    // [Required]
    // public string Name { get; set; } = string.Empty;
    // [Required]
    // public string Country { get; set; } = string.Empty;
    // [Required]
    // public string State { get; set; } = string.Empty;
    // [Required]
    // public string City { get; set; } = string.Empty;
    // [Required]
    // public string Tno { get; set; } = string.Empty;
    // [Required]
    // public string A1 { get; set; } = string.Empty;
    // [Required]
    // public string A2  { get; set; } = string.Empty;
    // public DateTime DOB { get; set; }
    // public decimal GS1920 { get; set; }
    // public decimal GS2021 { get; set; }
    // public decimal GS2122 { get; set; }
    // public decimal GS2223 { get; set; }
    // public decimal GS2324 { get; set; }
}



// fluent validation
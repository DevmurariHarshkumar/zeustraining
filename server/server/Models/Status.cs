// using Microsoft.Build.Framework;
using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Logging
{
    [Key]
    public int FId { get; set; }
    [Required]
    public string CurrentStatus { get; set; } = string.Empty;
}



// fluent validation
using api.data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var constr = builder.Configuration.GetConnectionString("Default");
var serviceVersion = new MySqlServerVersion(ServerVersion.AutoDetect(constr));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDBContext>(options => {
options.UseMySql(constr, serviceVersion);
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()
);
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

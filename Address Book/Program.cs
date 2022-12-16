using EmpService.Data;
using Microsoft.EntityFrameworkCore;
using EmpService.Contracts;
using EmpService;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


builder.Services.AddAuthentication("Bearer")
    .AddIdentityServerAuthentication("Bearer", opt =>
    {
        opt.Authority = "https://localhost:5001";
        opt.ApiName = "EmployeeAPI";

    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
{
    builder.AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
}));
var connectionString = builder.Configuration["Data:ConnectionStrings:DefaultConnectionString"];
builder.Services.AddDbContext<EmployeeDbContext>(opt => opt.UseSqlServer(connectionString));
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
    
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors("CorsPolicy");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

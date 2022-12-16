using Auth;
using Auth.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var seed = args.Contains("/seed");
if (seed)
{
    args = args.Except(new[] { "/seed" }).ToArray();
}

var builder = WebApplication.CreateBuilder(args);

var assembly = typeof(Program).Assembly.GetName().Name;
var connectionString = builder.Configuration.GetConnectionString("DefaultConnectionString");

if (seed)
{
    SeedData.EnsureSeedData(connectionString);
}

builder.Services.AddDbContext<AspNetIdentityDbContext>(opt =>
{
    opt.UseSqlServer(connectionString, opt => opt.MigrationsAssembly(assembly));
});

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<AspNetIdentityDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddIdentityServer()
    .AddAspNetIdentity<IdentityUser>()
    .AddConfigurationStore(opt =>
    {
        opt.ConfigureDbContext = b => b.UseSqlServer(connectionString, opt => opt.MigrationsAssembly(assembly));
    })
    .AddOperationalStore(opt =>
    {
        opt.ConfigureDbContext = b => b.UseSqlServer(connectionString, opt => opt.MigrationsAssembly(assembly));
    })
    .AddDeveloperSigningCredential();

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseStaticFiles();

app.UseIdentityServer();

app.UseAuthorization();

app.Run();

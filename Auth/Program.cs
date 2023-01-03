using Auth;
using Auth.Data;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

var assembly = typeof(Program).Assembly.GetName().Name;
var connectionString = builder.Configuration.GetConnectionString("DefaultConnectionString");

builder.Services.AddDbContext<AspNetIdentityDbContext>(opt =>
{
    opt.UseSqlServer(connectionString, opt => opt.MigrationsAssembly(assembly));
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AspNetIdentityDbContext>()
    .AddDefaultTokenProviders();
    

builder.Services.AddIdentityServer()
    .AddAspNetIdentity<ApplicationUser>()
    .AddConfigurationStore(opt =>
    {
        opt.ConfigureDbContext = b => b.UseSqlServer(connectionString, opt => opt.MigrationsAssembly(assembly));
    })
    .AddOperationalStore(opt =>
    {
        opt.ConfigureDbContext = b => b.UseSqlServer(connectionString, opt => opt.MigrationsAssembly(assembly));
    })
    .AddDeveloperSigningCredential();

builder.Services.AddAuthentication()
    .AddFacebook(facebookOptions =>
    {
        facebookOptions.AppId = "1592394194569892";
        facebookOptions.AppSecret = "631ffbc030175ae3e5d22192cc4e3aed";
    })
    .AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = "616596981757-8b7r422281556cpdo6qj00hoakkvr44s.apps.googleusercontent.com";
        googleOptions.ClientSecret = "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";
    });


builder.Services.AddAuthorization();

builder.Services.AddControllersWithViews();

var app = builder.Build();

app.UseCookiePolicy(new CookiePolicyOptions
{
    HttpOnly = HttpOnlyPolicy.None,
    MinimumSameSitePolicy = SameSiteMode.None,
    Secure = CookieSecurePolicy.Always
});
if (app.Environment.IsDevelopment()){
    app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
}

app.UseStaticFiles();

app.UseIdentityServer();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
	endpoints.MapControllerRoute(
		name: "default",
		pattern: "{controller=Home}/{action=Index}/{id?}");
});

//app.MigrateDatabase();

app.Run();

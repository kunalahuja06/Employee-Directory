using Auth.Data;
using Auth.Models;
using IdentityModel;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Auth.Services
{
    public class UserService : IUserService
    {
        private readonly AspNetIdentityDbContext aspNetDbContext;
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> signInManager;

        public UserService(AspNetIdentityDbContext aspNetDbContext, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            this.aspNetDbContext = aspNetDbContext;
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        public IdentityResult RegisterUser(UserRegister user)
        {
            var newUser = userManager.FindByEmailAsync(user.Email).Result;
            if (newUser == null)
            {
                newUser = new IdentityUser
                {
                    UserName = user.Username,
                    Email = user.Email,
                    EmailConfirmed = true
                };
                var res = userManager.CreateAsync(newUser, user.Password).Result;
                if (!res.Succeeded)
                {
                    throw new Exception(res.Errors.First().Description);
                }
                res = userManager.AddClaimsAsync(
                    newUser,
                    new Claim[]
                    {
                        new Claim(JwtClaimTypes.Name,newUser.UserName),
                        new Claim(JwtClaimTypes.Email,newUser.Email),
                    }
                    ).Result;
                if (!res.Succeeded)
                {
                    throw new Exception(res.Errors.First().Description);
                }
                return IdentityResult.Success;
            }
            return IdentityResult.Failed();
        }
    }
}

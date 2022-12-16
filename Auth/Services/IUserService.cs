using Auth.Models;
using Microsoft.AspNetCore.Identity;

namespace Auth.Services
{
    public interface IUserService
    {
        IdentityResult RegisterUser(UserRegister user);
    }
}

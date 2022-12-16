
using Auth.Models;
using Auth.Services;
using Microsoft.AspNetCore.Mvc;

namespace Auth.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserService userService;
        public UserController(IUserService _userService)
        {
            userService = _userService;
        }
        
        [HttpPost("users/register")]
        public IActionResult Register([FromBody] UserRegister user)
        {
            if (user == null)
            {
                return BadRequest();
            }
            var res = userService.RegisterUser(user);
            if (res.Succeeded)
            {
                return Ok(
                    new
                    {
                        StatusCode = 200,
                        message = "User created successfully"
                    }
                    );
            }
            return BadRequest(res.Errors.First().Description);
        }

        [HttpGet("users/welcome")]
        public IActionResult Welcome()
        {
            return Ok("Welcome to the Identity Server");
        }
    }
}

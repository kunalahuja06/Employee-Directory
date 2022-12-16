using System.ComponentModel.DataAnnotations;

namespace Auth.Models
{
    public class UserRegister
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}

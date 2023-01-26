using Microsoft.AspNetCore.Authentication;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace EmployeeDirectory.Auth.Models
{
    public class LoginViewModel
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        public bool RememberLogin { get; set; }
        public string ReturnUrl { get; set; }

        public IEnumerable<AuthenticationScheme>?ExternalProviders { get; set; }
    }
}

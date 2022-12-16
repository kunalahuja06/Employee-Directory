using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmpService.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string PreferredName { get; set; }
        [Required]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string SkypeID { get; set; }
        [Required]
        public string JobTitle { get; set; }
        [Required]
        public string Department { get; set; }
        [Required]
        public string Office { get; set; }
        [Required]
        public string Picture { get; set; }
    }
}

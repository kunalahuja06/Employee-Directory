﻿using System.ComponentModel.DataAnnotations;

namespace EmployeeDirectory.Auth.Models
{
	public class ExternalRegisterViewModel
	{
        public string Email { get; set; }
        public string Username { get; set; }
		public string ReturnUrl { get; set; }

	}
}

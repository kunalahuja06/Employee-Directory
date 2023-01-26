using EmployeeDirectory.Services.Contracts;
using EmployeeDirectory.Services.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace EmployeeDirectory.API.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly IEmployeeService _employeeService;
        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }
        [HttpPost]
        [Route("employees/add")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddEmployee([FromBody] Employee employee)
        {
            if (employee == null)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Employee cannot be null",
                });
            }
            else
            {
                var add = _employeeService.AddEmployee(employee);
                if (add.Result==true && add.IsCompletedSuccessfully)
                {
                    return Ok(new
                    {
                        statusCode = 200,
                        message = "Employee Added Successfully"
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        statusCode = 500,
                        message = "Employee cannot be added"
                    });
                }

            }
        }

        [HttpPut]
        [Route("employee/update")]
        [Authorize]
        public IActionResult UpdateEmployee([FromBody] Employee employee)
        {
            if (employee == null)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Employee cannot be null",
                });
            }
            else
            {
                var update = _employeeService.UpdateEmployee(employee);
                if (update.Result==true && update.IsCompletedSuccessfully)
                {
                    return Ok(new
                    {
                        StatusCode = 200,
                        Message = "Employee updated successfully"
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        StatusCode = 500,
                        Message = "Unable to update employee"
                    });
                }
            }
        }
        [HttpDelete]
        [Route("employee/delete/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteEmployee(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Employee Id cannot be null"
                });
            }
            else
            {
                var delete = _employeeService.DeleteEmployee(id);
                if (delete.Result == false)
                {
                    return BadRequest(new
                    {
                        StatusCode = 500,
                        Message = "unable to delete employee"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        StatusCode = 200,
                        Message = "Employee deleted successfully"
                    });
                }
            }
        }
        [HttpGet("employees")]
        [Authorize]
        public IActionResult GetEmployees()
        {
            var employees = _employeeService.GetEmployees();
            return Ok(new
            {
                StatusCode = 200,
                Employees = employees
            });
        }

        [HttpGet("employee/{id}")]
        [Authorize]

        public IActionResult GetEmployee(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new
                {
                    StatusCode=400,
                    Message = "Employee Id cannot be null"
                });
            }
            else
            {
                var employee = _employeeService.GetEmployeeById(id);
                return Ok(new
                {
                    StatusCode = 200,
                    Employee = employee
                });
            }
        }
    }
}

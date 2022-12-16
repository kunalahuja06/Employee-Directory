using EmpService.Contracts;
using EmpService.Data;
using EmpService.Models;
using Microsoft.EntityFrameworkCore;

namespace EmpService
{
    public class EmployeeService : IEmployeeService
    {
        private readonly EmployeeDbContext _employeeContext;
        public EmployeeService(EmployeeDbContext employeeContext)
        {
            _employeeContext = employeeContext;
        }
        public async void AddEmployee(Employee employee)
        {
            await _employeeContext.Employees.AddAsync(employee);
            await _employeeContext.SaveChangesAsync();
        }

        public async Task<List<Employee>> GetEmployees()
        {
            try
            {
                var employees = await _employeeContext.Employees.ToListAsync();
                return employees;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Employee> GetEmployeeById(int id)
        {
            try
            {
                var employee = await _employeeContext.Employees.FindAsync(id);
                return employee;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async void UpdateEmployee(Employee employee)
        {
            try
            {
                var employeeToBeUpdated = _employeeContext.Employees.FirstOrDefault(x => x.Id == employee.Id);
                if (employeeToBeUpdated != null)
                {
                    _employeeContext.Entry(employeeToBeUpdated).CurrentValues.SetValues(employee);
                    _employeeContext.SaveChanges();
                }
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task DeleteEmployee(int id)
        {
            try
            {
                var employeeToBeDeleted = _employeeContext.Employees.Find(id);
                if (employeeToBeDeleted != null)
                {
                    _employeeContext.Employees.Remove(employeeToBeDeleted);
                }
                _employeeContext.SaveChanges();
            }
            catch(Exception ex)
            {
                throw;
            }
        }
    }
}

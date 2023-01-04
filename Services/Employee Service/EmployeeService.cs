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
        public async Task<bool> AddEmployee(Employee employee)
        {
            if (employee == null) { return false; }
            else
            {
                _employeeContext.Employees.Add(employee);
                await _employeeContext.SaveChangesAsync();
                return true;
            }
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
                if (employee == null) return null;
                return employee;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> UpdateEmployee(Employee employee)
        {
            try
            {
                if (employee == null) return false;
                else
                {
                    var employeeToBeUpdated = await _employeeContext.Employees.FirstOrDefaultAsync(x => x.Id == employee.Id);
                    if (employeeToBeUpdated == null) return false;
                    _employeeContext.Entry(employeeToBeUpdated).CurrentValues.SetValues(employee);
                    _employeeContext.Update(employeeToBeUpdated);
                    await _employeeContext.SaveChangesAsync();
                    return true;
                }
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> DeleteEmployee(int id)
        {
            try
            {
                var employeeToBeDeleted = await _employeeContext.Employees.FindAsync(id);
                if (employeeToBeDeleted == null) return false;
                _employeeContext.Remove(employeeToBeDeleted);
                await _employeeContext.SaveChangesAsync();
                return true;
            }
            catch(Exception ex)
            {
                throw;
            }
        }
    }
}

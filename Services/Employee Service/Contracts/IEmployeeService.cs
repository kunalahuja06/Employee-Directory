using EmployeeDirectory.Services.Models;


namespace EmployeeDirectory.Services.Contracts
{
    public interface IEmployeeService
    {
        Task<bool> AddEmployee(Employee employee);
        Task<bool> UpdateEmployee(Employee employee);
        Task<List<Employee>> GetEmployees();
        Task<bool> DeleteEmployee(int id);
        Task<Employee> GetEmployeeById(int id);
    }
}

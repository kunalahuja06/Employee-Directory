import {Injectable} from '@angular/core';
import { map, Subject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  constructor(private client:HttpClient) {this.getEmployees();this.emp();}
  private url='https://localhost:6001/'


  empHome=new Subject();
  sendEmp(employee:any){
    this.empHome.next(employee);
  }

  employees:any={};
   getEmployees(){
    return this.client.get<any>(`${this.url}employees`)
      .pipe(
        retry(2),
        catchError(this.handleError),
        map((data: any) => {
          return data;
        })
      );
  }
  emp(){
    this.getEmployees().subscribe((data:any)=>{
      this.employees=data.employees.result;
      this.empHome.next(data.employees.result);
    })
  }
  handleError(error:any):any {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Unable to connect to server`;
    }
    window.alert(errorMessage);
  }

  addEmployee(e:any):any {
    let employee={PreferredName:e.preferredName,FirstName:e.firstName,LastName:e.lastName,Email:e.email,PhoneNumber:e.phoneNumber,SkypeID:e.skypeId,JobTitle:e.jobTitle,Office:e.office,Department:e.department,Picture:e.picture}
    return this.client.post<any>(`${this.url}add_employee`,employee)
    .pipe(
      catchError(this.EmployeeError),
      map((data:any)=>{return data}))
  }

  setEmployee(employee:any){
    return this.client.put<any>(`${this.url}update_employee`,employee)
    .pipe(
      catchError(this.EmployeeError),
      map((data:any)=>{return data}))
  }

  deleteEmployee(id:any){
   return this.client.delete<any>(`${this.url}delete_employee/${id}`)
    .pipe(
      catchError(this.EmployeeError),
      map((data:any)=>{return data}))
  }

  EmployeeError(error:any):any {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Unable to connect to server`;
    }
    window.alert(errorMessage);
  }

  filteredEmployees=new Subject()
  sendFilteredEmployees(employees:any){
    this.filteredEmployees.next(employees);
  }

  showAllEmployees=new Subject();
  sendAllEmployees(employees:any){
    this.showAllEmployees.next(employees);
  }

  searchedEmployees=new Subject();
  sendSearchedEmployees(employees:any){
    this.searchedEmployees.next(employees);
  }
  searchAlphebetically(alphabet:any){
    let searchedEmployees=this.employees.filter((employee:any)=>employee.preferredName.toLowerCase().startsWith(alphabet))
    this.sendSearchedEmployees(searchedEmployees)
  }

  editData=new Subject();
  sendEditData(employee:any){
    this.editData.next(employee);
  }  
  
  employeeFormTitle=''

  searchFilter=new Subject();
  sendSearchFilter(filter:any){
    this.searchFilter.next(filter);
  }
  Filter(filter:any){
    let filteredEmployees:any=[]
    this.employees.forEach((employee:any)=>{
      if(employee.department==filter || employee.office==filter || employee.jobTitle==filter){
        filteredEmployees.push(employee)
      }
    })
    this.sendFilteredEmployees(filteredEmployees)
  }

  getCount(filter:any):number{
    let res=0;
    this.employees.forEach((employee:any)=>{
      if(employee.department==filter || employee.office.toLowerCase()==filter || employee.jobTitle.toLowerCase()==filter){
        res++;
      }
    })
    return res;
  }

  updateFilterCount():void{
    let filters=document.querySelectorAll('.filter-li')
    filters.forEach((filter:any)=>{
    filter.children[1].textContent=`(${this.getCount(filter.children[0].textContent)})`
    })
  }
}
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import {EmployeeService} from '../../services/shared/employee-service.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  mobileView: boolean=false;
  constructor(private employeeService:EmployeeService, private observer:BreakpointObserver) {
  }
  ngOnInit(): void {
    this.employeeService.empHome.subscribe((data:any)=>{
      this.employees=data
    })
  
    this.employeeService.filteredEmployees.subscribe((employees:any)=>{
      this.employees=employees
    })

    this.employeeService.showAllEmployees.subscribe((employees:any)=>{
      this.employees=employees
    })

    this.employeeService.searchedEmployees.subscribe((employees:any)=>{
      this.employees=employees
    })

    this.observer.observe([
      Breakpoints.Small,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if(result.matches){
        this.mobileView = true;
      }
      else{
        this.mobileView = false;
      }
    });
  }
  employees:any =[];
}

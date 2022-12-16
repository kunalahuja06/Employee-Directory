import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import * as Filters from 'src/assets/static files/data';
import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { NgbOffcanvas,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from 'src/app/services/shared/employee-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Task 5';
  mobileView = false;
  collapsed = true;
  isAuthenticated:boolean=false;
  
  
  constructor(private modalService: NgbModal,private employeeService:EmployeeService,private observer: BreakpointObserver, private offcanvasService: NgbOffcanvas) { }

  ngOnInit(){
    this.employees=this.employeeService.employees;
    this.createAlphabetArray();
    this.employeeService.searchFilter.subscribe((filter:any)=>{this.searchFilterInput=filter})
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
  filters=Filters.filters;
  searchInput:string;
  searchFilterInput:string="preferredName";
  alphabets:string[]=[]

  createAlphabetArray():void{
    for(let i=97;i<=122;i++){
      this.alphabets.push(String.fromCodePoint(i))
    }
  }

  showEmployees():void{
    this.employeeService.sendAllEmployees(this.employees)
  }

  searchByAlphabets(alphabet:any):void{
    this.employeeService.searchAlphebetically(alphabet)
  }

  search():void{
    const re = new RegExp(this.searchInput, 'gi');
    let searchedEmployees = this.employees.filter((emp: any) => emp[this.searchFilterInput].match(re));
    this.employeeService.sendSearchedEmployees(searchedEmployees) 
  }
  // 
    open(content:any) {
		  this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then();
    }
    openEnd(mobileContent: TemplateRef<any>) {
    this.employeeService.employeeFormTitle="Add Employee"
		this.offcanvasService.open(mobileContent, { position: 'end' });
	  }

    openVerticallyCentered(content: any){
    this.employeeService.employeeFormTitle="Add Employee"
    this.modalService.open(content, { centered: true });  
    }
  //

  employees:any;
   
}

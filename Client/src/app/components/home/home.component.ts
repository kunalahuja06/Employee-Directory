import { Component, OnInit,TemplateRef,ViewChild } from '@angular/core';
import * as Filters from 'src/assets/static files/data';
import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { NgbOffcanvas,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '../../shared/services/employee-service.service';
import { AuthService } from '../../shared/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mobileView = false;
  collapsed = true;
  userName:any;
  isUserAuthenticated: any;
  isUserAdmin: any;
  
  
  constructor(private modalService: NgbModal,private employeeService:EmployeeService,private observer: BreakpointObserver, private offcanvasService: NgbOffcanvas,private authService:AuthService,private router:Router) { }

  ngOnInit(){
    this.isUserAdmin = this.isAdmin();
    this.isUserAuthenticated = this.isAuthenticated();
    this.authService.getUser().then((user:any)=>{this.userName=user.profile.preferred_username});
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
  public isAdmin = () => {
    return this.authService.checkIfUserIsAdmin()
      .then(res => {
        this.isUserAdmin = res;
      })
  }
  public isAuthenticated = () => {
    return this.authService.isAuthenticated()
      .then(res => {
        this.isUserAuthenticated = res;
      })
  }
  public logout(){
    this.authService.logout();
  }
}

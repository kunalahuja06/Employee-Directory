import { Component, Input ,OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from 'src/app/shared/services/employee-service.service';
import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/shared/services/toast.service';
import { AuthService } from 'src/app/shared/services/auth-service.service';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit{
  isUserAuthenticated: any;
  isUserAdmin: any;
  userCanEdit:any=false;
  constructor(private modalService: NgbModal,private employeeService:EmployeeService,private observer:BreakpointObserver,private offcanvasService: NgbOffcanvas,private toastService:ToastService,private authService:AuthService) { }

  mobileView = false;

  ngOnInit(){
    this.isUserAdmin = this.isAdmin();
    this.isUserAuthenticated = this.isAuthenticated();
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

  @Input() employee:any;

  openVerticallyCentered(content: any) {
  this.employeeService.employeeFormTitle="edit employee"
  this.userCanEdit=this.CanEdit();
  this.modalService.open(content, { centered: true });
  }

  openBottom(mobileContent: TemplateRef<any>) {
    this.employeeService.employeeFormTitle="edit employee"
		this.offcanvasService.open(mobileContent, { position: 'bottom' });
	}
  openEnd(mobileContent: TemplateRef<any>) {
		this.offcanvasService.open(mobileContent, { position: 'end' });
	  }

  triggerEdit():void{
    this.employeeService.sendEditData(this.employee)           
  }
  deleteEmployee():void{
    this.employeeService.deleteEmployee(this.employee.id).subscribe((data:any)=>data.statusCode=200?this.utils(data.message):'');
  }
  utils(message:any){
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 2000 });
    this.modalService.dismissAll();
    this.employeeService.emp();
    setTimeout(() => {
      this.employeeService.updateFilterCount();
    },1000);
  }
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
  public CanEdit = () => {
    this.authService.getEmail()
      .then(res => {
        if(res==this.employee.email){
          this.userCanEdit=true;
        }
      })
  }
}

import { Component, Input ,OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from 'src/app/services/shared/employee-service.service';
import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit{
  constructor(private modalService: NgbModal,private employeeService:EmployeeService,private observer:BreakpointObserver,private offcanvasService: NgbOffcanvas) { }

  mobileView = false;

  ngOnInit(){
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
    alert(message);
    this.modalService.dismissAll();
    this.employeeService.emp();
    setTimeout(() => {
      this.employeeService.updateFilterCount();
    },1000);
  }
}

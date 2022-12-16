import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService } from '../../services/shared/employee-service.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  mobileView: boolean=false;
  constructor(private employeeService: EmployeeService,private observer:BreakpointObserver,private offcanvas:NgbOffcanvas) { }

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

  ngAfterViewInit(): void {
    this.toggleJobTitles(document.querySelectorAll('.filter-ul')[2])
    let filters=document.querySelectorAll('.filter-li')
    filters.forEach((filter:any)=>{
      filter.children[1].textContent=`(${this.employeeService.getCount(filter.children[0].textContent)})`
    })
  }

  @Input() filter:any
  @Input() title:any

  getFilteredEmployees(e:any):void{
    this.offcanvas.dismiss()
    let filter=e.target.innerText
    this.employeeService.Filter(filter)
  }
  
  viewMoreBtn='view more'
  viewMoreCheck=false;

  viewMoreToggler():void{
    this.toggleJobTitles(document.querySelectorAll('.filter-ul')[2])
    this.viewMoreCheck=!this.viewMoreCheck
    if(this.viewMoreCheck){
      this.viewMoreBtn='view less'
    }else{
      this.viewMoreBtn='view more'
    }
  }

  toggleJobTitles(jobTitlesUl:any):void{
    jobTitlesUl.classList.add('mb-0')
    for(let i=5;i<jobTitlesUl.children.length;i++){
      jobTitlesUl.children[i].classList.toggle('d-none')
    }
  }
}


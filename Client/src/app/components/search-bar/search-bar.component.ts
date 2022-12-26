import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/services/auth-service.service';
import { EmployeeService } from '../../shared/services/employee-service.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  mobileView: boolean = false;
  isUserAdmin: any;
  isUserAuthenticated: any;

  constructor(private modalService: NgbModal, private employeeService: EmployeeService, private observer: BreakpointObserver, private authService: AuthService) { }
  ngOnInit(): void {
    this.isUserAdmin = this.isAdmin();
    this.isUserAuthenticated = this.isAuthenticated();
    this.createAlphabetArray();
    this.observer.observe([
      Breakpoints.Small,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.mobileView = true;
      }
      else {
        this.mobileView = false;
      }
    });
  }

  openVerticallyCentered(content: any) {
    this.employeeService.employeeFormTitle = "Add Employee"
    this.modalService.open(content, { centered: true });
  }

  alphabets: string[] = []
  public createAlphabetArray(): void {
    for (let i = 97; i <= 122; i++) {
      this.alphabets.push(String.fromCodePoint(i))
    }
  }

  showEmployees(): void {
    this.employeeService.sendAllEmployees(this.employeeService.employees)
  }

  searchByAlphabets(alphabet: any): void {
    this.employeeService.searchAlphebetically(alphabet)
  }

  searchInput: string;
  clear() {
    this.searchInput = "";
    this.searchFilterInput = "preferredName";
    this.showEmployees();
  }

  searchFilterInput: string = "preferredName";
  filterChange() {
    this.employeeService.sendSearchFilter(this.searchFilterInput)
    this.search()
  }

  search(): void {
    const re = new RegExp(this.searchInput, 'gi');
    let searchedEmployees = this.employeeService.employees.filter((emp: any) => emp[this.searchFilterInput].match(re));
    this.employeeService.sendSearchedEmployees(searchedEmployees)
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
}


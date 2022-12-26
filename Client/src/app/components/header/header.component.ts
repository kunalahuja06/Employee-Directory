import { Component, OnInit } from '@angular/core';
import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/shared/services/auth-service.service';
import { User } from 'oidc-client';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  mobileView = false;
  user:any;
  isCollapsed=true;
  constructor(private observer: BreakpointObserver,private authService:AuthService) { }

   ngOnInit(){
    this.authService.getUser().then((user:any)=>{this.user=user;this.name=user.profile.preferred_username});
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

  name:string=''
  logout(){
    this.authService.logout();
  }
}

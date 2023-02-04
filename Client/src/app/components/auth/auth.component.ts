import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../shared/services/auth-service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private authService:AuthService,private router: Router) {
    this.authService.isAuthenticated()
    .then(userAuthenticated => {
      if(userAuthenticated){
        this.router.navigate(['']);
      }
    })
   }

  ngOnInit() {}

  login(){
    this.authService.login();
  }
  registerUrl:string=environment.register;
  register(){
    window.location.href = this.registerUrl;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../shared/services/auth-service.service';
import { ParamMap,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private authService:AuthService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((data:any) => {
      this.register=data.register;
    })
  }
  register:any;
  RegisterForm:any=new FormGroup({
    email:new FormControl('',[Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
    password:new FormControl('',[Validators.required, Validators.minLength(8)]),
    confirmPassword:new FormControl('',[Validators.required, Validators.minLength(8)]),
  })
  
  LoginForm:any=new FormGroup({
    email:new FormControl('',[Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
    password:new FormControl('',[Validators.required, Validators.minLength(8)]),
  })
  loginUser(){
    console.log(this.LoginForm.value);
    this.authService.login();
  }
  registerUser(){
    // this.authService.login();
  }
  logout(){
    this.authService.logout();
  }

  get email(){
    return this.RegisterForm.get('email') || this.LoginForm.get('Email');
  }
  get password(){
    return this.RegisterForm.get('password') || this.LoginForm.get('Password');
  }
  get confirmPassword(){
    return this.RegisterForm.get('confirmPassword');
  }
}

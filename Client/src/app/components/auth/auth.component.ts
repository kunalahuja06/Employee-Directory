import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/shared/auth-service.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
  }
  register:any=false;
  RegisterForm:any=new FormGroup({
    email:new FormControl('',[Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
    password:new FormControl('',[Validators.required, Validators.minLength(8)]),
    confirmPassword:new FormControl('',[Validators.required, Validators.minLength(8)]),
  })
  loginUser(){
    console.log(this.RegisterForm.value);
    this.auth.login();
  }

  LoginForm:any=new FormGroup({
    email:new FormControl('',[Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
    password:new FormControl('',[Validators.required, Validators.minLength(8)]),
  })
  registerUser(){
    // var user=this.createUser(this.RegisterForm.value);
    // this.userService.registerUser(user).subscribe((res:any)=>{
    //   console.log(res);
    // })
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

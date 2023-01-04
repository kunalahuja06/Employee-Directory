import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth-service.service';

@Component({
  selector: 'app-register-callback',
  templateUrl: './register-callback.component.html',
  styleUrls: ['./register-callback.component.css']
})
export class RegisterCallbackComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }
  login(){
    this.authService.login();
  }
}

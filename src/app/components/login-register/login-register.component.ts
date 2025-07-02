import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  imports: [],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {

  constructor(private router:Router){}

  volverALogin(){
    this.router.navigate(["/login"])
  }

}

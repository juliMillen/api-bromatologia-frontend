import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = {
    username: '',
    password: ''
  };

  //Mensaje de error
  errorMessage: string = ''
  loading: boolean = false;

  constructor(private router:Router){}


  onLogin() {
     if(!this.loginForm.username || !this.loginForm.password){
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.loading=true;
    this.errorMessage='';
  }

  irAInicio(){
    this.router.navigate(["/inicio"])
  }
}

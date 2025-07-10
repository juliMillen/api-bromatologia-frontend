import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router:Router, private authService:AuthService){}


  onLogin() {
     if(!this.loginForm.username || !this.loginForm.password){
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.loading=true;
    this.errorMessage='';

    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        this.authService.guardarToken(response.token);
        this.router.navigate(["/inicio"])
      },
      error: (err) =>{
        this.loading = false;
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error("Error de login: ",err);
      }
    });
  }

  irAInicio(){
    this.router.navigate(["/inicio"])
  }
}

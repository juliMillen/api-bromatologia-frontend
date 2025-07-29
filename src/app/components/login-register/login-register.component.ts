import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-register',
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent implements OnInit {

  usuario: Usuario = {
    username: '',
    password: ''
  }

  usuarios: Usuario[] = []

  mensajeExito: string | null = null;

  loginRegisterForm!: FormGroup;

  private fb = inject(FormBuilder);

  constructor(private router:Router, private usuarioService:UsuarioService){}


  ngOnInit(): void {
      this.formularioRegister();
  }


  formularioRegister(){
    this.loginRegisterForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',[Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z]).{8,}$/)]]
    })
  }

  volverALogin(){
    this.router.navigate(["/login"])
  }

  crearUsuario(){

    if(this.loginRegisterForm.invalid){
      this.loginRegisterForm.markAllAsTouched();
      return;
    }

    const nuevoUsuario: Usuario = this.loginRegisterForm.value;
    this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
      next: (usuario:Usuario) => {
        this.usuarios.push(usuario);
        this.mensajeExito = 'Usuario creado con correctamente';
        setTimeout(() => this.mensajeExito = null,3000);
        console.log('Usuario creado correctamente');

        this.loginRegisterForm.reset();
      },
      error: (err) =>{
        console.log('Error al crear usuario: ',err);
      }
    });
  }

}

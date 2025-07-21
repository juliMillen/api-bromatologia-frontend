import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {

  usuario: Usuario = {
    username: '',
    password: ''
  }

  usuarios: Usuario[] = []

  mensajeExito: string | null = null;

  constructor(private router:Router, private usuarioService:UsuarioService){}

  volverALogin(){
    this.router.navigate(["/login"])
  }

  crearUsuario(){
    this.usuarioService.crearUsuario(this.usuario).subscribe({
      next: (usuario:Usuario) => {
        this.usuarios.push(usuario);
        this.mensajeExito = 'Usuario creado con correctamente';
        setTimeout(() => this.mensajeExito = null,3000);
        console.log('Usuario creado correctamente');

        this.usuario = {
          username: '',
          password: ''
        }
      },
      error: (err) =>{
        console.log('Error al crear usuario');
      }
    });
  }

}

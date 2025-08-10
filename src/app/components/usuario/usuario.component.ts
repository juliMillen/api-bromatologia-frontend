import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioModalComponent } from '../modales/usuario-modal/usuario-modal.component';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, UsuarioModalComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  usuario: Usuario = {
    username: '',
    password: ''
  }

  usuarios: Usuario[] = [];

  usuarioEditando: Usuario | null = null;

  modalAbierto = false;

  idBuscado: number = 0;

  modo: 'crear' | 'editar' = 'crear'

  constructor(private usuarioService: UsuarioService, private authService: AuthService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  abrirModal() {
    this.usuarioEditando = null;
    this.modo = 'crear';
    this.modalAbierto = true;
  }

  ocultarModal() {
    this.modalAbierto = false;
  }

  abrirModalParaEditar(usuario: Usuario): void {
    this.usuarioEditando = usuario;
    this.modo = 'editar'
    this.modalAbierto = true;
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data: Usuario[]) => {
        console.log('Usuarios cargados: ', data);
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios: ', err);
      }
    })
  }

  isAdmin(): boolean {
    return this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN'
  }


  obtenerUsuarioPorId(): void {
    if (!this.idBuscado) return;

    this.usuarioService.obtenerUsuarioPorId(this.idBuscado).subscribe({
      next: (usuario: Usuario) => {
        this.usuarios = [usuario];
      },
      error: (err) => {
        console.error('Error al obtener el usuario: ', err);
      }
    })
  }


  guardarUsuario(nuevoUsuario: Usuario): void {
    if (this.usuarioEditando) {
      this.modificarUsuario(nuevoUsuario);
      this.usuarioEditando = null;
    } else {
      if (nuevoUsuario.rol === 'admin') {
        this.usuarioService.crearUsuarioAdmin(nuevoUsuario).subscribe({
          next: (nuevo) => {
            this.usuarios.push(nuevo);
          },
          error: (err) => {
            console.error('Error al crear admin: ', err);
          }
        });
      } else {
        this.usuarioService.crearUsuarioEmpleado(nuevoUsuario).subscribe({
          next: (nuevo) => {
            this.usuarios.push(nuevo);
          },
          error: (err) => {
            console.error('Error al crear usuario: ', err);
          }
        })
      }
    }
    this.ocultarModal();
  }


  modificarUsuario(usuario: Usuario): void {
    this.usuarioService.actualizarUsuario(usuario.idUsuario!, usuario).subscribe({
      next: (response) => {
        console.log('Usuario modificado correctamente: ', response);
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al modificar usuario: ', err);
      }
    });
  }


  eliminarUsuario(idUsuario: number): void {
    this.usuarioService.eliminarUsuario(idUsuario).subscribe({
      next: () => {
        console.log('Usuario eliminado correctamente');
        this.usuarios = this.usuarios.filter(e => e.idUsuario = idUsuario);
      },
      error: (err) => {
        console.error('Error al eliminar usuario: ', err);
      }
    })
  }

}

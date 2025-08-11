import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-usuario-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './usuario-modal.component.html',
  styleUrl: './usuario-modal.component.css'
})
export class UsuarioModalComponent implements OnInit {

  @Input() usuarioParaEditar: Usuario | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Output() cerrar = new EventEmitter<void>();
  @Output() usuarioCreado = new EventEmitter<Usuario>();

  usuario: Usuario = {
    username: '',
    password: ''
  }

  usuarios: Usuario[] = [];

  modoEdicion: boolean = false;

  usuarioForm!:FormGroup;

  tipoUsuario: 'admin' | 'empleado' = 'empleado';

  private fb = inject(FormBuilder);
  

  constructor(private usuarioService:UsuarioService) {}

  ngOnInit(): void {
      this.formularioUsuario();
      if(this.usuarioParaEditar){
        this.usuario = structuredClone(this.usuarioParaEditar);
        this.usuarioForm.patchValue(this.usuario);
      }
  }


  formularioUsuario(){
    const crear = this.modo === 'crear';

    const editar = this.modo === 'editar';

    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: ['',[Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z]).{8,}$/)]],
      tipoUsuario: ['empleado', Validators.required]
    })
  }


  guardarUsuario():void {
    this.usuarioCreado.emit(this.usuario);
  }


  cerrarModal():void {
    this.cerrar.emit();
  }


  crearUsuario(): void{
    if(this.usuarioForm.invalid){
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const {tipoUsuario, ...nuevoUsuario} = this.usuarioForm.value;
    
    if(tipoUsuario === 'admin'){
      this.usuarioService.crearUsuarioAdmin(nuevoUsuario).subscribe({
        next: (response) => {
          console.log('Admin creado correctamente');
          this.usuarios.push(response);
          this.usuarioForm.reset();
          this.cerrar.emit();
        },
        error: (err) => {
          console.log('Error al crear usuario admin: ',err);
        }
      });
    } else{
      this.usuarioService.crearUsuarioEmpleado(nuevoUsuario).subscribe({
        next: (response) => {
          console.log('Empleado creado correctamente');
          this.usuarios.push(response);
          this.usuarioForm.reset();
          this.cerrar.emit();
        },
        error: (err) => {
          console.error('Error al crear empleado: ',err);
        }
      })
    }
  }
}

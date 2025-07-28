import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../../models/producto';
import { RegistroProducto } from '../../../models/registroProducto';
import { RegistroProductoEstablecimiento } from '../../../models/registroProductoEstablecimiento';
import { RegistroProductoService } from '../../../services/registro-producto.service';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-registro-producto-modal',
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './registro-producto-modal.component.html',
  styleUrl: './registro-producto-modal.component.css'
})
export class RegistroProductoModalComponent implements OnInit {


  @Output() cerrar = new EventEmitter<void>()
  @Output() registroProdCreado = new EventEmitter<RegistroProducto>
  @Output() registroProdEstablecimiento = new EventEmitter<RegistroProductoEstablecimiento>

  productos: Producto[] = [];

  registroProducto: RegistroProducto = {
    tipo: '',
    idProducto:0
  }

  tipos: string[] = [
    "Inscripcion",
    "Reinscripcion"
  ]


  registroForm!: FormGroup;

  private fb = inject(FormBuilder);

  constructor(private registroProductoService:RegistroProductoService, private productoService:ProductoService) {}


  ngOnInit(): void {
    this.cargarProductos();
    this.formularioRegistro();
  }


  formularioRegistro(){
    this.registroForm = this.fb.group({
      tipo: ['',Validators.required],
      idProducto: [null,Validators.required]
    })
  }

  cerrarModal(){
    this.cerrar.emit();
  }

  cargarProductos(){
    this.productoService.obtenerProductos().subscribe(data => this.productos = data);
  }

  guardarRegistro(){

    if(this.registroForm.invalid){
      this.registroForm.markAllAsTouched();
      return;
    }

    const nuevoRegistro: RegistroProducto = this.registroForm.value;


    this.registroProductoService.guardarRegistroProducto(nuevoRegistro).subscribe({

      next:(registroProdCreado:RegistroProducto) => {
        console.log('Registro Producto creado correctamente');

        this.registroProdCreado.emit(registroProdCreado);

        //cierro el modal
        this.cerrar.emit();
      },
      error: (err) =>{
        console.log('No se ha podido crear el registro',err);
      }
    })
  }
}

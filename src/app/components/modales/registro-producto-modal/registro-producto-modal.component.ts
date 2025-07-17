import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../../models/producto';
import { RegistroProducto } from '../../../models/registroProducto';
import { RegistroProductoEstablecimiento } from '../../../models/registroProductoEstablecimiento';
import { RegistroProductoService } from '../../../services/registro-producto.service';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-registro-producto-modal',
  imports: [FormsModule,CommonModule],
  templateUrl: './registro-producto-modal.component.html',
  styleUrl: './registro-producto-modal.component.css'
})
export class RegistroProductoModalComponent implements OnInit {


  @Output() cerrar = new EventEmitter<void>()
  @Output() registroProdCreado = new EventEmitter<RegistroProducto>
  @Output() registroProdEstablecimiento = new EventEmitter<RegistroProductoEstablecimiento>

  productos: Producto[] = [];

  productoSeleccionado!:number;

  registroProducto: RegistroProducto = {
    tipo: '',
    idProducto:0
  }

  tipos: String[] = [
    "Inscripcion",
    "Reinscripcion"
  ]

  constructor(private registroProductoService:RegistroProductoService, private productoService:ProductoService) {}


  ngOnInit(): void {
  }

  cerrarModal(){
    this.cerrar.emit();
  }

  cargarProductos(){
    this.productoService.obtenerProductos().subscribe(data => this.productos = data);
  }

  guardarRegistro(){
    this.registroProducto.idProducto = this.productoSeleccionado;

    if(!this.productoSeleccionado || !this.registroProducto.tipo){
      console.error('Campos incompletos');
      return;
    }

    this.registroProductoService.guardarRegistroProducto(this.registroProducto).subscribe({
      next:(registroProdCreado:RegistroProducto) => {
        console.log('Registro Producto creado correctamente');
      },
      error: (err) =>{
        console.log('No se ha podido crear el registro');
      }
    })
  }
}

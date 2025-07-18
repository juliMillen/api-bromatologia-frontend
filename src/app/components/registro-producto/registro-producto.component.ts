import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroProducto } from '../../models/registroProducto';
import { RegistroProductoModalComponent } from "../modales/registro-producto-modal/registro-producto-modal.component";
import { RegistroProductoEstablecimientoModalComponent } from "../modales/registro-producto-establecimiento-modal/registro-producto-establecimiento-modal.component";

@Component({
  selector: 'app-registro-producto',
  imports: [CommonModule, FormsModule, RegistroProductoModalComponent, RegistroProductoEstablecimientoModalComponent],
  templateUrl: './registro-producto.component.html',
  styleUrl: './registro-producto.component.css'
})
export class RegistroProductoComponent {

  mostrarModalRegistroProducto = false;
  mostrarModalRegistroProductoEstablecimiento = false;

  registroProductoCreado!: RegistroProducto;

  abrirRegistroProductoModal(){
    this.mostrarModalRegistroProducto = true;
  }

  onRegistroProductoCreado(registro:RegistroProducto){
    this.registroProductoCreado = registro;
    this.mostrarModalRegistroProducto = false;
    this.mostrarModalRegistroProductoEstablecimiento = true;
  }
}

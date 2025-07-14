import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstablecimientoModalComponent } from "../modales/establecimiento-modal/establecimiento-modal.component";
import { ProductoModalComponent } from "../modales/producto-modal/producto-modal.component";
import { Establecimiento } from '../../models/establecimiento';

@Component({
  selector: 'app-establecimiento',
  imports: [CommonModule, FormsModule, EstablecimientoModalComponent, ProductoModalComponent],
  templateUrl: './establecimiento.component.html',
  styleUrl: './establecimiento.component.css'
})
export class EstablecimientoComponent {

  mostrarModalEstablecimiento = false;
  mostrarModalProducto = false;
  idEstablecimientoCreado: number | undefined;

  abrirEstablecimientoModal():void{
    this.mostrarModalEstablecimiento = true;
  }

  cerrarEstablecimientoModal():void{
    this.mostrarModalEstablecimiento=false;
  }

  abrirProductoModal(establecimiento:Establecimiento):void {
    this.idEstablecimientoCreado = establecimiento.idEstablecimiento;
    this.mostrarModalEstablecimiento=false;
    this.mostrarModalProducto = true;
  }

  cerrarProductoModal():void {
    this.mostrarModalProducto=false;
    this.idEstablecimientoCreado=undefined;
  }
}

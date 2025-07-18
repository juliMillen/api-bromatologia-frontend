import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroProducto } from '../../models/registroProducto';
import { RegistroProductoModalComponent } from "../modales/registro-producto-modal/registro-producto-modal.component";
import { RegistroProductoEstablecimientoModalComponent } from "../modales/registro-producto-establecimiento-modal/registro-producto-establecimiento-modal.component";
import { RegistroEstablecimiento } from '../../models/registroEstablecimiento';
import { RegistroProductoEstablecimiento } from '../../models/registroProductoEstablecimiento';
import { RegistroProductoEstablecimientoService } from '../../services/registro-producto-establecimiento.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-registro-producto',
  imports: [CommonModule, FormsModule, RegistroProductoModalComponent, RegistroProductoEstablecimientoModalComponent,RouterLink],
  templateUrl: './registro-producto.component.html',
  styleUrl: './registro-producto.component.css'
})
export class RegistroProductoComponent implements OnInit {
  
  mostrarModalRegistroProducto = false;
  mostrarModalRegistroProductoEstablecimiento = false;

  registroProductoCreado!: RegistroProducto;
  registroEstablecimientoSeleccionado!: RegistroEstablecimiento;

  registrosProd: RegistroProductoEstablecimiento[] = [];


  constructor( private registroProductoEstablecimientoService: RegistroProductoEstablecimientoService) {}

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(){
    this.registroProductoEstablecimientoService.obtenerRegistros().subscribe(data => this.registrosProd = data);
  }

  abrirRegistroProductoModal(){
    this.mostrarModalRegistroProducto = true;
  }

  onRegistroProductoCreado(registro:RegistroProducto){
    this.registroProductoCreado = registro;
    this.mostrarModalRegistroProducto = false;
    this.mostrarModalRegistroProductoEstablecimiento = true;
  }
}

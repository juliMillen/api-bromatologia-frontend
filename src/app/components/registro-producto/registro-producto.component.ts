import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroProducto } from '../../models/registroProducto';
import { RegistroProductoModalComponent } from "../modales/registro-producto-modal/registro-producto-modal.component";
import { RouterLink } from '@angular/router';
import { MantenimientoAsociadoModalComponent } from "../modales/mantenimiento-asociado-modal/mantenimiento-asociado-modal.component";
import { RegistroProductoService } from '../../services/registro-producto.service';


@Component({
  selector: 'app-registro-producto',
  imports: [CommonModule, FormsModule, RegistroProductoModalComponent, RouterLink, MantenimientoAsociadoModalComponent],
  templateUrl: './registro-producto.component.html',
  styleUrl: './registro-producto.component.css'
})
export class RegistroProductoComponent implements OnInit {
  
  mostrarModalRegistroProducto = false;
  mostrarModalRegistroProductoEstablecimiento = false;
  mostrarModalAsociacion = false;
  tipoModalAsociacion: 'registroProducto' | 'registroEstablecimiento' = 'registroProducto'

  registroProductoCreado!: RegistroProducto;
  registrosProductos: RegistroProducto[] = [];


  idRegistroProducto: string = '';
  idRegistroEstablecimiento: string = '';

  constructor( private registroProductoService:RegistroProductoService) {}

  ngOnInit(): void {
    //this.cargarRegistros();
    this.obtenerRegistrosConMantenimiento();
  }

  cargarRegistros(){
    this.registroProductoService.obtenerRegistros().subscribe(data => this.registrosProductos = data);
  }

  abrirRegistroProductoModal(){
    this.mostrarModalRegistroProducto = true;
  }

  abrirModalAsociacion(tipo: 'registroProducto' | 'registroEstablecimiento'){
    this.tipoModalAsociacion = tipo
    this.mostrarModalAsociacion = true;
  }

  cerrarModalAsociacion(){
    this.mostrarModalAsociacion = false;
  }

  onRegistroProductoCreado(registro:RegistroProducto){
    this.registroProductoCreado = registro;
    this.mostrarModalRegistroProducto = false;
    this.mostrarModalRegistroProductoEstablecimiento = true;
  }

  obtenerRegistroProductoEstablecimientoPorId(){
    this.registroProductoService.obtenerRegistroPorId(this.idRegistroProducto).subscribe({
      next: (registroProdEst:RegistroProducto) => {
        this.registrosProductos = [registroProdEst];
      },
      error: (err) => {
        console.error('No se ha encontrado ningun registro: ',err);
      }
    })
  }

  obtenerRegistrosConMantenimiento(){
    this.registroProductoService.obtenerRegistroConMantenimientos().subscribe(data => {
      this.registrosProductos = data;
      console.log('Registros con mantenimientos: ',this.registrosProductos);
    })
  }
}

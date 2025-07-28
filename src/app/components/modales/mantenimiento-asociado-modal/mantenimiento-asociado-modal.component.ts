import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Mantenimiento } from '../../../models/mantenimiento';
import { RegistroEstablecimiento } from '../../../models/registroEstablecimiento';
import { RegistroProducto } from '../../../models/registroProducto';
import { RegistroProductoService } from '../../../services/registro-producto.service';
import { RegistroEstablecimientoService } from '../../../services/registro-establecimiento.service';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import {  FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mantenimiento-asociado-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './mantenimiento-asociado-modal.component.html',
  styleUrl: './mantenimiento-asociado-modal.component.css'
})
export class MantenimientoAsociadoModalComponent implements OnInit {

  @Input() tipo: 'registroProducto' | 'registroEstablecimiento' = 'registroProducto';
  @Output() cerrar = new EventEmitter<void>()



  mantenimientos: Mantenimiento[] = [];
  registrosEstablecimientos: RegistroEstablecimiento[] = [];
  registrosProductos: RegistroProducto[] = [];

  mantenimientoSeleccionado!: number;
  registroProductoSeleccionado!: number;
  registroEstablecimientoSeleccionado!: number;


  constructor(private mantenimientoService: MantenimientoService, private registroProductoService: RegistroProductoService, private registroEstablecimientoService: RegistroEstablecimientoService) { }

  ngOnInit(): void {
    this.cargarRegistrosProductos();
    this.cargarRegistrosEstablecimientos();
    this.cargarMantenimientos();
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  cargarRegistrosProductos() {
    this.registroProductoService.obtenerRegistros().subscribe({
      next: (data) => {
        this.registrosProductos = data;
      },
      error: (err) => {
        console.error('Error al cargar los registros de productos: ', err);
      }
    })
  }

  cargarRegistrosEstablecimientos() {
    this.registroEstablecimientoService.obtenerRegistrosEstablecimientos().subscribe({
      next: (data) => {
        this.registrosEstablecimientos = data;
      },
      error: (err) => {
        console.log('Error al cargar los registros de establecimientos: ', err);
      }
    })
  }

  cargarMantenimientos() {
    this.mantenimientoService.obtenerMantenimientos().subscribe({
      next: (data) => {
        this.mantenimientos = data;
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos: ', err);
      }
    })
  }

  asociarMantenimientoARegistro() {
    if (!this.mantenimientoSeleccionado) {
      console.error('Debe seleccionar un mantenimiento');
      return;
    }

    if (this.tipo === 'registroProducto') {
      if (!this.registroProductoSeleccionado) {
        console.error('Debe seleccionar un registro de producto');
        return;
      }

      this.registroProductoService.agregarMantenimiento(this.registroProductoSeleccionado, this.mantenimientoSeleccionado)
        .subscribe({
          next: () => this.cerrarModal(),
          error: err => console.error('Error al asociar mantenimiento a producto', err)
        });

    } else if (this.tipo === 'registroEstablecimiento') {
      if (!this.registroEstablecimientoSeleccionado) {
        console.error('Debe seleccionar un registro de establecimiento');
        return;
      }

      this.registroEstablecimientoService.asignarMantenimiento(this.registroEstablecimientoSeleccionado, this.mantenimientoSeleccionado)
        .subscribe({
          next: () => this.cerrarModal(),
          error: err => console.error('Error al asociar mantenimiento a establecimiento', err)
        });
    }
  }

}

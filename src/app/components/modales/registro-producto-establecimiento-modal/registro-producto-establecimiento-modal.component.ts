import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegistroProducto } from '../../../models/registroProducto';
import { RegistroEstablecimiento } from '../../../models/registroEstablecimiento';
import { RegistroProductoEstablecimientoService } from '../../../services/registro-producto-establecimiento.service';

@Component({
  selector: 'app-registro-producto-establecimiento-modal',
  imports: [],
  templateUrl: './registro-producto-establecimiento-modal.component.html',
  styleUrl: './registro-producto-establecimiento-modal.component.css'
})
export class RegistroProductoEstablecimientoModalComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Input() registroProducto!: RegistroProducto;
  @Input() registroEstablecimiento!: RegistroEstablecimiento;

  registroEstablecimientoSeleccionado: number = 0;


  constructor(private registroProductoEstablecimientoService: RegistroProductoEstablecimientoService) {}

  cerrarModal(){
    this.cerrar.emit();
  }


  guardarRegistroProductoEstablecimiento(){
  }
}

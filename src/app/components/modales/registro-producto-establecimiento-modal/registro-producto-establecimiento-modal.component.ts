import { Component, EventEmitter, Input, OnInit,OnChanges,SimpleChanges, Output, SimpleChange } from '@angular/core';
import { RegistroProducto } from '../../../models/registroProducto';
import { RegistroEstablecimiento } from '../../../models/registroEstablecimiento';
import { RegistroProductoEstablecimientoService } from '../../../services/registro-producto-establecimiento.service';
import { RegistroProductoEstablecimiento } from '../../../models/registroProductoEstablecimiento';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroProductoService } from '../../../services/registro-producto.service';
import { RegistroEstablecimientoService } from '../../../services/registro-establecimiento.service';

@Component({
  selector: 'app-registro-producto-establecimiento-modal',
  imports: [FormsModule, CommonModule ],
  templateUrl: './registro-producto-establecimiento-modal.component.html',
  styleUrl: './registro-producto-establecimiento-modal.component.css'
})
export class RegistroProductoEstablecimientoModalComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() registroCreado = new EventEmitter<RegistroProductoEstablecimiento>();
  
  @Input() registroProducto!: RegistroProducto;
  @Input() registroEstablecimiento!: RegistroEstablecimiento;

  registrosProductos: RegistroProducto[] = [];
  registrosEstablecimientos: RegistroEstablecimiento[] = [];

  registroProductoSeleccionado: number = 0;
  registroEstablecimientoSeleccionado: number = 0;

  registroProductoEstablecimiento: RegistroProductoEstablecimiento = {
    rnpaActual: '',
    rnpaAnterior: '',
    fechaEmision: new Date(),
    tipo: '',
    nroRne: '',
    certificado: '',
    expediente: 0,

    idRegistroProducto: 0,
    idRegistroEstablecimiento:0
  }


  constructor(private registroProductoEstablecimientoService: RegistroProductoEstablecimientoService, private registroProductoService:RegistroProductoService, private registroEstablecimientoService: RegistroEstablecimientoService) {}


  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['registroProducto'] && this.registroProducto){
      this.registroProductoSeleccionado = this.registroProducto.idRegistroProducto || 0;
    }
    if(changes['registroEstablecimiento'] && this.registroEstablecimiento){
      this.registroEstablecimientoSeleccionado = this.registroEstablecimiento.idRegistroEstablecimiento || 0;
    }
  }

  cargarDatos(){
    this.registroProductoService.obtenerRegistros().subscribe(data => this.registrosProductos = data);
    this.registroEstablecimientoService.obtenerRegistrosEstablecimientos().subscribe(data => this.registrosEstablecimientos = data);
  }


  cerrarModal(){
    this.cerrar.emit();
  }


  guardarRegistroProductoEstablecimiento(){
    this.registroProductoEstablecimiento.idRegistroProducto = this.registroProductoSeleccionado;
    this.registroProductoEstablecimiento.idRegistroEstablecimiento = this.registroEstablecimientoSeleccionado;

    this.registroProductoEstablecimientoService.guardarRegistroProductoEstablecimiento(this.registroProductoSeleccionado,this.registroEstablecimientoSeleccionado,this.registroProductoEstablecimiento).subscribe({
      next: (data) => {
        this.registroCreado.emit(data);
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al guardar el registro producto: ',err);
      }
    })
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Empresa } from '../../../models/empresa';
import { Titular } from '../../../models/titular';
import { Establecimiento } from '../../../models/establecimiento';
import { EmpresaService } from '../../../services/empresa.service';
import { EstablecimientoService } from '../../../services/establecimiento.service';
import { TitularService } from '../../../services/titular.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroEstablecimiento } from '../../../models/registroEstablecimiento';
import { RegistroEstablecimientoService } from '../../../services/registro-establecimiento.service';

@Component({
  selector: 'app-registro-establecimiento-modal',
  imports: [FormsModule,CommonModule],
  templateUrl: './registro-establecimiento-modal.component.html',
  styleUrl: './registro-establecimiento-modal.component.css'
})
export class RegistroEstablecimientoModalComponent implements OnInit {

  @Output() cerrar = new EventEmitter<void>()
  @Output() registroEstCreado = new EventEmitter<RegistroEstablecimiento>()

  empresas: Empresa[] = [];
  titulares: Titular[] = [];
  establecimientos: Establecimiento[] = [];

  cuitTitularSeleccionado!:number;
  cuitEmpresaSeleccionada!:number;
  idEstablecimientoSeleccionado!:number;

  registroEstablecimiento: RegistroEstablecimiento = {
    cuitTitular: 0,
    cuitEmpresa: 0,
    idEstablecimiento: 0,
    categoriaAnt: '',
    arancel: 0,
    fechaEmision: new Date(),
    fechaVencimiento: new Date(),
    estado: ''
  }

  estados: String[] = [
    "Cancelado",
    "Habilitado",
    "Observado",
    "Suspendido"
  ]


  constructor(private empresaService:EmpresaService, private establecimientoService:EstablecimientoService, private titularService:TitularService, private registroEstablecimientoService:RegistroEstablecimientoService) {}
  
  ngOnInit(): void {
      this.cargarEmpresas();
      this.cargarTitulares();
      this.cargarEstablecimientos();
  }

  cerrarModal(){
    this.cerrar.emit();
  }

  cargarEmpresas(){
    this.empresaService.getEmpresas().subscribe(data => this.empresas = data);
  }

  cargarEstablecimientos(){
    this.establecimientoService.obtenerEstablecimientos().subscribe(data => this.establecimientos = data);
  }

  cargarTitulares(){
    this.titularService.obtenerTitulares().subscribe(data => this.titulares = data);
  }

  guardarRegistro(): void{
    this.registroEstablecimiento.cuitTitular = this.cuitTitularSeleccionado;
    this.registroEstablecimiento.cuitEmpresa = this.cuitEmpresaSeleccionada;
    this.registroEstablecimiento.idEstablecimiento = this.idEstablecimientoSeleccionado;

    if(!this.cuitTitularSeleccionado || !this.cuitEmpresaSeleccionada || !this.idEstablecimientoSeleccionado || !this.registroEstablecimiento.estado){
      console.error('Campos incompletos, se puede guardar');
      return;
    }


    this.registroEstablecimientoService.guardarRegistro(this.registroEstablecimiento).subscribe({
      next:(registroEstCreado:RegistroEstablecimiento) => {
        console.log('Registro establecimiento creado correctamente', registroEstCreado);

        const id = registroEstCreado.idRegistroEstablecimiento!;
        //asignar titular
        this.registroEstablecimientoService.asignarTitular(id,this.cuitTitularSeleccionado);

        //asignar empresa
        this.registroEstablecimientoService.asignarEmpresa(id, this.cuitEmpresaSeleccionada);

        //asignar establecimiento
        this.registroEstablecimientoService.asignarEstablecimiento(id,this.idEstablecimientoSeleccionado);
        this.registroEstCreado.emit(registroEstCreado);
        this.cerrar.emit();
      },
      error: (error) => {
        console.error('Error al guardar registro establecimiento: ',error);
      }
    });
  }
}

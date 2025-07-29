import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroEstablecimientoModalComponent } from '../modales/registro-establecimiento-modal/registro-establecimiento-modal.component';
import { RegistroEstablecimientoService } from '../../services/registro-establecimiento.service';
import { RegistroEstablecimiento } from '../../models/registroEstablecimiento';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { Mantenimiento } from '../../models/mantenimiento';
import { MantenimientoAsociadoModalComponent } from "../modales/mantenimiento-asociado-modal/mantenimiento-asociado-modal.component";

@Component({
  selector: 'app-registro-establecimiento',
  imports: [CommonModule, FormsModule, RegistroEstablecimientoModalComponent, MantenimientoAsociadoModalComponent,RouterLink],
  templateUrl: './registro-establecimiento.component.html',
  styleUrl: './registro-establecimiento.component.css'
})
export class RegistroEstablecimientoComponent implements OnInit {

    registroEstablecimiento: RegistroEstablecimiento = {
    cuitTitular: 0,
    cuitEmpresa: 0,
    idEstablecimiento: 0,
    categoriaAnt: '',
    arancel: 0,
    fechaEmision: new Date(),
    fechaVencimiento: new Date(),
    estado: ''
  };

  registrosEstablecimientos: RegistroEstablecimiento[] = [];

  mantenimientos: Mantenimiento[] = [];

  modalAbierto = false;

  idRegistroEstablecimiento: number = 0;

  mostrarModalAsociacion = false;
  tipoModalAsociacion: 'registroEstablecimiento' | 'registroProducto' = 'registroEstablecimiento';


  constructor(private registroEstablecimientoService:RegistroEstablecimientoService, private route:ActivatedRoute, private mantenimientoService:MantenimientoService) {}

  ngOnInit(): void {
    this.cargarRegistros()
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
      this.registroEstablecimientoService.obtenerRegistroEstablecimientoPorId(id).subscribe({
        next: (regEst) => {
          this.registrosEstablecimientos = [regEst];
        },
        error: (err) =>{
          console.error('error al cargar registro por ID: ',err);
          this.registrosEstablecimientos = [];
        }
      });
    }else{
      //cargo todos los registros
      this.cargarRegistros();

      //cargo mantenimientos
      this.cargarMantenimientos();
    }
  }

  abrirModal(){
    this.modalAbierto = true;
  }

  ocultarModal(){
    this.modalAbierto = false;
  }

  abrirModalAsociacion(tipo: 'registroEstablecimiento' | 'registroProducto'){
    this.tipoModalAsociacion = tipo;
    this.mostrarModalAsociacion = true;
  }

  cerrarModalAsociacion(){
    this.mostrarModalAsociacion = false;
  }

  cargarRegistros():void{
    this.registroEstablecimientoService.obtenerRegistrosEstablecimientos().subscribe({
      next: (data: RegistroEstablecimiento[]) => {
        console.log('Registros cargados: ',data);
        this.registrosEstablecimientos = data;
      },
      error: (err) => {
        console.error('Error al cargar registros de establecimientos',err);
      }
    })
  }

  cargarMantenimientos():void{
    this.mantenimientoService.obtenerMantenimientos().subscribe({
      next: (data: Mantenimiento[]) => {
        console.log('Mantenimientos cargados: ',data);
        this.mantenimientos = data;
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos: ',err);
      }
    })
  }

  obtenerRegistroEstablecimientoPorId():void{
    if(!this.idRegistroEstablecimiento) return;
    this.registroEstablecimientoService.obtenerRegistroEstablecimientoPorId(this.idRegistroEstablecimiento).subscribe({
      next: (registroEst: RegistroEstablecimiento) => {
        this.registrosEstablecimientos = [registroEst];
      },
      error: (err) => {
        console.error('Error al obtener el registro establecimiento: ',err);
        this.registrosEstablecimientos = [];
      }
    })
  }

  registroCreado(registro: RegistroEstablecimiento){
    this.registrosEstablecimientos.push(registro);
    this.registroEstablecimiento = registro;
  }


}

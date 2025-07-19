import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroEstablecimientoModalComponent } from '../modales/registro-establecimiento-modal/registro-establecimiento-modal.component';
import { RegistroEstablecimientoService } from '../../services/registro-establecimiento.service';
import { RegistroEstablecimiento } from '../../models/registroEstablecimiento';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro-establecimiento',
  imports: [CommonModule,FormsModule, RegistroEstablecimientoModalComponent],
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

  modalAbierto = false;

  idRegistroEstablecimiento: number = 0;


  constructor(private registroEstablecimientoService:RegistroEstablecimientoService, private route:ActivatedRoute) {}

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
    }
  }

  abrirModal(){
    this.modalAbierto = true;
  }

  ocultarModal(){
    this.modalAbierto = false;
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
  }


}

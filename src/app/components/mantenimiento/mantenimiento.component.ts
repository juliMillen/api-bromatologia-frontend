import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mantenimiento } from '../../models/mantenimiento';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { TramiteService } from '../../services/tramite.service';
import { MantenimientoModalComponent } from '../modales/mantenimiento-modal/mantenimiento-modal.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mantenimiento',
  imports: [CommonModule, FormsModule, MantenimientoModalComponent],
  templateUrl: './mantenimiento.component.html',
  styleUrl: './mantenimiento.component.css'
})
export class MantenimientoComponent implements OnInit {

  mantenimiento: Mantenimiento = {
    fechaMantenimiento: new Date(),
    enlaceRecibido: '',
    tramites: []
  }


  modalAbierto = false;

  mantenimientos: Mantenimiento[] = [];

  idMantenimiento: number = 0;

  esAdmin: boolean= false;

  constructor(private mantenimientoService:MantenimientoService, private tramiteService:TramiteService, private authService:AuthService){}

  ngOnInit(): void {
    this.esAdmin = this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN';
    this.cargarMantenimientos();
  }

  abrirModal(){
    this.modalAbierto = true;
  }

  ocultarModal(){
    this.modalAbierto = false;
  }

  isAdmin(): boolean {
    return this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN'
  }

  cargarMantenimientos():void {
    this.mantenimientoService.obtenerMantenimientos().subscribe({
      next: (data:Mantenimiento[]) => {
        console.log('Mantenimientos cargados: ',data);
        this.mantenimientos = data;
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos', err)
      }
    })
  }

  obtenerMantenimientoPorId():void{
    if(!this.idMantenimiento) return;
    this.mantenimientoService.obtenerMantenimientoPorId(this.idMantenimiento).subscribe({
      next: (mantenimiento:Mantenimiento) => {
        this.mantenimientos = [mantenimiento];
      },
      error: (err) => {
        console.error('Error al obtener el mantenimiento: ',err);
        this.mantenimientos = [];
      }
    })
  }

  eliminarMantenimiento(idMantenimiento:number): void {
    this.mantenimientoService.eliminarMantenimiento(idMantenimiento).subscribe({
      next: () => {
        console.log("Mantenimiento eliminado correctamente");
        this.mantenimientos = this.mantenimientos.filter (e => e.idMantenimiento !== idMantenimiento);
      },
      error: (err) => {
        console.log("Error al eliminar el mantenimiento: ", err);
      }
    })
  }

  eliminarTramite(idTramite:number):void {
    this.mantenimientoService.eliminarTramite(idTramite).subscribe({
      next:() => {
        console.log("Tramite eliminado correctamente");
      },
      error: (err) => {
        console.log("Error al eliminar el tramite");
      }
    })
  }

  eliminarMantenimientoConTramites(mantenimiento:Mantenimiento):void {
    if(mantenimiento.tramites && mantenimiento.tramites.length > 0){
      mantenimiento.tramites.forEach(tramite => {
        if(tramite.idTramite){
          this.eliminarTramite(tramite.idTramite);
        }
      });
      this.eliminarMantenimiento(mantenimiento.idMantenimiento!);
    }
  }

}

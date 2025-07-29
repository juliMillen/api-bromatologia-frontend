import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mantenimiento } from '../../models/mantenimiento';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { TramiteService } from '../../services/tramite.service';
import { MantenimientoModalComponent } from '../modales/mantenimiento-modal/mantenimiento-modal.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private mantenimientoService:MantenimientoService, private tramiteService:TramiteService, private authService:AuthService, private route:ActivatedRoute){}

  ngOnInit(): void {
    this.esAdmin = this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN';

        const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
      this.mantenimientoService.obtenerMantenimientoPorId(id).subscribe({
        next: (man) => {
          this.mantenimientos = [man];
        },
        error: (err) =>{
          console.error('error al cargar mantenimiento por ID: ',err);
          this.mantenimientos = [];
        }
      });
    }else{

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

  isAdmin(): boolean {
    return this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN'
  }

  cargarMantenimientos():void {
    this.mantenimientoService.obtenerMantenimientos().subscribe({
      next: (data:Mantenimiento[]) => {
        console.log('Mantenimientos cargados: ',data);
        this.mantenimientos = data || [];
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos', err)
        this.mantenimientos = [];
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
    this.tramiteService.eliminarTramite(idTramite).subscribe({
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


  eliminarMantenimientoConTramite(mantenimiento:Mantenimiento):void {
    if(!mantenimiento.tramites || mantenimiento.tramites.length === 0){
      this.eliminarMantenimiento(mantenimiento.idMantenimiento!);
      return;
    }

    const tramitesParaEliminar = mantenimiento.tramites.filter(t => t.idTramite);
    let tramitesEliminados = 0;

    tramitesParaEliminar.forEach(tramite => {
      if(tramite.idTramite){
        this.tramiteService.eliminarTramite(tramite.idTramite).subscribe({
          next: () => {
            console.log("Tramite eliminado correctamente");
            tramitesEliminados++;

            if(tramitesEliminados === tramitesParaEliminar.length){
              this.eliminarMantenimiento(mantenimiento.idMantenimiento!);
            }
          },
          error: (err) =>{
            console.error("Error al eliminar el tramite: ",err);
            tramitesEliminados++;
            if(tramitesEliminados === tramitesParaEliminar.length){
              this.eliminarMantenimiento(mantenimiento.idMantenimiento!);
            }
          }
        })
      }
    });
  }

}

import { Component, EventEmitter, Output } from '@angular/core';
import { Mantenimiento } from '../../../models/mantenimiento';
import { Tramite } from '../../../models/tramite';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { TramiteService } from '../../../services/tramite.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mantenimiento-modal',
  imports: [FormsModule],
  templateUrl: './mantenimiento-modal.component.html',
  styleUrl: './mantenimiento-modal.component.css'
})
export class MantenimientoModalComponent {

  @Output() cerrar = new EventEmitter<void>()
  @Output() mantenimientoCreado = new EventEmitter<Mantenimiento>()
  @Output() tramiteCreado = new EventEmitter<Tramite>()


  mantenimiento: Mantenimiento = {
    fechaMantenimiento: new Date(),
    enlaceRecibido: '',
  }

  tramite: Tramite = {
    nombreTramite: '',
    recibo: {
      fechaRecibo: new Date(),
      importe: 0
    }
  }

  mantenimientos: Mantenimiento[] = [];

  tramites: Tramite[] = [];

  constructor(private mantenimientoService:MantenimientoService, private tramiteService:TramiteService){}

  cerrarModal(){
    this.mantenimientoCreado.emit();
    this.cerrar.emit();
  }


  crearMantenimientoYTramite(): void{
    this.mantenimientoService.registrarMantenimiento(this.mantenimiento).subscribe({
      next: (mantenimientoCreado:Mantenimiento) => {
        console.log('Mantenimiento creado correctamente', mantenimientoCreado);

        this.tramiteService.crearTramite(this.tramite).subscribe({
          next:(tramiteCreado: Tramite) => {
            console.log('Tramite creado', tramiteCreado);

            //Asocio tramite al mantenimiento
            this.mantenimientoService.agregarTramite(mantenimientoCreado.idMantenimiento!,tramiteCreado.idTramite!).subscribe({
              next: () => {
                console.log('Tramite asociado al mantenimiento correctamente');
                this.mantenimientoCreado.emit(mantenimientoCreado);
                this.cerrarModal();
              },
              error:(err) => {
                console.error('Error al asociar el tramite: ',err);
              }
            });
          },
          error: (err) => {
            console.error('Error al crear el tramite: ', err);
          }
        });
      },
      error:(err) => {
        console.error('Error al crear el mantenimiento: ',err);
      }
    });
  }
}

import { Component, EventEmitter, Output, resolveForwardRef } from '@angular/core';
import { Establecimiento } from '../../../models/establecimiento';
import { EstablecimientoService } from '../../../services/establecimiento.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-establecimiento-modal',
  imports: [FormsModule],
  templateUrl: './establecimiento-modal.component.html',
  styleUrl: './establecimiento-modal.component.css'
})
export class EstablecimientoModalComponent {
  
  @Output() cerrar = new EventEmitter<void>()
  @Output() establecimientoCreado = new EventEmitter<Establecimiento>()
  
  establecimiento: Establecimiento = {
    departamento:'',
    localidad: '',
    direccion: '',
    cuitEmpresa: 0
  };

  establecimientos: Establecimiento[] = [];

  idEstablecimientoCreado: number | undefined;

  mostrarModalProducto: boolean = false;

  constructor(private establecimientoService: EstablecimientoService) {}
  
  cerrarModal(){
      this.establecimientoCreado.emit();
      this.cerrar.emit();
    }

    crearEstablecimiento():void {
      this.establecimientoService.crearEstablecimiento(this.establecimiento).subscribe({
        next: (response: Establecimiento) => {
          if(response.idEstablecimiento !== undefined){
            this.idEstablecimientoCreado = response.idEstablecimiento;
            this.establecimientoCreado.emit(response);
          }else{
            throw new Error('El backend no devolvio idEstablecimiento');
          }
          console.log('Establecimiento generado correctamente');
          this.establecimientos.push(response);

          //reinicio formulario

          this.establecimiento = {
            departamento: '',
            localidad: '',
            direccion: '',
            cuitEmpresa: 0
          }
        },
        error:(err) => {
          console.log('Error al crear el establecimiento',err);
        }
      })
    }

}

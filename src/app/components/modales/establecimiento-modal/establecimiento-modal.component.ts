import { Component, EventEmitter, Output, resolveForwardRef } from '@angular/core';
import { Establecimiento } from '../../../models/establecimiento';
import { EstablecimientoService } from '../../../services/establecimiento.service';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';

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
    departamento: '',
    localidad: '',
    direccion: '',
    cuitEmpresa: 0
  };

  establecimientos: Establecimiento[] = [];

  idEstablecimientoCreado: number | undefined;

  mostrarModalProducto: boolean = false;

  constructor(private establecimientoService: EstablecimientoService, private empresaService: EmpresaService) { }

  cerrarModal() {
    this.establecimientoCreado.emit();
    this.cerrar.emit();
  }

  crearEstablecimiento(): void {
    this.establecimientoService.crearEstablecimiento(this.establecimiento).subscribe({
      next: (response: Establecimiento) => {
        if (response.idEstablecimiento !== undefined) {
          this.idEstablecimientoCreado = response.idEstablecimiento;
          if (this.establecimiento.cuitEmpresa && this.establecimiento.cuitEmpresa !== 0) {
            console.log('Intentando asociar establecimiento con empresa CUIT:', this.establecimiento.cuitEmpresa);

            this.empresaService.agregarEstablecimientoAEmpresa(this.establecimiento.cuitEmpresa, this.idEstablecimientoCreado).subscribe({
              next: () => {
                console.log('Establecimiento asociado a la empresa correctamente');
                response.cuitEmpresa = this.establecimiento.cuitEmpresa;
                
                console.log('Establecimiento generado correctamente');
                this.establecimientos.push(response);
                this.establecimientoCreado.emit(response);
                this.mostrarModalProducto = true;
              },
              error: (err) => {
                console.error('Error al asociar establecimiento con la empresa: ', err);
                this.establecimientoCreado.emit(response);
                this.mostrarModalProducto = true;
              }
            });
          } else {
            console.log('No se proporciono CUIT de empresa. Establecimiento creado sin asociacion');
            this.establecimientoCreado.emit(response);
            this.mostrarModalProducto = true;
          }
        } else {
          throw new Error('El backend no devolvio idEstablecimiento');
        }

        //reinicio formulario

        this.establecimiento = {
          departamento: '',
          localidad: '',
          direccion: '',
          cuitEmpresa: 0
        }
      },
      error: (err) => {
        console.log('Error al crear el establecimiento', err);
      }
    })
  }

}

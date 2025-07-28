import { Component, EventEmitter, inject, OnInit, Output, resolveForwardRef } from '@angular/core';
import { Establecimiento } from '../../../models/establecimiento';
import { EstablecimientoService } from '../../../services/establecimiento.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-establecimiento-modal',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './establecimiento-modal.component.html',
  styleUrl: './establecimiento-modal.component.css'
})
export class EstablecimientoModalComponent implements OnInit {

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

  establecimientoForm!:FormGroup;

  private fb = inject(FormBuilder);

  constructor(private establecimientoService: EstablecimientoService, private empresaService: EmpresaService) { }


ngOnInit(): void {
    this.formularioEstablecimiento();
}

  cerrarModal() {
    this.establecimientoCreado.emit();
    this.cerrar.emit();
  }

  formularioEstablecimiento(){
    this.establecimientoForm = this.fb.group({
      departamento: ['', Validators.required],
      localidad: ['',Validators.required],
      direccion: ['',Validators.required],
      cuitEmpresa: [null, [Validators.required,Validators.pattern(/^\d{11}$/)]]
    })
  }

  crearEstablecimiento(): void {

    if(this.establecimientoForm.invalid){
      this.establecimientoForm.markAllAsTouched();
      return;
    }

    const nuevoEstablecimiento: Establecimiento = this.establecimientoForm.value;
    const cuitEmpresa = nuevoEstablecimiento.cuitEmpresa;


    this.establecimientoService.crearEstablecimiento(nuevoEstablecimiento).subscribe({
      next: (response: Establecimiento) => {
        if (response.idEstablecimiento !== undefined) {
          this.idEstablecimientoCreado = response.idEstablecimiento;
          if (cuitEmpresa && cuitEmpresa !== 0) {
            console.log('Intentando asociar establecimiento con empresa CUIT:', cuitEmpresa);

            this.empresaService.agregarEstablecimientoAEmpresa(cuitEmpresa, this.idEstablecimientoCreado).subscribe({
              next: () => {
                console.log('Establecimiento asociado a la empresa correctamente');
                response.cuitEmpresa = cuitEmpresa;
                
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

        this.establecimientoForm.reset();
      },
      error: (err) => {
        console.log('Error al crear el establecimiento', err);
      }
    })
  }

}

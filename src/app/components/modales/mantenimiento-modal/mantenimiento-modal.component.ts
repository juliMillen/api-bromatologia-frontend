import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Mantenimiento } from '../../../models/mantenimiento';
import { Tramite } from '../../../models/tramite';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { TramiteService } from '../../../services/tramite.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mantenimiento-modal',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './mantenimiento-modal.component.html',
  styleUrl: './mantenimiento-modal.component.css'
})
export class MantenimientoModalComponent implements OnInit {

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


  mantenimientoForm!:FormGroup;

  private fb = inject(FormBuilder);

  mantenimientos: Mantenimiento[] = [];

  tramites: Tramite[] = [];

  constructor(private mantenimientoService:MantenimientoService, private tramiteService:TramiteService){}

  cerrarModal(){
    this.mantenimientoCreado.emit();
    this.cerrar.emit();
  }

  ngOnInit(): void {
      this.formularioMantenimiento();
  }

  formularioMantenimiento(){
    this.mantenimientoForm = this.fb.group({
    fechaMantenimiento: ['',Validators.required],
    enlaceRecibido: ['',Validators.required,Validators.pattern(/https?:\/\/.+/)],
    nombreTramite: ['',Validators.required],
    fechaRecibo: ['',Validators.required],
    importe: ['',Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)]
    })
  };


  crearMantenimientoYTramite(): void{
    if(this.mantenimientoForm.invalid){
      this.mantenimientoForm.markAllAsTouched();
      return;
    }
    const formValues = this.mantenimientoForm.value;
    const nuevoMantenimiento: Mantenimiento ={
      fechaMantenimiento: formValues.fechaMantenimiento,
      enlaceRecibido: formValues.enlaceRecibido
    };
    const nuevoTramite: Tramite = {
      nombreTramite: formValues.nombreTramite,
      recibo: {
        fechaRecibo: formValues.fechaRecibo,
        importe: formValues.importe
      }
    };
    this.mantenimientoService.registrarMantenimiento(nuevoMantenimiento).subscribe({
      next: (mantenimientoCreado:Mantenimiento) => {
        console.log('Mantenimiento creado correctamente', mantenimientoCreado);

        this.tramiteService.crearTramite(nuevoTramite).subscribe({
          next:(tramiteCreado: Tramite) => {
            console.log('Tramite creado', tramiteCreado);

            //Asocio tramite al mantenimiento
            this.mantenimientoService.agregarTramite(mantenimientoCreado.idMantenimiento!,tramiteCreado.idTramite!).subscribe({
              next: () => {
                console.log('Tramite asociado al mantenimiento correctamente');
                this.mantenimientoCreado.emit(mantenimientoCreado);
                this.tramiteCreado.emit(tramiteCreado);
                this.cerrar.emit();
                this.mantenimientoForm.reset();
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

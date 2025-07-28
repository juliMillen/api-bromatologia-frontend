import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Empresa } from '../../../models/empresa';
import { Titular } from '../../../models/titular';
import { Establecimiento } from '../../../models/establecimiento';
import { EmpresaService } from '../../../services/empresa.service';
import { EstablecimientoService } from '../../../services/establecimiento.service';
import { TitularService } from '../../../services/titular.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroEstablecimiento } from '../../../models/registroEstablecimiento';
import { RegistroEstablecimientoService } from '../../../services/registro-establecimiento.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-registro-establecimiento-modal',
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './registro-establecimiento-modal.component.html',
  styleUrl: './registro-establecimiento-modal.component.css'
})
export class RegistroEstablecimientoModalComponent implements OnInit {

  @Output() cerrar = new EventEmitter<void>()
  @Output() registroEstCreado = new EventEmitter<RegistroEstablecimiento>()

  empresas: Empresa[] = [];
  titulares: Titular[] = [];
  establecimientos: Establecimiento[] = [];


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

  estados: string[] = [
    "Cancelado",
    "Habilitado",
    "Observado",
    "Suspendido"
  ]


  registroForm!: FormGroup;

  private fb = inject(FormBuilder);


  constructor(private empresaService: EmpresaService, private establecimientoService: EstablecimientoService, private titularService: TitularService, private registroEstablecimientoService: RegistroEstablecimientoService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.cargarTitulares();
    this.cargarEstablecimientos();
    this.formularioRegistroEstablecimiento();
  }

  formularioRegistroEstablecimiento(){
    this.registroForm = this.fb.group({
      cuitTitular: [null, [Validators.required, Validators.pattern(/^\d{11}$/)]],
      cuitEmpresa: [null, [Validators.required, Validators.pattern(/^\d{11}$/)]],
      idEstablecimiento: [null,[Validators.required]],
      categoriaAnt: ['',Validators.required],
      arancel: ['',[Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      fechaEmision: ['',Validators.required],
      fechaVencimiento: ['',Validators.required],
      estado: ['', Validators.required]
    })
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  cargarEmpresas() {
    this.empresaService.getEmpresas().subscribe(data => this.empresas = data);
  }

  cargarEstablecimientos() {
    this.establecimientoService.obtenerEstablecimientos().subscribe(data => this.establecimientos = data);
  }

  cargarTitulares() {
    this.titularService.obtenerTitulares().subscribe(data => this.titulares = data);
  }

  guardarRegistro(): void {

    if(this.registroForm.invalid){
      this.registroForm.markAllAsTouched();
      return;
    }


    const nuevoRegistro: RegistroEstablecimiento = {
      ...this.registroForm.value,
      fechaEmision: new Date(this.registroForm.value.fechaEmision),
      fechaVencimiento: new Date(this.registroForm.value.fechaVencimiento);
    }


    this.registroEstablecimientoService.guardarRegistro(nuevoRegistro).subscribe({
      next: (registroEstCreado: RegistroEstablecimiento) => {
        console.log('Registro establecimiento creado correctamente', registroEstCreado);

        const id = registroEstCreado.idRegistroEstablecimiento!;

        forkJoin([
          //asignar titular
          this.registroEstablecimientoService.asignarTitular(id, nuevoRegistro.cuitTitular),

          //asignar empresa
          this.registroEstablecimientoService.asignarEmpresa(id, nuevoRegistro.cuitEmpresa),

          //asignar establecimiento
          this.registroEstablecimientoService.asignarEstablecimiento(id, nuevoRegistro.idEstablecimiento)
        ]).subscribe({
          next: () => {
            this.registroEstablecimientoService.obtenerRegistroEstablecimientoPorId(id).subscribe({
              next: (registroFinal) => {
                this.registroEstCreado.emit(registroFinal);
                this.cerrar.emit();
              }
            })
          }
        })
      },
      error: (error) => {
        console.error('Error al guardar registro establecimiento: ', error);
      }
    });
  }
}

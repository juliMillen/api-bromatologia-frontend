import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Empresa } from '../../../models/empresa';
import { EmpresaService } from '../../../services/empresa.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroEstablecimiento } from '../../../models/registroEstablecimiento';
import { RegistroEstablecimientoService } from '../../../services/registro-establecimiento.service';
import { forkJoin } from 'rxjs';
import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoria.service';

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
  categorias: Categoria[] = []


  registroEstablecimiento: RegistroEstablecimiento = {
    rpe: '',
    fechaEmision: new Date(),
    fechaVencimiento: new Date(),
    empresa: {
      cuitEmpresa:0,
      razonSocial: ''
    },
    departamento: '',
    localidad: '',
    direccion: '',
    expediente: 0,
    enlace: ''
  }

  estados: string[] = [
    "Cancelado",
    "Habilitado",
    "Observado",
    "Suspendido"
  ]


  registroForm!: FormGroup;

  private fb = inject(FormBuilder);


  constructor(private empresaService: EmpresaService, private categoriaService:CategoriaService, private registroEstablecimientoService: RegistroEstablecimientoService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.formularioRegistroEstablecimiento();
  }

  formularioRegistroEstablecimiento(){
    this.registroForm = this.fb.group({
      rpe: ['',Validators.required],
      fechaEmision: ['',Validators.required],
      fechaVencimiento: ['',Validators.required],
      empresa: ['',Validators.required],
      departamento:['',Validators.required],
      localidad: ['',Validators.required],
      direccion: ['',Validators.required],
      expediente: [null,Validators.required],
      enlace: ['',Validators.required],
      categoria: [null,Validators.required]
    })
  }

  /*formularioRegistroEstablecimiento(){
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
  }*/

  cerrarModal() {
    this.cerrar.emit();
  }

  cargarEmpresas() {
    this.empresaService.getEmpresas().subscribe(data => this.empresas = data);
  }



  guardarRegistro(): void {

    if(this.registroForm.invalid){
      this.registroForm.markAllAsTouched();
      return;
    }


    const nuevoRegistro: RegistroEstablecimiento = {
      ...this.registroForm.value,
      fechaEmision: new Date(this.registroForm.value.fechaEmision),
      fechaVencimiento: new Date(this.registroForm.value.fechaVencimiento),
      empresa: {
        cuitEmpresa:0,
        razonSocial:this.registroForm.value.empresa
      }
    }


    this.registroEstablecimientoService.guardarRegistro(nuevoRegistro).subscribe({
      next: (registroEstCreado: RegistroEstablecimiento) => {
        console.log('Registro establecimiento creado correctamente', registroEstCreado);
          this.registroEstablecimientoService.obtenerRegistroEstablecimientoPorId(registroEstCreado.rpe).subscribe({
              next: (registroFinal) => {
                this.registroEstCreado.emit(registroFinal);
                this.cerrar.emit();
              }
            })
      },
      error: (error) => {
        console.error('Error al guardar registro establecimiento: ', error);
      }
    });
  }
}

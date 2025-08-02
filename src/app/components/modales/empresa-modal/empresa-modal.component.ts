import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Empresa } from '../../../models/empresa';
import { EmpresaService } from '../../../services/empresa.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-empresa-modal',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './empresa-modal.component.html',
  styleUrl: './empresa-modal.component.css'
})
export class EmpresaModalComponent implements OnInit {

  @Input() empresaParaEditar: Empresa | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Output() cerrar = new EventEmitter<void>()
  @Output() empresaCreada = new EventEmitter<Empresa>()

    empresa: Empresa = {
      cuitEmpresa: 0,
      razonSocial: '',
      fechaAlta: new Date(),
      fechaVencimiento: new Date(),
      email: '',
      telefono: '',
      departamento: '',
      localidad: '',
      direccion: '',
      password: ''
    };
  
    empresas: Empresa[] = [];
  
    modoEdicion: boolean = false;

    empresaForm!:FormGroup;

    private fb = inject(FormBuilder);


    constructor(private empresaService: EmpresaService) {}

    ngOnInit(): void {

      this.formularioEmpresa();
        if(this.empresaParaEditar){
          //this.empresa = JSON.parse(JSON.stringify(this.empresaParaEditar))
          this.empresa = structuredClone(this.empresaParaEditar);
          this.empresaForm.patchValue(this.empresa);
        }
    }

    formularioEmpresa(){

      const crear = this.modo === 'crear';
      const editar = this.modo === 'editar';

      this.empresaForm = this.fb.group({
        cuitEmpresa: [null,[Validators.required, Validators.pattern(/^\d{11}$/)]],
        nombreEmpresa: ['', Validators.required],
        email: ['', crear ? [Validators.required,Validators.email] : []],
        telefono: ['', crear ? [Validators.required,Validators.pattern(/^(\+?\d{7,15})$/)] : []],
        titular: this.fb.group({
          cuitTitular: [null, [Validators.required,Validators.pattern(/^\d{11}$/)]],
          nombreTitular: ['', Validators.required],
          email: ['', crear ? [Validators.required, Validators.email] : []],
          telefono: ['', crear ? [Validators.required,Validators.pattern(/^(\+?\d{7,15})$/)] : []]
        })
      });
    }

    guardarEmpresa():void {
      this.empresaCreada.emit(this.empresa);
    }

    cerrarModal(){
      this.cerrar.emit();
    }

     crearEmpresa(): void {
      if(this.empresaForm.invalid){
        this.empresaForm.markAllAsTouched();
        return;
      }

      const nuevaEmpresa: Empresa = this.empresaForm.value;

      this.empresaService.crearEmpresa(nuevaEmpresa).subscribe({
      next: (response: Empresa) => {
        console.log('Empresa creada correctamente: ', response);
        this.empresas.push(response);
        this.empresaForm.reset();
        this.cerrar.emit();
      },
      error:(err) => {
        console.log('Error al crear la empresa: ',err);
      }
  })
  }
}

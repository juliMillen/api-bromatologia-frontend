import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Empresa } from '../../../models/empresa';
import { EmpresaService } from '../../../services/empresa.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroEstablecimiento } from '../../../models/registroEstablecimiento';
import { RegistroEstablecimientoService } from '../../../services/registro-establecimiento.service';
import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-registro-establecimiento-modal',
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './registro-establecimiento-modal.component.html',
  styleUrl: './registro-establecimiento-modal.component.css'
})
export class RegistroEstablecimientoModalComponent implements OnInit {

  @Input() registroEstParaEditar: RegistroEstablecimiento | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';
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

  registrosEst: RegistroEstablecimiento[] = [];

  modoEdicion: boolean = false;

  registroForm!: FormGroup;

  private fb = inject(FormBuilder);


  constructor(private empresaService: EmpresaService, private categoriaService:CategoriaService, private registroEstablecimientoService: RegistroEstablecimientoService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.formularioRegistroEstablecimiento();
    this.cargarCategorias();

    if(this.registroEstParaEditar){
      this.registroEstablecimiento = structuredClone(this.registroEstParaEditar);
      this.registroForm.patchValue(this.registroEstablecimiento);
    }

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
      categorias: this.fb.array([])
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


  cargarCategorias(){

    if(!this.registroForm) return;

    this.categoriaService.obtenerCategorias().subscribe(data => {
      this.categorias = data;

      const categoriaFormArray = this.registroForm.get('categorias') as FormArray;
      this.categorias.forEach(() => categoriaFormArray.push(new FormControl(false)));
    });
  }

  categoriaSeleccionada():boolean{
    return (this.registroForm.get('categorias') as FormArray).value.some((v:boolean) => v);
  }


  guardarRegistro(): void {

    if(this.registroForm.invalid || !this.categoriaSeleccionada()){
      this.registroForm.markAllAsTouched();
      return;
    }


    const categoriasSeleccionadas = this.registroForm.value.categorias
    .map((checked: boolean, i:number) => checked ? this.categorias[i]:null)
    .filter((v: Categoria | null) => v !== null);

    const nuevoRegistro: RegistroEstablecimiento = {
      ...this.registroForm.value,
      fechaEmision: new Date(this.registroForm.value.fechaEmision),
      fechaVencimiento: new Date(this.registroForm.value.fechaVencimiento),
      empresa: this.registroForm.value.empresa,
      categorias: categoriasSeleccionadas
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

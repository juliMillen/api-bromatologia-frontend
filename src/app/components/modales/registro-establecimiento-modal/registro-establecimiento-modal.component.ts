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
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registro-establecimiento-modal.component.html',
  styleUrl: './registro-establecimiento-modal.component.css'
})
export class RegistroEstablecimientoModalComponent implements OnInit {

  @Input() registroEstParaEditar: RegistroEstablecimiento | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Output() cerrar = new EventEmitter<void>();
  @Output() registroEstCreado = new EventEmitter<RegistroEstablecimiento>();

  registroEstablecimiento: RegistroEstablecimiento = {
    rpe: '',
    fechaEmision: new Date(),
    fechaVencimiento: new Date(),
    empresa: {
      cuitEmpresa: 0,
      razonSocial: ''
    },
    departamento: '',
    localidad: '',
    direccion: '',
    expediente: 0,
    enlace: ''
  }

  registrosEst: RegistroEstablecimiento[] = [];

  empresas: Empresa[] = [];

  categorias: Categoria[] = []

  modoEdicion: boolean = false;

  registroForm!: FormGroup;

  private fb = inject(FormBuilder);


  constructor(private empresaService: EmpresaService, private categoriaService: CategoriaService, private registroEstablecimientoService: RegistroEstablecimientoService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.formularioRegistroEstablecimiento();
    this.cargarCategorias();

    if (this.registroEstParaEditar) {
      this.registroEstablecimiento = structuredClone(this.registroEstParaEditar);
      this.registroForm.patchValue(this.registroEstablecimiento);
    }

  }

  formularioRegistroEstablecimiento() {
    this.registroForm = this.fb.group({
      rpe: ['', [Validators.required, Validators.pattern(/^08[-\/]\d{6}$/)]],
      fechaEmision: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      empresa: [null, Validators.required],
      departamento: ['', Validators.required],
      localidad: ['', Validators.required],
      direccion: ['', Validators.required],
      expediente: [null, Validators.required],
      enlace: ['', Validators.required],
      categorias: this.fb.array([])
    })
  }

  guardarRegistro(): void {

    if (this.registroForm.invalid || !this.categoriaSeleccionada()) {
      this.registroForm.markAllAsTouched();
      return;
    }

    // Obtenemos los IDs de las categorías seleccionadas
    const categoriasIds = this.registroForm.value.categorias
      .map((checked: boolean, i: number) => checked ? this.categorias[i].idCategoria : null)
      .filter((id: number | null) => id !== null) as number[];

    // Construimos el objeto de registro a guardar, obteniendo el valor del formulario
    // con getRawValue() para incluir el RPE si está deshabilitado en edición
    const registroGuardar: RegistroEstablecimiento = {
      ...this.registroForm.getRawValue(),
      fechaEmision: new Date(this.registroForm.value.fechaEmision),
      fechaVencimiento: new Date(this.registroForm.value.fechaVencimiento),
      empresa: this.registroForm.value.empresa,
      categorias: []
    };

    // Condicional para decidir entre crear y editar
    if (this.modo === 'editar') {
      const rpeActual = this.registroEstParaEditar?.rpe;
      if (!rpeActual) {
        console.error('Error: No se encontró el RPE para editar.');
        return;
      }

      this.registroEstablecimientoService.modificarRegistroEst(rpeActual, registroGuardar).subscribe({
        next: (registroActualizado) => {
          console.log('Registro actualizado correctamente');
          // Asignar las categorías actualizadas
          this.registroEstablecimientoService.asignarCategoria(rpeActual, categoriasIds).subscribe({
            next: (categoriasActualizadas) => {
              console.log("Categorías asignadas en la edición:", categoriasActualizadas);
              this.registroEstCreado.emit({ ...registroActualizado, categorias: categoriasActualizadas });
              this.cerrarModal();
            },
            error: (err) => console.error("Error al asignar categorías en la edición", err)
          });
        },
        error: (err) => {
          console.error('Error al modificar registro: ', err);
        }
      });
    } else {
      this.registroEstablecimientoService.guardarRegistro(registroGuardar).subscribe({
        next: (registroEstCreado: RegistroEstablecimiento) => {
          console.log('Registro establecimiento creado correctamente', registroEstCreado);

          // Asignar las categorías
          this.registroEstablecimientoService.asignarCategoria(registroEstCreado.rpe, categoriasIds).subscribe({
            next: (categoriasAsignadas) => {
              console.log("Categorías asignadas:", categoriasAsignadas);
              this.registroEstCreado.emit({ ...registroEstCreado, categorias: categoriasAsignadas });
              this.cerrarModal();
            },
            error: (err) => console.error("Error al asignar categorías", err)
          });
        },
        error: (error) => {
          console.error('Error al guardar registro establecimiento: ', error);
        }
      });
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  cargarEmpresas() {
    this.empresaService.getEmpresas().subscribe(data => this.empresas = data);
  }


  cargarCategorias() {

    if (!this.registroForm) return;

    this.categoriaService.obtenerCategorias().subscribe(data => {
      this.categorias = data;

      const categoriaFormArray = this.registroForm.get('categorias') as FormArray;
      this.categorias.forEach(() => categoriaFormArray.push(new FormControl(false)));
    });
  }

  categoriaSeleccionada(): boolean {
    return (this.registroForm.get('categorias') as FormArray).value.some((v: boolean) => v);
  }


  /*crearRegistro(): void {
    if (this.registroForm.invalid || !this.categoriaSeleccionada()) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const categoriasIds = this.registroForm.value.categorias
      .map((checked: boolean, i: number) => checked ? this.categorias[i].idCategoria : null)
      .filter((id: number | null) => id != null) as number[];


    const nuevoRegistro: RegistroEstablecimiento = {
      ...this.registroForm.value,
      fechaEmision: new Date(this.registroForm.value.fechaEmision),
      fechaVencimiento: new Date(this.registroForm.value.fechaVencimiento),
      empresa: this.registroForm.value.empresa,
      categorias: []
    };

    console.log('Enviando nuevo registro: ', nuevoRegistro);

    this.registroEstablecimientoService.guardarRegistro(nuevoRegistro).subscribe({
      next: (registroEstCreado: RegistroEstablecimiento) => {
        console.log('Registro establecimiento creado correctamente', registroEstCreado);

        //asigno categorias
        this.registroEstablecimientoService.asignarCategoria(registroEstCreado.rpe, categoriasIds).subscribe({
          next: (categoriasAsignadas) => {
            console.log("Categorias asignadas: ", categoriasAsignadas);
            this.registroEstCreado.emit({
              ...registroEstCreado,
              categorias: categoriasAsignadas
            });
            this.cerrar.emit();
          },
          error: (err) => console.error("Error al asignar categorias", err)
        })
      },
      error: (error) => {
        console.error('Error al guardar registro establecimiento: ', error);
      }
    });
  }*/
}

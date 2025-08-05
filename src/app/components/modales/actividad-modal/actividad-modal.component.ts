import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Actividad } from '../../../models/actividad';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActividadService } from '../../../services/actividad.service';
import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-actividad-modal',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './actividad-modal.component.html',
  styleUrl: './actividad-modal.component.css'
})
export class ActividadModalComponent implements OnInit{

  @Output() cerrar = new EventEmitter<void>()
  @Output() actividadCreada = new EventEmitter<Actividad>()

  actividad: Actividad = {
    nombreActividad: ''
  }

  actividades: Actividad[] = [];

  categorias: Categoria[] = [];

  categoriaSeleccionada: number = 0;

  actividadForm!:FormGroup;

  private fb = inject(FormBuilder);

  constructor(private actividadService: ActividadService, private categoriaService: CategoriaService){}

  ngOnInit(): void {
      this.cargarCategorias();
      this.formularioActividad();
  }

  cerrarModal(){
    this.cerrar.emit();
  }

  cargarCategorias(){
    return this.categoriaService.obtenerCategorias().subscribe({
      next:(response:Categoria[]) =>{
        this.categorias = response;
        console.log("Categorias cargadas: ",response);
      },
      error: (err) =>{
        console.log("Error al cargar categorias: ",err);
      }
    })
  }


  formularioActividad(){
    this.actividadForm = this.fb.group({
      nombreActividad: ['',Validators.required],
      categoria: ['',Validators.required]
    })
  }

  crearActividad():void{
    if(this.actividadForm.invalid){
      this.actividadForm.markAllAsTouched();
      return;
    }

    const nuevaActividad: Actividad = this.actividadForm.value;
    const categoriaSeleccionada = this.actividadForm.get('categoria')?.value;

    this.actividadService.crearActividad(nuevaActividad).subscribe({
      next: (response:Actividad) => {
        console.log('Actividad creada correctamente');
        this.actividades.push(response);


        const idActividad = nuevaActividad.idActividad;
        const idCategoria = categoriaSeleccionada.idCategoria;

        this.categoriaService.asignarActividad(idCategoria,idActividad!).subscribe({
          next:()=>{
            console.log('Actividad asignada correctamente');
          },
          error: (err) => {
            console.error('Error al asignar actividad: ',err);
          }
        })

        this.actividadForm.reset();
        this.cerrar.emit();
      },
      error: (err) => {
        console.error('Error al crear la actividad: ',err);
      }
    })
  }

  

}

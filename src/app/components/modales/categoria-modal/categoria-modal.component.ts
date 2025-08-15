import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Categoria } from '../../../models/categoria';
import { Rubro } from '../../../models/rubro';
import { CategoriaService } from '../../../services/categoria.service';
import { RubroService } from '../../../services/rubro.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-modal',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './categoria-modal.component.html',
  styleUrl: './categoria-modal.component.css'
})
export class CategoriaModalComponent implements OnInit {
  @Input() rubros: Rubro[] = [];
  @Output() cerrar = new EventEmitter<void>()
  @Output() categoriaCreada = new EventEmitter<Categoria>()

  categoria: Categoria = {
    nombreCategoria: '',
    rubro: {
      nombreRubro:''
    }
  }

  categorias: Categoria[] = [];

  categoriaForm!:FormGroup;


  private fb = inject(FormBuilder);

  constructor(private categoriaService: CategoriaService, private rubroService:RubroService){
  }

  ngOnInit(): void {
    this.cargarRubros();  
    this.formularioCategoria();
  }

  cargarRubros(){
    return this.rubroService.obtenerRubros().subscribe({
      next: (data:Rubro[]) => {
        console.log('Rubros cargados: ',data);
        this.rubros = data;
      },
      error: (err) => {
        console.error('Error al cargar rubros: ',err);
      }
    })

  }

  cerrarModal(){
    this.cerrar.emit()
  }

  formularioCategoria(){
    this.categoriaForm = this.fb.group({
      nombreCategoria: ['',Validators.required],
      rubro: [null,Validators.required]
    })
  }

  crearCategoria():void {
    if(this.categoriaForm.invalid){
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const nuevaCategoria = this.categoriaForm.get('nombreCategoria')?.value;
    const idRubro = this.categoriaForm.get('rubro')?.value;

    const categoriaSinRubro: Categoria = {
      nombreCategoria: nuevaCategoria
    }

    this.categoriaService.crearCategoria(categoriaSinRubro).subscribe({
      next: (response:Categoria) => {
        console.log("Categoria creada correctamente: ",response);

        const idCategoria = response.idCategoria;

        //ahora asignamos rubro
        this.rubroService.asignarCategoria(idRubro,idCategoria!).subscribe({
          next: () => {
            console.log('Categoria asignada al rubro correctamente');
            //emitimos evento creado para el padre
            this.categoriaCreada.emit(response);
            this.categoriaForm.reset();
            this.cerrar.emit();
          },
          error: (err) => {
            console.error('Error al asociar rubro y categoria: ',err);
          }
        })
        
      },
      error: (err) => {
        console.error('Error al crear la categoria: ',err);
      }
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaModalComponent } from '../modales/categoria-modal/categoria-modal.component';
import { RubroModalComponent } from '../modales/rubro-modal/rubro-modal.component';
import { ActividadModalComponent } from '../modales/actividad-modal/actividad-modal.component';
import { AuthService } from '../../services/auth.service';
import { RubroService } from '../../services/rubro.service';
import { Rubro } from '../../models/rubro';
import { ActividadService } from '../../services/actividad.service';
import { Actividad } from '../../models/actividad';

@Component({
  selector: 'app-categoria',
  imports: [FormsModule, CommonModule, CategoriaModalComponent, RubroModalComponent, ActividadModalComponent],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {

  categorias: Categoria[] = [];

  rubros: Rubro[] = [];
  
  actividades: Actividad[] = [];

  categoriaBuscada: string = '';

  modalAbierto= false;

  constructor(private categoriaService: CategoriaService, private rubroService:RubroService, private actividadService:ActividadService){}

  ngOnInit(): void {
      this.cargarActividades();
      this.cargarRubros();
      this.cargarCategorias();
  }

  abrirModal(){
    this.modalAbierto= true;
  }

  ocultarModal(){
    this.modalAbierto= false;
  }

  cargarActividades(){
    return this.actividadService.obtenerActividades().subscribe({
      next: (data: Actividad[]) => {
        console.log("Actividades cargadas: ",data);
        this.actividades = data;
      },
      error: (err) => {
        console.log("Error al cargar las actividades: ",err);
      }
    })
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



  cargarCategorias(){
    return this.categoriaService.obtenerCategorias().subscribe({
      next: (data:Categoria[]) => {
        console.log("categorias cargadas: ",data);
        this.categorias = data;
      },
      error: (err) => {
        console.error("Error al cargar categorias: ",err);
      }
    })
  }

  obtenerCategoriaPorNombre(nombreCategoria:string):void {
    if(!this.categoriaBuscada) return;
    this.categoriaService.obtenerCategoriaPorNombre(nombreCategoria).subscribe({
      next: (categoria:Categoria) =>{
        this.categorias = [categoria];
      },
      error: (err) => {
        console.error('Error al obtener la categoria: ',err);
        this.categorias = [];
      }
    })
  }


  eliminarCategoria(idCategoria:number):void{
    this.categoriaService.eliminarCategoria(idCategoria).subscribe({
      next:() => {
        console.log("Categoria eliminada correctamente");
        this.categorias = this.categorias.filter(e=> e.idCategoria !== idCategoria)
      },
      error: (err) =>{
        console.error("Error al eliminar la categoria: ",err);
      }
    })
  }

}

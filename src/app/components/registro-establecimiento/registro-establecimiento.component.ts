import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroEstablecimientoModalComponent } from '../modales/registro-establecimiento-modal/registro-establecimiento-modal.component';
import { RegistroEstablecimientoService } from '../../services/registro-establecimiento.service';
import { RegistroEstablecimiento } from '../../models/registroEstablecimiento';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { Mantenimiento } from '../../models/mantenimiento';
import { MantenimientoAsociadoModalComponent } from "../modales/mantenimiento-asociado-modal/mantenimiento-asociado-modal.component";
import { AuthService } from '../../services/auth.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria';


@Component({
  selector: 'app-registro-establecimiento',
  imports: [CommonModule, FormsModule, RegistroEstablecimientoModalComponent, MantenimientoAsociadoModalComponent, RouterLink],
  templateUrl: './registro-establecimiento.component.html',
  styleUrl: './registro-establecimiento.component.css'
})
export class RegistroEstablecimientoComponent implements OnInit {

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
  };

  registrosEstablecimientos: RegistroEstablecimiento[] = [];

  mantenimientos: Mantenimiento[] = [];

  categorias: Categoria[] = [];

  modalAbierto = false;

  idRegistroEstablecimiento: string = '';

  mostrarModalAsociacion = false;
  tipoModalAsociacion: 'registroEstablecimiento' | 'registroProducto' = 'registroEstablecimiento';

  modo: 'crear' | 'editar' = 'crear';

  registroEstEditando: RegistroEstablecimiento | null = null;


  constructor(private registroEstablecimientoService: RegistroEstablecimientoService, private route: ActivatedRoute, private mantenimientoService: MantenimientoService, private authService:AuthService, private categoriaService:CategoriaService) { }

  ngOnInit(): void {
    this.cargarRegistros()
    const id = String(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.registroEstablecimientoService.obtenerRegistroEstablecimientoPorId(id).subscribe({
        next: (regEst) => {
          this.registrosEstablecimientos = [regEst];
        },
        error: (err) => {
          console.error('error al cargar registro por ID: ', err);
          this.registrosEstablecimientos = [];
        }
      });
    } else {
      //cargo todos los registros
      this.cargarRegistros();


      //Cargo categorias
      this.cargarCategorias()
      
      //cargo mantenimientos
      this.cargarMantenimientos();
    }
  }

  abrirModal() {
    this.registroEstEditando
    this.modo = 'crear';
    this.modalAbierto = true;
  }

  ocultarModal() {
    this.modalAbierto = false;
  }

  abrirModalAsociacion(tipo: 'registroEstablecimiento' | 'registroProducto') {
    this.tipoModalAsociacion = tipo;
    this.mostrarModalAsociacion = true;
  }

  cerrarModalAsociacion() {
    this.mostrarModalAsociacion = false;
  }

    abrirModalParaEditar(registroEst: RegistroEstablecimiento): void {
      this.registroEstEditando = registroEst;
      this.modo = 'editar'
      this.modalAbierto = true;
    }

  isAdmin(): boolean {
    return this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN'
  }

  cargarRegistros(): void {
    this.registroEstablecimientoService.obtenerRegistrosEstablecimientos().subscribe({
      next: (data: RegistroEstablecimiento[]) => {
        console.log('Registros cargados: ', data);
        this.registrosEstablecimientos = data;
      },
      error: (err) => {
        console.error('Error al cargar registros de establecimientos', err);
      }
    })
  }

  cargarMantenimientos(): void {
    this.mantenimientoService.obtenerMantenimientos().subscribe({
      next: (data: Mantenimiento[]) => {
        console.log('Mantenimientos cargados: ', data);
        this.mantenimientos = data;
      },
      error: (err) => {
        console.error('Error al cargar mantenimientos: ', err);
      }
    })
  }

  cargarCategorias(): void{
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data: Categoria[]) => {
        console.log('Categorias cargadas: ',data);
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al cargar categorias: ',err)
      }
    })
  }

  obtenerRegistroEstablecimientoPorId(): void {
    if (!this.idRegistroEstablecimiento) return;
    this.registroEstablecimientoService.obtenerRegistroEstablecimientoPorId(this.idRegistroEstablecimiento).subscribe({
      next: (registroEst: RegistroEstablecimiento) => {
        this.registrosEstablecimientos = [registroEst];
      },
      error: (err) => {
        console.error('Error al obtener el registro establecimiento: ', err);
        this.registrosEstablecimientos = [];
      }
    })
  }

  registroCreado(registro: RegistroEstablecimiento) {
    this.registrosEstablecimientos.push(registro);
    this.registroEstablecimiento = registro;
  }


  guardarRegistro(nuevoRegistro:RegistroEstablecimiento):void{
      if(this.registroEstEditando){
        this.modificarRegistroEstablecimiento(nuevoRegistro)
        this.registroEstEditando = null;
      }else{
        this.registroEstablecimientoService.guardarRegistro(nuevoRegistro).subscribe({
          next:(nuevo) =>{
            this.registrosEstablecimientos.push(nuevo);
          },
          error: (err) => {
            console.error('Error al guardar el registro de establecimiento: ',err);
          }
        })
      }
      this.ocultarModal();
    }

    modificarRegistroEstablecimiento(reg:RegistroEstablecimiento): void{
      this.registroEstablecimientoService.modificarRegistroEst(reg.rpe,reg).subscribe({
        next: (response) => {
          console.log('Registro Establecimiento modificado correctamente: ',response);
          this.cargarRegistros();
        },
        error: (err)=> {
          console.error('Error al modificar el registro: ',err);
        }
      });
    }


    eliminarRegistroEst(rpe:string):void{
      this.registroEstablecimientoService.eliminarRegistro(rpe).subscribe({
        next: () => {
          console.log('Registor Eliminado correctamente');
          this.registrosEstablecimientos = this.registrosEstablecimientos.filter(e => e.rpe !== rpe)
        },
        error: (err) =>{
          console.error('Error al eliminar registro: ',err);
        }
      })

    }


}

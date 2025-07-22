import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstablecimientoModalComponent } from "../modales/establecimiento-modal/establecimiento-modal.component";
import { ProductoModalComponent } from "../modales/producto-modal/producto-modal.component";
import { Establecimiento } from '../../models/establecimiento';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-establecimiento',
  imports: [CommonModule, FormsModule, EstablecimientoModalComponent, ProductoModalComponent],
  templateUrl: './establecimiento.component.html',
  styleUrl: './establecimiento.component.css'
})
export class EstablecimientoComponent implements OnInit {

  mostrarModalEstablecimiento = false;
  mostrarModalProducto = false;
  idEstablecimientoCreado: number | undefined;
  
  establecimiento:Establecimiento = {
    localidad: '',
    departamento: '',
    direccion: '',
    cuitEmpresa: 0,
    productos: []
  }

  establecimientos: Establecimiento[] = [];

  establecimientoBuscado: number = 0;

  esAdmin: boolean = false;

  constructor(private establecimientoService:EstablecimientoService, private authService:AuthService){}


  ngOnInit(): void {
    this.esAdmin = this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN';
    this.cargarEstablecimientos();
  }

  isAdmin():boolean{
    return this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN';
  }

  cargarEstablecimientos():void{
    this.establecimientoService.obtenerEstablecimientos().subscribe({
      next: (data: Establecimiento[]) => {
        this.establecimientos = data;
        console.log('Establecimientos cargados: ',data);
      },
      error: (err) => {
        console.error('Error al cargar establecimientos');
      }
    })
  }

  abrirEstablecimientoModal():void{
    this.mostrarModalEstablecimiento = true;
  }

  cerrarEstablecimientoModal():void{
    this.mostrarModalEstablecimiento=false;
  }

  abrirProductoModal(establecimiento:Establecimiento):void {
    this.idEstablecimientoCreado = establecimiento.idEstablecimiento;
    this.mostrarModalEstablecimiento=false;
    this.mostrarModalProducto = true;
  }

  cerrarProductoModal():void {
    this.mostrarModalProducto=false;
    this.idEstablecimientoCreado=undefined;
  }


  obtenerEstablecimientoPorId():void{
    if(!this.establecimientoBuscado) return;
    this.establecimientoService.obtenerEstablecimientoPorId(this.establecimientoBuscado).subscribe({
      next: (establecimiento:Establecimiento) => {
        this.establecimientos = [establecimiento];
      },
      error: (err) => {
        console.error('Error al obtener el establecimiento: ', err);
        this.establecimientos = [];
      }
    })
   }

  eliminarEstablecimiento(idEstablecimiento:number):void {
    this.establecimientoService.eliminarEstablecimiento(idEstablecimiento!).subscribe({
      next: () => {
        console.log('Establecimiento eliminado correctamente');
        this.establecimientos = this.establecimientos.filter(e => e.idEstablecimiento !== idEstablecimiento);
      },
      error: (err) => {
        console.log('Error al eliminar el establecimiento: ',err);
      }
    });
  }
}

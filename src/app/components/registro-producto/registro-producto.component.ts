import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroProducto } from '../../models/registroProducto';
import { RegistroProductoModalComponent } from "../modales/registro-producto-modal/registro-producto-modal.component";
import { RouterLink } from '@angular/router';
import { MantenimientoAsociadoModalComponent } from "../modales/mantenimiento-asociado-modal/mantenimiento-asociado-modal.component";
import { RegistroProductoService } from '../../services/registro-producto.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-registro-producto',
  imports: [CommonModule, FormsModule, RegistroProductoModalComponent, RouterLink, MantenimientoAsociadoModalComponent],
  templateUrl: './registro-producto.component.html',
  styleUrl: './registro-producto.component.css'
})
export class RegistroProductoComponent implements OnInit {

  mostrarModalRegistroProducto = false;
  mostrarModalRegistroProductoEstablecimiento = false;
  mostrarModalAsociacion = false;
  tipoModalAsociacion: 'registroProducto' | 'registroEstablecimiento' = 'registroProducto'

  registroProductoCreado!: RegistroProducto;
  registrosProductos: RegistroProducto[] = [];

  modo: 'crear' | 'editar' = 'crear';

  registroProdEditando: RegistroProducto | null = null;


  idRegistroProducto: string = '';
  idRegistroEstablecimiento: string = '';

  constructor(private registroProductoService: RegistroProductoService, private authService: AuthService) { }

  ngOnInit(): void {
    //this.cargarRegistros();
    this.obtenerRegistrosConMantenimiento();
  }

  cargarRegistros() {
    this.registroProductoService.obtenerRegistros().subscribe(data => this.registrosProductos = data);
  }

  abrirRegistroProductoModal() {
    this.registroProdEditando = null;
    this.modo = 'crear';
    this.mostrarModalRegistroProducto = true;
  }

  abrirModalAsociacion(tipo: 'registroProducto' | 'registroEstablecimiento') {
    this.tipoModalAsociacion = tipo
    this.mostrarModalAsociacion = true;
  }

  cerrarModalAsociacion() {
    this.mostrarModalAsociacion = false;
  }

  abrirModalParaEditar(registroProd: RegistroProducto): void {
    this.registroProdEditando = registroProd;
    this.modo = 'editar'
    this.mostrarModalRegistroProducto = true;
  }

  isAdmin(): boolean {
    return this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN'
  }


  onRegistroProductoCreado(registro: RegistroProducto) {
    this.registroProductoCreado = registro;
    this.mostrarModalRegistroProducto = false;
    this.mostrarModalRegistroProductoEstablecimiento = true;
  }

  obtenerRegistroProductoEstablecimientoPorId() {
    this.registroProductoService.obtenerRegistroPorId(this.idRegistroProducto).subscribe({
      next: (registroProdEst: RegistroProducto) => {
        this.registrosProductos = [registroProdEst];
      },
      error: (err) => {
        console.error('No se ha encontrado ningun registro: ', err);
      }
    })
  }

  obtenerRegistrosConMantenimiento() {
    this.registroProductoService.obtenerRegistroConMantenimientos().subscribe(data => {
      this.registrosProductos = data;
      console.log('Registros con mantenimientos: ', this.registrosProductos);
    })
  }


  modificarRegistroProducto(reg: RegistroProducto): void {
    this.registroProductoService.modificarRegistroProducto(reg.rppa, reg).subscribe({
      next: (response) => {
        console.log('Registro Producto modificado correctamente: ', response);
        this.cargarRegistros();
      },
      error: (err) => {
        console.error('Error al modificar el registro: ', err);
      }
    });
  }

  eliminarRegistroProducto(rppa:string):void{
    this.registroProductoService.eliminarRegistroProducto(rppa).subscribe({
      next: () => {
        console.log('Registro eliminado correctamente');
        this.registrosProductos = this.registrosProductos.filter(e => e.rppa !== rppa);
      },
      error: (err) => {
        console.error('Error al eliminar el registro: ',err);
      }
    })
  }

}

import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule,RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  items = [
    {
      titulo: 'Empresa',
      descripcion: 'Gestione los datos de la empresa y sus titulares',
      icon: 'bi bi-building',
      link: '/empresa',
      color: '#007bff'
    },
    {
      titulo: 'Registro Establecimiento',
      descripcion: 'Gestione, cree o edite registros de establecimientos',
      icon: 'bi bi-r-square',
      link: '/registroEstablecimiento',
      color: '#17a2b8'
    },
    {
      titulo: 'Registro Producto',
      descripcion: 'Gestione, cree o edite registros de productos',
      icon: 'bi bi-r-square',
      link: '/registroProducto',
      color: '#ffc107'
    },
      {
      titulo: 'Categoria',
      descripcion: 'Administre las categorias, rubros y actividades',
      icon: 'bi bi-bookmark-check-fill',
      link: '/categoria',
      color: '#28a745'
    },
    {
      titulo: 'Mantenimiento',
      descripcion: 'Seccion de mantenimiento en los distintos registros',
      icon: 'bi bi-tools',
      link: '/mantenimiento',
      color: '#dc3545'
    }
  ];
}

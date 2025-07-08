import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/empresa';

@Component({
  selector: 'app-empresa',
  imports: [FormsModule, CommonModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent implements OnInit{

  empresa: Empresa = {
    cuit: 0,
    nombreEmpresa: '',
    email: '',
    telefono: '',
    titular: {
      cuitTitular: 0,
      nombre: '',
      telefono: '',
      email: ''
    }
  };

  empresas: Empresa[] = [];

  empresaEditanto: Empresa | null = null;

  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.getEmpresas().subscribe({
      next: (data: Empresa[]) => {
        this.empresas = data;
      },
      error: (err) => {
        console.error('Error al cargar las empresas: ', err);
      }
    });
  }

  crearEmpresa(): void {
    this.empresaService.crearEmpresa(this.empresa).subscribe({
      next: (response: Empresa) => {
        console.log('Empresa creada correctamente: ', response);
        this.empresas.push(response);

        //Reinicia el formulario
        this.empresa = {
          cuit: 0,
          nombreEmpresa: '',
          email: '',
          telefono: '',
          titular: {
            cuitTitular: 0,
            nombre: '',
            email: '',
            telefono: ''
          }
        };
      },
      error:(err) => {
        console.log('Error al crear la empresa: ',err);
      }
  })
  }


  modificarEmpresa(empresa:Empresa): void{
    this.empresaService.modificarEmpresa(empresa.cuit,empresa).subscribe({
      next: (response) => {
        console.log('Empresa modificada correctamente: ',response);
        this.cargarEmpresas();
      },
      error: (err)=> {
        console.error('Error al modificar la empresa: ',err);
      }
    });
  }


  eliminarEmpresa(cuit:number):void {
    this.empresaService.eliminarUnaEmpresa(cuit).subscribe({
      next: () => {
        console.log('Empresa eliminada correctamente');
        this.empresas = this.empresas.filter( e => e.cuit !== cuit);
      },
      error: (err) => {
        console.log('Error al eliminar la empresa: ',err);
      }
    })
  }
}



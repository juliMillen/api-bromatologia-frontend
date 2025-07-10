import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/empresa';
import { EmpresaModalComponent } from "../../modales/empresa-modal/empresa-modal.component";

@Component({
  selector: 'app-empresa',
  imports: [FormsModule, CommonModule, EmpresaModalComponent],
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

  modalAbierto = false;

  cuitBuscado: number = 0;

  rolUsuario: string= '';

  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  ocultarModal() {
    this.modalAbierto = false;
  }


  obtenerEmpresaPorCuit(): void{
    if(!this.cuitBuscado) return;
    this.empresaService.obtenerEmpresa(this.cuitBuscado).subscribe({
      next: (empresa:Empresa) => {
        this.empresas = [empresa];
      },
      error: (err) => {
        console.error('Error al obtener la empresa: ', err);
        this.empresas = []
      }
    })
  }

  guardarEmpresa(nuevaEmpresa:Empresa){
    this.empresas.push(nuevaEmpresa)
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



import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/empresa';
import { EmpresaModalComponent } from "../../modales/empresa-modal/empresa-modal.component";
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-empresa',
  imports: [FormsModule, CommonModule, EmpresaModalComponent],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent implements OnInit{

  empresa: Empresa = {
    cuitEmpresa: 0,
    nombreEmpresa: '',
    email: '',
    telefono: '',
    titular: {
      cuitTitular: 0,
      nombreTitular: '',
      telefono: '',
      email: ''
    }
  };

  empresas: Empresa[] = [];

  empresaEditando: Empresa | null = null;

  modalAbierto = false;

  cuitBuscado: number = 0;

  rolUsuario: string= '';

  modo: 'crear' | 'editar' = 'crear';

  constructor(private empresaService: EmpresaService, private authService: AuthService) { }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  abrirModal() {
    this.empresaEditando = null;
    this.modo = 'crear';
    this.modalAbierto = true;
  }

  ocultarModal() {
    this.modalAbierto = false;
  }

  abrirModalParaEditar(empresa:Empresa):void {
    this.empresaEditando = empresa;
    this.modo = 'editar'
    this.modalAbierto = true;
  }

  isAdmin(): boolean {
    return this.authService.obtenerRolDesdeToken() === 'ROLE_ADMIN'
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

  guardarEmpresa(nuevaEmpresa:Empresa):void{
    if(this.empresaEditando){
      this.modificarEmpresa(nuevaEmpresa);
      this.empresaEditando= null;
    }else{
      this.empresaService.crearEmpresa(nuevaEmpresa).subscribe({
        next:(nueva) =>{
          this.empresas.push(nueva);
        },
        error: (err) => {
          console.error('Error al crear empresa: ',err);
        }
      })
    }
    this.ocultarModal();
  }

  cargarEmpresas(): void {
    this.empresaService.getEmpresas().subscribe({
      next: (data: Empresa[]) => {
        console.log("Empresas cargadas: ",data);
        this.empresas = data;
      },
      error: (err) => {
        console.error('Error al cargar las empresas: ', err);
      }
    });
  }

  modificarEmpresa(empresa:Empresa): void{
    this.empresaService.modificarEmpresa(empresa.cuitEmpresa,empresa).subscribe({
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
        this.empresas = this.empresas.filter( e => e.cuitEmpresa !== cuit);
      },
      error: (err) => {
        console.log('Error al eliminar la empresa: ',err);
      }
    })
  }
}



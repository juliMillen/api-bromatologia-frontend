import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';

@Component({
  selector: 'app-empresa',
  imports: [FormsModule, CommonModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css'
})
export class EmpresaComponent {

  empresa: any = {
    cuit: '',
    nombre: '',
    email:'',
    telefono: '',
    titular: {
      cuit: '',
      nombre: '',
      telefono: '',
      email: ''
    }
  };

  empresas : any[] = [];

  constructor(private empresaService:EmpresaService){}

  ngOnInit(): void {
    this.crearEmpresa();
  }

  crearEmpresa(){
    this.empresas.push(this.empresa);

    this.empresa = {
      cuit: '',
      nombre: '',
      email: '',
      telefono: '',
      titular: {
        cuit: '',
        nombre: '',
        email: '',
        telefono: ''
      }
    }
  };
}



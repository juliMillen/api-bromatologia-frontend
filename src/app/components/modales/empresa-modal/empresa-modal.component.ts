import { Component, EventEmitter, Output } from '@angular/core';
import { Empresa } from '../../../models/empresa';
import { EmpresaService } from '../../../services/empresa.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empresa-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './empresa-modal.component.html',
  styleUrl: './empresa-modal.component.css'
})
export class EmpresaModalComponent {

  @Output() cerrar = new EventEmitter<void>()
  @Output() empresaCreada = new EventEmitter<Empresa>()

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
  


    constructor(private empresaService: EmpresaService) {}

    cerrarModal(){
      this.empresaCreada.emit();
      this.cerrar.emit();
    }

     crearEmpresa(): void {
    this.empresaService.crearEmpresa(this.empresa).subscribe({
      next: (response: Empresa) => {
        console.log('Empresa creada correctamente: ', response);
        this.empresas.push(response);

        //Reinicia el formulario
        this.empresa = {
          cuitEmpresa: 0,
          nombreEmpresa: '',
          email: '',
          telefono: '',
          titular: {
            cuitTitular: 0,
            nombreTitular: '',
            email: '',
            telefono: ''
          }
        };
          this.cerrar.emit();
      },
      error:(err) => {
        console.log('Error al crear la empresa: ',err);
      }
  })
  }
}

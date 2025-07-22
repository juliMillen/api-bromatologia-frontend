import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class EmpresaModalComponent implements OnInit {

  @Input() empresaParaEditar: Empresa | null = null;
  @Input() modo: 'crear' | 'editar' = 'crear';
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
  
    modoEdicion: boolean = false;


    constructor(private empresaService: EmpresaService) {}

    ngOnInit(): void {
        if(this.empresaParaEditar){
          this.empresa = JSON.parse(JSON.stringify(this.empresaParaEditar))
        }
    }

    guardarEmpresa():void {
      this.empresaCreada.emit(this.empresa);
    }

    cerrarModal(){
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

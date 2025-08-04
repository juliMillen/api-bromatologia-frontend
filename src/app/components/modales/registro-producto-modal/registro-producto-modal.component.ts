import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistroProducto } from '../../../models/registroProducto';
import { RegistroProductoService } from '../../../services/registro-producto.service';
import { RegistroEstablecimiento } from '../../../models/registroEstablecimiento';
import { RegistroEstablecimientoService } from '../../../services/registro-establecimiento.service';

@Component({
  selector: 'app-registro-producto-modal',
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './registro-producto-modal.component.html',
  styleUrl: './registro-producto-modal.component.css'
})
export class RegistroProductoModalComponent implements OnInit {


  @Output() cerrar = new EventEmitter<void>()
  @Output() registroProdCreado = new EventEmitter<RegistroProducto>

  registrosEst: RegistroEstablecimiento[] = [];

  registroProducto: RegistroProducto = {
    rppa: '',
    fechaEmision: new Date(),
    fechaVencimiento: new Date(),
    registroEstablecimiento: {
      rpe: ''
    },
    denominacion: '',
    marca: '',
    nombreFantasia: '',
    categoriaProducto: '',
    expediente: 0,
    enlace: '',
    elaborador: ''
  }



  registroForm!: FormGroup;

  private fb = inject(FormBuilder);

  constructor(private registroProductoService:RegistroProductoService, private registroEstablecimientoService: RegistroEstablecimientoService) {}


  ngOnInit(): void {
    this.cargarRegistros();
    this.formularioRegistro();
  }


  formularioRegistro(){
    this.registroForm = this.fb.group({
      rppa: ['',Validators.required],
      fechaEmision: ['',Validators.required],
      fechaVencimiento:['',Validators.required],
      registroEstablecimiento: ['',Validators.required],
      denominacion: ['',Validators.required],
      marca: ['',Validators.required],
      nombreFantasia: ['',Validators.required],
      categoriaProducto: ['',Validators.required],
      expediente:[null, Validators.required],
      enlace: ['',Validators.required],
    })
  }

  cerrarModal(){
    this.cerrar.emit();
  }

  cargarRegistros(){
    this.registroEstablecimientoService.obtenerRegistrosEstablecimientos().subscribe(data => this.registrosEst = data);
  }

  guardarRegistro(){

    if(this.registroForm.invalid){
      this.registroForm.markAllAsTouched();
      return;
    }

    const nuevoRegistro: RegistroProducto = this.registroForm.value;


    this.registroProductoService.guardarRegistroProducto(nuevoRegistro).subscribe({

      next:(registroProdCreado:RegistroProducto) => {
        console.log('Registro Producto creado correctamente');

        this.registroProdCreado.emit(registroProdCreado);

        //cierro el modal
        this.cerrar.emit();
      },
      error: (err) =>{
        console.log('No se ha podido crear el registro',err);
      }
    })
  }
}

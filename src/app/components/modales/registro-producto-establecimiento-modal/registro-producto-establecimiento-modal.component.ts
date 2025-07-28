import { Component, EventEmitter, Input, OnInit,OnChanges,SimpleChanges, Output, SimpleChange, inject } from '@angular/core';
import { RegistroProducto } from '../../../models/registroProducto';
import { RegistroEstablecimiento } from '../../../models/registroEstablecimiento';
import { RegistroProductoEstablecimientoService } from '../../../services/registro-producto-establecimiento.service';
import { RegistroProductoEstablecimiento } from '../../../models/registroProductoEstablecimiento';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroProductoService } from '../../../services/registro-producto.service';
import { RegistroEstablecimientoService } from '../../../services/registro-establecimiento.service';

@Component({
  selector: 'app-registro-producto-establecimiento-modal',
  imports: [FormsModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './registro-producto-establecimiento-modal.component.html',
  styleUrl: './registro-producto-establecimiento-modal.component.css'
})
export class RegistroProductoEstablecimientoModalComponent implements OnInit {
  @Output() cerrar = new EventEmitter<void>();
  @Output() registroCreado = new EventEmitter<RegistroProductoEstablecimiento>();
  
  @Input() registroProducto!: RegistroProducto;
  @Input() registroEstablecimiento!: RegistroEstablecimiento;

  registrosProductos: RegistroProducto[] = [];
  registrosEstablecimientos: RegistroEstablecimiento[] = [];


  registroProductoEstablecimiento: RegistroProductoEstablecimiento = {
    idRegistroProducto: 0,
    idRegistroEstablecimiento:0,
    rnpaActual: '',
    rnpaAnterior: '',
    fechaEmision: new Date().toISOString().split('T')[0],
    tipo: '',
    nroRne: '',
    certificado: '',
    expediente: 0
  }

  registroForm!: FormGroup;

  private fb = inject(FormBuilder);


  constructor(private registroProductoEstablecimientoService: RegistroProductoEstablecimientoService, private registroProductoService:RegistroProductoService, private registroEstablecimientoService: RegistroEstablecimientoService) {}


  ngOnInit(): void {
    this.cargarDatos();
    this.formularioRegistroProdEst();

    if(this.registroProducto){
      this.registroForm.patchValue({
        idRegistroProducto:this.registroProducto.idRegistroProducto
      });
    }

    if(this.registroEstablecimiento){
      this.registroForm.patchValue({
        idRegistroEstablecimiento: this.registroEstablecimiento.idRegistroEstablecimiento
      });
    }
  }


  formularioRegistroProdEst(){
    this.registroForm = this.fb.group({
      idRegistroProducto: [null, Validators.required],
      idRegistroEstablecimiento: [null, Validators.required],
      rnpaActual: ['', Validators.required],
      rnpaAnterior: ['', Validators.required],
      fechaEmision: ['',Validators.required],
      tipo: ['',Validators.required],
      nroRne: ['', Validators.required],
      certificado: ['',Validators.required],
      expediente: [null, Validators.required]
    })
  }

  cargarDatos(){
    this.registroProductoService.obtenerRegistros().subscribe(data => this.registrosProductos = data);
    this.registroEstablecimientoService.obtenerRegistrosEstablecimientos().subscribe(data => this.registrosEstablecimientos = data);
  }


  cerrarModal(){
    this.cerrar.emit();
  }


  guardarRegistroProductoEstablecimiento(){

    if(this.registroForm.invalid){
      this.registroForm.markAllAsTouched();
      return;
    }

    const nuevoRegistro: RegistroProductoEstablecimiento = this.registroForm.value;

    if(!nuevoRegistro.fechaEmision){
      console.log('La fecha de emision es obligatoria');
      return;
    }


    this.registroProductoEstablecimientoService.guardarRegistroProductoEstablecimiento(nuevoRegistro.idRegistroProducto,nuevoRegistro.idRegistroEstablecimiento,nuevoRegistro).subscribe({
      next: (data) => {
        this.registroCreado.emit(data);
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al guardar el registro producto: ',err);
      }
    })
  }
}

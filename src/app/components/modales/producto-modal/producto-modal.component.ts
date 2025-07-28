import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../../services/producto.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstablecimientoService } from '../../../services/establecimiento.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-modal',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './producto-modal.component.html',
  styleUrl: './producto-modal.component.css'
})
export class ProductoModalComponent implements OnInit{

  @Input() idEstablecimiento!:number | undefined;
  @Output() cerrar = new EventEmitter<void>()
  @Output() productoCreado = new EventEmitter<Producto>()

  producto: Producto = {
    marca: '',
    denominacion: '',
    nombreFantasia: ''
  }

  productos: Producto[] = [];

  idProductoCreado: number | undefined;

  productoForm!: FormGroup;

  private fb = inject(FormBuilder);

  constructor(private productoService: ProductoService, private establecimentoService:EstablecimientoService){}


  ngOnInit(): void {
    this.formularioProducto();
  }


  cerrarProductoModal(){
    this.productoCreado.emit();
    this.cerrar.emit();
  }

  formularioProducto(){
    this.productoForm = this.fb.group({
      marca: ['', Validators.required],
      denominacion: ['',Validators.required],
      nombreFantasia: ['',Validators.required]
    })
  }

  crearProductoYAsociar():void {

    if(this.productoForm.invalid){
      this.productoForm.markAllAsTouched();
      return;
    }

    const nuevoProducto: Producto = this.productoForm.value;
    this.productoService.agregarProducto(nuevoProducto).subscribe({
      next: (response: Producto) => {
        this.idProductoCreado = response.idProducto;
        if(this.idProductoCreado !== undefined){
          this.establecimentoService.agregarProducto(this.idEstablecimiento!,this.idProductoCreado!)
          .subscribe({
            next: () => {
              console.log('Producto asociado correctamente');
              this.cerrarProductoModal();
            },
            error: err => console.error('Error al asociar el producto',err)
          });
        } else{
          throw new Error('El backend no devolvia idProducto');
        }
        console.log('Producto creado correctamente: ',response);
        
        //Reinicio formulario
        this.productoForm.reset();
      },
      error:(err) =>{
        console.log('Error al crear el producto',err);
      }
    })
  }
}

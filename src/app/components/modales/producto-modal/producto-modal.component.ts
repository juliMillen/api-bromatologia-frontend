import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Producto } from '../../../models/producto';
import { ProductoService } from '../../../services/producto.service';
import { FormsModule } from '@angular/forms';
import { EstablecimientoService } from '../../../services/establecimiento.service';

@Component({
  selector: 'app-producto-modal',
  imports: [FormsModule],
  templateUrl: './producto-modal.component.html',
  styleUrl: './producto-modal.component.css'
})
export class ProductoModalComponent {

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

  constructor(private productoService: ProductoService, private establecimentoService:EstablecimientoService){}

  cerrarProductoModal(){
    this.productoCreado.emit();
    this.cerrar.emit();
  }

  crearProductoYAsociar():void {
    this.productoService.agregarProducto(this.producto).subscribe({
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
        this.producto = {
          marca: '',
          denominacion: '',
          nombreFantasia: ''
        }
      },
      error:(err) =>{
        console.log('Error al crear el producto',err);
      }
    })
  }
}

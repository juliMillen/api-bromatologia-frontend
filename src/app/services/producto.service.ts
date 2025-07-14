import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = environment.apiUrl + '/producto';

  constructor(private http:HttpClient) { }


  //obtener productos
  obtenerProductos():Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.apiUrl}/`);
  }

  //obtener producto por id

  obtenerProductoPorId(id:number):Observable<Producto>{
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  //crear producto

  agregarProducto(producto:Producto):Observable<Producto>{
    return this.http.post<Producto>(`${this.apiUrl}/`,producto);
  }

  //actualizar producto
  actualizarProducto(id:number,producto:Producto):Observable<Producto>{
    return this.http.patch<Producto>(`${this.apiUrl}/${id}`,producto)
  }

  //eliminar producto

  eliminarProducto(id:number):Observable<Producto>{
    return this.http.delete<Producto>(`${this.apiUrl}/${id}`);
  }
}

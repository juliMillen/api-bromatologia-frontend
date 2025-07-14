import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegistroProducto } from '../models/registroProducto';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { Mantenimiento } from '../models/mantenimiento';

@Injectable({
  providedIn: 'root'
})
export class RegistroProductoService {
  private apiUrl = environment.apiUrl + '/registro-producto';
  
    constructor(private http:HttpClient) { }
  
    //obtener registros productos
  
    obtenerRegistros():Observable<RegistroProducto[]>{
      return this.http.get<RegistroProducto[]>(`${this.apiUrl}/`);
    }
  
    //obtener registro por id
    obtenerRegistroPorId(idRegistro:number):Observable<RegistroProducto>{
      return this.http.get<RegistroProducto>(`${this.apiUrl}/${idRegistro}`);
    }
  
    //guardar registro producto
  
    guardarRegistroProducto(registroProducto:RegistroProducto):Observable<RegistroProducto>{
      return this.http.post<RegistroProducto>(`${this.apiUrl}`,registroProducto);
    }
  
    //asignar producto
  
    asignarProducto(idRegistro:number, idProducto:number):Observable<Producto>{
      return this.http.post<Producto>(`${this.apiUrl}/${idRegistro}/producto/${idProducto}`,null);
    }
  
    //agregar mantenimiento
  
    agregarMantenimiento(idRegistro:number, idMantenimiento:number):Observable<Mantenimiento>{
      return this.http.post<Mantenimiento>(`${this.apiUrl}/${idRegistro}/mantenimiento/${idMantenimiento}`,null);
    }
  
    //eliminar registro producto
  
    eliminarRegistroProducto(idRegistro:number):Observable<RegistroProducto>{
      return this.http.delete<RegistroProducto>(`${this.apiUrl}/${idRegistro}`);
    }
}

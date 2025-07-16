import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Establecimiento } from '../models/establecimiento';
import { Producto } from '../models/producto';
import { Empresa } from '../models/empresa';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientoService {

  private apiUrl = environment.apiUrl + '/establecimiento';

  constructor(private http:HttpClient) { }


  //obtener establecimientos registrados

  obtenerEstablecimientos(): Observable<Establecimiento[]>{
    return this.http.get<Establecimiento[]>(`${this.apiUrl}/`);
  }

  //Obtener establecimiento por id

  obtenerEstablecimientoPorId(id:number): Observable<Establecimiento>{
    return this.http.get<Establecimiento>(`${this.apiUrl}/${id}`);
  }

  //Obtener productos de establecimientos
  obtenerProductos(id:number): Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.apiUrl}/${id}/productos`);
  }

  // crear un establecimiento

  crearEstablecimiento(establecimiento:Establecimiento): Observable<Establecimiento>{
    return this.http.post<Establecimiento>(`${this.apiUrl}/`,establecimiento);
  }

  // agregar Producto a establecimiento

  agregarProducto(idEstablecimiento:number, idProducto:number){
    return this.http.post<Producto>(`${this.apiUrl}/${idEstablecimiento}/productos/${idProducto}`,null);
  }


  //eliminar establecimiento
  eliminarEstablecimiento(id:number): Observable<Establecimiento>{
    return this.http.delete<Establecimiento>(`${this.apiUrl}/${id}`);
  }
}

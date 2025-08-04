import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegistroProducto } from '../models/registroProducto';
import { Observable } from 'rxjs';
import { Mantenimiento } from '../models/mantenimiento';

@Injectable({
  providedIn: 'root'
})
export class RegistroProductoService {
  private apiUrl = environment.apiUrl + '/registroProducto';

  constructor(private http: HttpClient) { }

  //obtener registros productos

  obtenerRegistros(): Observable<RegistroProducto[]> {
    return this.http.get<RegistroProducto[]>(`${this.apiUrl}/`);
  }

  //obtener registro por id
  obtenerRegistroPorId(idRegistro: string): Observable<RegistroProducto> {
    return this.http.get<RegistroProducto>(`${this.apiUrl}/${idRegistro}`);
  }

  //guardar registro producto

  guardarRegistroProducto(registroProducto: RegistroProducto): Observable<RegistroProducto> {
    return this.http.post<RegistroProducto>(`${this.apiUrl}`, registroProducto);
  }


  //agregar mantenimiento

  agregarMantenimiento(idRegistro: string, idMantenimiento: number): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(`${this.apiUrl}/${idRegistro}/mantenimiento/${idMantenimiento}`, null);
  }

  //eliminar registro producto

  eliminarRegistroProducto(idRegistro: string): Observable<RegistroProducto> {
    return this.http.delete<RegistroProducto>(`${this.apiUrl}/${idRegistro}`);
  }


  //obtener registro con mantenimiento

  obtenerRegistroConMantenimientos(): Observable<RegistroProducto[]> {
    return this.http.get<RegistroProducto[]>(`${this.apiUrl}/registroProductoConMantenimientos`);
  }

}

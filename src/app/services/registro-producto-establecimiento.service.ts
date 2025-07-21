import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { RegistroProducto } from '../models/registroProducto';
import { RegistroProductoEstablecimiento } from '../models/registroProductoEstablecimiento';


@Injectable({
  providedIn: 'root'
})
export class RegistroProductoEstablecimientoService {

  private apiUrl = environment.apiUrl + '/registroProductoEstablecimiento';

  constructor(private http:HttpClient) { }

  //obtener registros productos

  obtenerRegistros():Observable<RegistroProductoEstablecimiento[]>{
    return this.http.get<RegistroProductoEstablecimiento[]>(`${this.apiUrl}/`);
  }

  //obtener registro por id
  obtenerRegistroPorId(idRegistroProducto:number, idRegistroEstablecimiento:number):Observable<RegistroProductoEstablecimiento>{
    return this.http.get<RegistroProductoEstablecimiento>(`${this.apiUrl}/${idRegistroProducto}/${idRegistroEstablecimiento}`);
  }

  //guardar registro producto

  guardarRegistroProductoEstablecimiento(idRegistroProducto:number, idRegistroEstablecimiento:number,registroProductoEstablecimiento:RegistroProductoEstablecimiento):Observable<RegistroProductoEstablecimiento>{
    return this.http.post<RegistroProductoEstablecimiento>(`${this.apiUrl}/${idRegistroProducto}/${idRegistroEstablecimiento}`,registroProductoEstablecimiento);
  }


  //eliminar registro producto establecimiento
  eliminarRegistroProductoEstablecimiento(idRegistroProducto:number, idRegistroEstablecimiento:number):Observable<RegistroProductoEstablecimiento>{
    return this.http.delete<RegistroProductoEstablecimiento>(`${this.apiUrl}/${idRegistroProducto}/${idRegistroEstablecimiento}`);
  }


}

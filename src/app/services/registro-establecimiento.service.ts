import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroEstablecimiento } from '../models/registroEstablecimiento';
import { Titular } from '../models/titular';
import { Empresa } from '../models/empresa';
import { Establecimiento } from '../models/establecimiento';
import { Mantenimiento } from '../models/mantenimiento';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class RegistroEstablecimientoService {

  private apiUrl = environment.apiUrl + '/registroEstablecimiento';

  constructor(private http:HttpClient) { }

  //obtener registros establecimientos

  obtenerRegistrosEstablecimientos():Observable<RegistroEstablecimiento[]>{
    return this.http.get<RegistroEstablecimiento[]>(`${this.apiUrl}`);
  }

  //obtener registro por id
  obtenerRegistroEstablecimientoPorId(idRegistro:string):Observable<RegistroEstablecimiento>{
    return this.http.get<RegistroEstablecimiento>(`${this.apiUrl}/${idRegistro}`);
  }

  //guardar registro

  guardarRegistro(registroEstablecimiento:RegistroEstablecimiento):Observable<RegistroEstablecimiento>{
    return this.http.post<RegistroEstablecimiento>(`${this.apiUrl}/`,registroEstablecimiento);
  }


  //asignar Categoria

  asignarCategoria(idRegistro:number, idCategoria:number):Observable<Categoria>{
    return this.http.post<Categoria>(`${this.apiUrl}/${idRegistro}/cateogoria/${idCategoria}`,null);
  }


  //asignar Mantenimiento

  asignarMantenimiento(idRegistro:number, idMantenimiento:number):Observable<Mantenimiento>{
    return this.http.post<Mantenimiento>(`${this.apiUrl}/${idRegistro}/mantenimiento/${idMantenimiento}`,null);
  }

  //eliminar registro establecimiento

  eliminarRegistro(id:string):Observable<RegistroEstablecimiento>{
    return this.http.delete<RegistroEstablecimiento>(`${this.apiUrl}/${id}`);
  }
}

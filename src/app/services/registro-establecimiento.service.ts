import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroEstablecimiento } from '../models/registroEstablecimiento';
import { Titular } from '../models/titular';
import { Empresa } from '../models/empresa';
import { Establecimiento } from '../models/establecimiento';
import { Mantenimiento } from '../models/mantenimiento';

@Injectable({
  providedIn: 'root'
})
export class RegistroEstablecimientoService {

  private apiUrl = environment.apiUrl + '/registro-producto';

  constructor(private http:HttpClient) { }

  //obtener registros establecimientos

  obtenerRegistrosEstablecimientos():Observable<RegistroEstablecimiento[]>{
    return this.http.get<RegistroEstablecimiento[]>(`${this.apiUrl}/`);
  }

  //obtener registro por id
  obtenerRegistroEstablecimientoPorId(idRegistro:number):Observable<RegistroEstablecimiento>{
    return this.http.get<RegistroEstablecimiento>(`${this.apiUrl}/${idRegistro}`);
  }

  //guardar registro

  guardarRegistro(registroEstablecimiento:RegistroEstablecimiento):Observable<RegistroEstablecimiento>{
    return this.http.post<RegistroEstablecimiento>(`${this.apiUrl}/`,registroEstablecimiento);
  }

  //asignar titular

  asignarTitular(idRegistro:number, cuitTitular:number):Observable<Titular>{
    return this.http.post<Titular>(`${this.apiUrl}/${idRegistro}/titular/${cuitTitular}`,null);
  }

  //asignar empresa

  asignarEmpresa(idRegistro:number, cuitEmpresa:number):Observable<Empresa>{
    return this.http.post<Empresa>(`${this.apiUrl}/${idRegistro}/empresa/${cuitEmpresa}`,null);
  }

  //asignar establecimiento

  asignarEstablecimiento(idRegistro:number, idEstablecimiento:number):Observable<Establecimiento>{
    return this.http.post<Establecimiento>(`${this.apiUrl}/${idRegistro}/establecimiento/${idEstablecimiento}`,null);
  }

  //asignar Mantenimiento

  asignarMantenimiento(idRegistro:number, idMantenimiento:number):Observable<Mantenimiento>{
    return this.http.post<Mantenimiento>(`${this.apiUrl}/${idRegistro}/mantenimiento/${idMantenimiento}`,null);
  }

  //eliminar registro establecimiento

  eliminarRegistro(id:number):Observable<RegistroEstablecimiento>{
    return this.http.delete<RegistroEstablecimiento>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mantenimiento } from '../models/mantenimiento';
import { Tramite } from '../models/tramite';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  private apiUrl = environment.apiUrl + '/mantenimiento';

  constructor(private http:HttpClient) { }


  //obtener mantenimientos

  obtenerMantenimientos(): Observable<Mantenimiento[]>{
    return this.http.get<Mantenimiento[]>(`${this.apiUrl}/`);
  }

  //obtener mantenimiento por id

  obtenerMantenimientoPorId(idMantenimiento:number): Observable<Mantenimiento>{
    return this.http.get<Mantenimiento>(`${this.apiUrl}/${idMantenimiento}`);
  }

  //obtener tramites por mantenimiento

  obtenerTramitesPorMantenimiento(id:number): Observable<Tramite[]>{
    return this.http.get<Tramite[]>(`${this.apiUrl}/${id}/tramites`);
  }

  //registrar mantenimiento

  registrarMantenimiento(mantenimiento:Mantenimiento):Observable<Mantenimiento>{
    return this.http.post<Mantenimiento>(`${this.apiUrl}`,mantenimiento);
  }

  //eliminar mantenimiento

  eliminarMantenimiento(idMantenimiento:number):Observable<Mantenimiento>{
    return this.http.delete<Mantenimiento>(`${this.apiUrl}/${idMantenimiento}`);
  }

  //agregar tramite

  agregarTramite(idMantenimiento:number,idTramite:number):Observable<Tramite>{
    return this.http.post<Tramite>(`${this.apiUrl}/${idMantenimiento}/tramite/${idTramite}`,null);
  }

  //eliminar tramite

  eliminarTramite(id:number):Observable<Mantenimiento>{
    return this.http.delete<Mantenimiento>(`${this.apiUrl}/${id}`);
  }
}

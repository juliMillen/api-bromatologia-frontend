import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Actividad } from '../models/actividad';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  private apiUrl = environment.apiUrl + '/actividad';
  constructor(private http:HttpClient) { }


  obtenerActividades(): Observable<Actividad[]>{
    return this.http.get<Actividad[]>(`${this.apiUrl}`);
  }


  obtenerActividadPorId(idActividad:number):Observable<Actividad>{
    return this.http.get<Actividad>(`${this.apiUrl}/${idActividad}`);
  }


  crearActividad(actividad:Actividad):Observable<Actividad>{
    return this.http.post<Actividad>(`${this.apiUrl}/`,actividad);
  }

  eliminarActividad(idActividad:number):Observable<Actividad>{
    return this.http.delete<Actividad>(`${this.apiUrl}/${idActividad}`)
  }
}

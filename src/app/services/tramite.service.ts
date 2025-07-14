import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tramite } from '../models/tramite';

@Injectable({
  providedIn: 'root'
})
export class TramiteService {

  private apiUrl = environment.apiUrl + '/tramite';

  constructor(private http:HttpClient) { }

  //obtener todos los tramites

  obtenerTramites():Observable<Tramite[]>{
    return this.http.get<Tramite[]>(`${this.apiUrl}/`);
  }

  //obtener tramite por id
  obtenerTramitePorId(idTramite: number):Observable<Tramite>{
    return this.http.get<Tramite>(`${this.apiUrl}/${idTramite}`);
  }

  //crear tramite

  crearTramite(tramite:Tramite):Observable<Tramite>{
    return this.http.post<Tramite>(`${this.apiUrl}/`,tramite);
  }

  //eliminar tramite

  eliminarTramite(idTramite:number):Observable<Tramite>{
    return this.http.delete<Tramite>(`${this.apiUrl}/${idTramite}`);
  }
}

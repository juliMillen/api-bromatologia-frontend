import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rubro } from '../models/rubro';

@Injectable({
  providedIn: 'root'
})
export class RubroService {
  private apiUrl = environment.apiUrl + '/rubro';
  constructor(private http:HttpClient) { }


  obtenerRubros(): Observable<Rubro[]>{
    return this.http.get<Rubro[]>(`${this.apiUrl}`);
  }


  obtenerRubroPorId(idRubro:number):Observable<Rubro>{
    return this.http.get<Rubro>(`${this.apiUrl}/${idRubro}`);
  }


  crearRubro(rubro:Rubro):Observable<Rubro>{
    return this.http.post<Rubro>(`${this.apiUrl}/`,rubro);
  }

  eliminarRubro(idRubro:number):Observable<Rubro>{
    return this.http.delete<Rubro>(`${this.apiUrl}/${idRubro}`)
  }
}

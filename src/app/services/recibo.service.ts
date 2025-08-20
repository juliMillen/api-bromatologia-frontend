import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recibo } from '../models/recibo';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReciboService {

  //private apiUrl = environment.apiUrl + '/recibo';
  private apiUrl = environment.apiUrl + '/recibo';

  constructor(private http:HttpClient) { }

  //obtener recibos

  obtenerRecibos():Observable<Recibo[]>{
    return this.http.get<Recibo[]>(`${this.apiUrl}/`);
  }

  //obtener recibo por id

  obtenerReciboPorId(id:number):Observable<Recibo>{
    return this.http.get<Recibo>(`${this.apiUrl}/${id}`);
  }

  //crear recibo

  crearRecibo(recibo:Recibo):Observable<Recibo>{
    return this.http.post<Recibo>(`${this.apiUrl}/`,recibo);
  }

  //eliminar recibo

  eliminarRecibo(id:number):Observable<Recibo>{
    return this.http.delete<Recibo>(`${this.apiUrl}/${id}`);
  }
}

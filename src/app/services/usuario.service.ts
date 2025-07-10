import { Injectable } from '@angular/core';
import { enviroment } from '../../environments/enviroment';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = enviroment.apiUrl + '/usuario'

  constructor(private http:HttpClient) { }

  crearUsuario(usuario:Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.apiUrl}/`,usuario);
  }

}

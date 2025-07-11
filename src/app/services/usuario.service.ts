import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = environment.apiUrl + '/usuario'

  constructor(private http:HttpClient) { }

  crearUsuario(usuario:Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.apiUrl}/`,usuario);
  }

}

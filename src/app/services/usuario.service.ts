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


  //obtener usuarios
  obtenerUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.apiUrl}/`);
  }

  //obtener usuario por id
  obtenerUsuarioPorId(idUsuario:number):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.apiUrl}/${idUsuario}`);
  }


  //crear usuario
  crearUsuario(usuario:Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.apiUrl}/`,usuario);
  }

  //eliminar usuario
  eliminarUsuario(idUsuario:number):Observable<Usuario>{
    return this.http.delete<Usuario>(`${this.apiUrl}/${idUsuario}`);
  }

  //actualizar usuario

  actualizarUsuario(idUsuario:number, usuario:Usuario):Observable<Usuario>{
    return this.http.patch<Usuario>(`${this.apiUrl}/${idUsuario}`,usuario);
  }

}

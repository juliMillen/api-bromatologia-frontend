import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/login';

  constructor(private http:HttpClient) { }

  login(usuario:Usuario): Observable<any>{
    return this.http.post<any>(this.apiUrl,usuario);
  }

  guardarToken(token: string){
    localStorage.setItem('token',token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  usuarioLogeado():boolean{
    return !!this.obtenerToken();
  }

  logout(){
    localStorage.removeItem('token');
  }

}

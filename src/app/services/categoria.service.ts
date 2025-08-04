import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = environment.apiUrl + '/categoria';
  constructor(private http:HttpClient) { }


  obtenerCategorias(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(`${this.apiUrl}`);
  }


  obtenerCategoriaPorId(idCategoria:number):Observable<Categoria>{
    return this.http.get<Categoria>(`${this.apiUrl}/${idCategoria}`);
  }

  obtenerCategoriaPorNombre(nombreCategoria:string):Observable<Categoria>{
    return this.http.get<Categoria>(`${this.apiUrl}/${nombreCategoria}`);
  }


  crearCategoria(categoria:Categoria):Observable<Categoria>{
    return this.http.post<Categoria>(`${this.apiUrl}/`,categoria);
  }

  eliminarCategoria(idCategoria:number):Observable<Categoria>{
    return this.http.delete<Categoria>(`${this.apiUrl}/${idCategoria}`)
  }
}

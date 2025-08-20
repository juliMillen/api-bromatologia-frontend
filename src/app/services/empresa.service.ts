import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  //private apiUrl = environment.apiUrl + '/empresa';
  private apiUrl = environment.apiUrl + '/empresa';

  constructor(private http:HttpClient) { }

  //obtener todas las empresas registradas

  getEmpresas(): Observable<Empresa[]>{
    return this.http.get<Empresa[]>(`${this.apiUrl}/`);
  }


  //obtener empresa por id/cuit

  obtenerEmpresa(cuit:number): Observable<Empresa>{
    return this.http.get<Empresa>(`${this.apiUrl}/${cuit}`);
  }

  //obtener empresa por razonSocial
  obtenerEmpresaPorRazonSocial(razonSocial:String): Observable<Empresa>{
    return this.http.get<Empresa>(`${this.apiUrl}/razonSocial/${razonSocial}`);
  }

  //obtener empresa por departamento

  obtenerEmpresaPorDepartamento(departamento:string): Observable<Empresa>{
    return this.http.get<Empresa>(`${this.apiUrl}/departamento/${departamento}`);
  }

  //Obtener empresa por sus 3 propiedades

  obtenerEmpresaPorPropiedades(cuit:number,razonSocial:string,departamento:string): Observable<Empresa>{
   return this.http.get<Empresa>(`${this.apiUrl}/propiedades/${cuit}/${razonSocial}/${departamento}`);
  }


  //Crear una nueva Empresa

  crearEmpresa(empresa:Empresa): Observable<Empresa>{
    return this.http.post<Empresa>(`${this.apiUrl}/`,empresa);
  }


  //Modficar empresa
  modificarEmpresa(cuit:number,empresa:Empresa):Observable<Empresa>{
    return this.http.patch<Empresa>(`${this.apiUrl}/${cuit}`,empresa);
  }

  //Eliminar una empresa
  eliminarUnaEmpresa(cuit:number): Observable<Empresa>{
    return this.http.delete<Empresa>(`${this.apiUrl}/${cuit}`);
  }
}

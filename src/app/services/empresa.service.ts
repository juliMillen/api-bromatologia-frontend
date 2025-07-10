import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa';
import { Establecimiento } from '../models/establecimiento';
import { enviroment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = enviroment.apiUrl + '/empresa';

  constructor(private http:HttpClient) { }

  //obtener todas las empresas registradas

  getEmpresas(): Observable<Empresa[]>{
    return this.http.get<Empresa[]>(`${this.apiUrl}/`);
  }


  //obtener empresa por id

  obtenerEmpresa(cuit:number): Observable<Empresa>{
    return this.http.get<Empresa>(`${this.apiUrl}/${cuit}`);
  }

  //Obtener establecimiento de una empresa
  obtenerEstablecimientos(cuit:number):Observable<Establecimiento[]>{
    return this.http.get<Establecimiento[]>(`${this.apiUrl}/${cuit}/establecimientos`);
  }

  //Crear una nueva Empresa

  crearEmpresa(empresa:Empresa): Observable<Empresa>{
    return this.http.post<Empresa>(`${this.apiUrl}/`,empresa);
  }

  //Agregar un establecimiento a una empresa
  agregarEstablecimientoAEmpresa(cuitEmpresa:number,idEstablecimiento:number):Observable<Establecimiento>{
    return this.http.post<Establecimiento>(`${this.apiUrl}/${cuitEmpresa}/establecimiento/${idEstablecimiento}`,null);
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Titular } from '../models/titular';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitularService {


  private apiUrl = environment.apiUrl + '/titular';

  constructor(private http: HttpClient) { }

  obtenerTitulares():Observable<Titular[]>{
    return this.http.get<Titular[]>(`${this.apiUrl}/`);
  }
}

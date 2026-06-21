import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Reporte } from '../models/reporte.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private url = `${environment.base}/api/reportes`;
  private listaCambio = new Subject<Reporte[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.url}/listar`);
  }
  listId(id: number): Observable<Reporte> {
    return this.http.get<Reporte>(`${this.url}/${id}`);
  }
  insert(r: Reporte): Observable<Reporte> {
    return this.http.post<Reporte>(`${this.url}/insertar`, r);
  }
  update(id: number, r: Reporte): Observable<Reporte> {
    return this.http.put<Reporte>(`${this.url}/${id}`, r);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  setList(lista: Reporte[]) {
    this.listaCambio.next(lista);
  }
  getList(): Observable<Reporte[]> {
    return this.listaCambio.asObservable();
  }
}

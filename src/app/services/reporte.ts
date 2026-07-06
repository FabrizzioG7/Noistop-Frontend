import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reporte, EstadoReporteCount } from '../models/reporte.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private url = `${environment.base}/api/reportes`;
  private listaCambio = new Subject<Reporte[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.url}/listar`);
  }
  historialPorUsuario(usuarioId: number): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(`${this.url}/historial/usuario/${usuarioId}`);
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
  getConteoPorEstado(): Observable<EstadoReporteCount[]> {
    return this.http.get<EstadoReporteCount[]>(`${this.url}/conteo-por-estado`);
  }
}

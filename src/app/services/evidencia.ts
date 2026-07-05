import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { EvidenciaReporte } from '../models/evidencia.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EvidenciaService {
  private url = `${environment.base}/api/evidencias`;
  private listaCambio = new Subject<EvidenciaReporte[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<EvidenciaReporte[]> {
    return this.http.get<EvidenciaReporte[]>(`${this.url}/listar`);
  }
  listByReporte(reporteId: number): Observable<EvidenciaReporte[]> {
    return this.http.get<EvidenciaReporte[]>(`${this.url}/reporte/${reporteId}`);
  }
  listByUsuario(usuarioId: number): Observable<EvidenciaReporte[]> {
    return this.http.get<EvidenciaReporte[]>(`${this.url}/usuario/${usuarioId}`);
  }

  /** Sube la imagen real (multipart/form-data) y la asocia al reporte. */
  upload(file: File, reporteId: number): Observable<EvidenciaReporte> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reporteId', String(reporteId));
    return this.http.post<EvidenciaReporte>(this.url, formData);
  }

  /**
   * Trae la imagen como blob (pasa por el interceptor, así que sí lleva el
   * token). Úsalo con URL.createObjectURL() para mostrarla en un <img>.
   */
  getArchivoBlob(id: number): Observable<Blob> {
    return this.http.get(`${this.url}/${id}/archivo`, { responseType: 'blob' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  setList(lista: EvidenciaReporte[]) {
    this.listaCambio.next(lista);
  }
  getList(): Observable<EvidenciaReporte[]> {
    return this.listaCambio.asObservable();
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { EvidenciaReporte } from "../models/evidencia.model";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class EvidenciaService {
  private url = `${environment.base}/api/evidencias`;
  private listaCambio = new Subject<EvidenciaReporte[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<EvidenciaReporte[]> {
    return this.http.get<EvidenciaReporte[]>(`${this.url}/listar`);
  }
  listByReporte(reporteId: number): Observable<EvidenciaReporte[]> {
    return this.http.get<EvidenciaReporte[]>(
      `${this.url}/reporte/${reporteId}`,
    );
  }
  insert(e: EvidenciaReporte): Observable<EvidenciaReporte> {
    return this.http.post<EvidenciaReporte>(this.url, e);
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

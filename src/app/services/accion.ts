import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AccionAdministrativa, AccionMensual } from '../models/accion.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccionService {
  private url = `${environment.base}/api/acciones`;
  private listaCambio = new Subject<AccionAdministrativa[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<AccionAdministrativa[]> {
    return this.http.get<AccionAdministrativa[]>(`${this.url}/listar`);
  }
  listId(id: number): Observable<AccionAdministrativa> {
    return this.http.get<AccionAdministrativa>(`${this.url}/${id}`);
  }
  insert(a: AccionAdministrativa): Observable<AccionAdministrativa> {
    return this.http.post<AccionAdministrativa>(`${this.url}/insertar`, a);
  }
  update(id: number, a: AccionAdministrativa): Observable<AccionAdministrativa> {
    return this.http.put<AccionAdministrativa>(`${this.url}/${id}`, a);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  setList(lista: AccionAdministrativa[]) {
    this.listaCambio.next(lista);
  }
  getList(): Observable<AccionAdministrativa[]> {
    return this.listaCambio.asObservable();
  }
  getComparativaMensual() {
    return this.http.get<AccionMensual[]>(`${this.url}/estadisticas/mensual`);
  }
}

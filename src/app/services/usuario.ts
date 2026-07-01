import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Usuario, UsuarioRanking } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private url = `${environment.base}/api/usuarios`;
  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/listar`);
  }
  listId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }
  insert(u: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/insertar`, u);
  }
  update(id: number, u: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, u);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  getTopReportadores(): Observable<UsuarioRanking[]> {
    return this.http.get<UsuarioRanking[]>(`${this.url}/top-reportadores`);
  }
  setList(lista: Usuario[]) {
    this.listaCambio.next(lista);
  }
  getList(): Observable<Usuario[]> {
    return this.listaCambio.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Rol } from '../models/rol.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolService {
  private url = `${environment.base}/api/roles`;
  private listaCambio = new Subject<Rol[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}/listar`);
  }
  listPublico(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}/publico`);
  }
  listId(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }
  insert(r: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.url}/insertar`, r);
  }
  update(id: number, r: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.url}/${id}`, r);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  setList(lista: Rol[]) {
    this.listaCambio.next(lista);
  }
  getList(): Observable<Rol[]> {
    return this.listaCambio.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private url = `${environment.base}/api/categorias`;
  private listaCambio = new Subject<Categoria[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.url}/listar`);
  }
  listId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.url}/${id}`);
  }
  insert(c: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.url}/insertar`, c);
  }
  update(id: number, c: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.url}/${id}`, c);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  setList(lista: Categoria[]) {
    this.listaCambio.next(lista);
  }
  getList(): Observable<Categoria[]> {
    return this.listaCambio.asObservable();
  }
}

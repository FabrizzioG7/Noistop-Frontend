import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Medicion } from '../models/medicion.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicionService {
  private url = `${environment.base}/api/mediciones`;
  private listaCambio = new Subject<Medicion[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Medicion[]> {
    return this.http.get<Medicion[]>(this.url);
  }
  listId(id: number): Observable<Medicion> {
    return this.http.get<Medicion>(`${this.url}/${id}`);
  }
  insert(m: Medicion): Observable<Medicion> {
    return this.http.post<Medicion>(this.url, m);
  }
  update(id: number, m: Medicion): Observable<Medicion> {
    return this.http.put<Medicion>(`${this.url}/${id}`, m);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  setList(lista: Medicion[]) {
    this.listaCambio.next(lista);
  }
  getList(): Observable<Medicion[]> {
    return this.listaCambio.asObservable();
  }
}

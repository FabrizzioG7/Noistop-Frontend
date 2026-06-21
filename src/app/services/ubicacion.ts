import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { Ubicacion } from "../models/ubicacion.model";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class UbicacionService {
  private url = `${environment.base}/api/ubicaciones`;
  private listaCambio = new Subject<Ubicacion[]>();

  constructor(private http: HttpClient) {}

  list(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.url);
  }
  listId(id: number): Observable<Ubicacion> {
    return this.http.get<Ubicacion>(`${this.url}/${id}`);
  }
  insert(u: Ubicacion): Observable<Ubicacion> {
    return this.http.post<Ubicacion>(this.url, u);
  }
  update(id: number, u: Ubicacion): Observable<Ubicacion> {
    return this.http.put<Ubicacion>(`${this.url}/${id}`, u);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
  setList(lista: Ubicacion[]) {
    this.listaCambio.next(lista);
  }
  getList(): Observable<Ubicacion[]> {
    return this.listaCambio.asObservable();
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  identificador: string; // nombre de usuario o email
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  pkUsuarioId: number;
  nombre: string;
  email: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.base}/login`;

  // Signals para que el menú reaccione al usuario logueado
  usuario = signal<string | null>(localStorage.getItem('usuario_nombre'));
  rol = signal<string | null>(localStorage.getItem('usuario_rol'));

  constructor(private http: HttpClient) {}

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, req).pipe(
      tap((resp) => {
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario_id', String(resp.pkUsuarioId));
        localStorage.setItem('usuario_nombre', resp.nombre);
        localStorage.setItem('usuario_email', resp.email);
        localStorage.setItem('usuario_rol', resp.rol);
        this.usuario.set(resp.nombre);
        this.rol.set(resp.rol);
      }),
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuarioNombre(): string | null {
    return localStorage.getItem('usuario_nombre');
  }

  getUsuarioId(): number | null {
    const id = localStorage.getItem('usuario_id');
    return id ? Number(id) : null;
  }

  getUsuarioEmail(): string | null {
    return localStorage.getItem('usuario_email');
  }

  getRol(): string | null {
    return localStorage.getItem('usuario_rol');
  }

  /** true si el rol del usuario logueado está dentro de la lista dada. */
  tieneRol(...roles: string[]): boolean {
    const rolActual = this.getRol();
    return !!rolActual && roles.includes(rolActual);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuario_nombre');
    localStorage.removeItem('usuario_email');
    localStorage.removeItem('usuario_rol');
    this.usuario.set(null);
    this.rol.set(null);
  }
}

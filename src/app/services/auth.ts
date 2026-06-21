import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.base}/login`;

  constructor(private http: HttpClient) {}
  
  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, req);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  logout() {
    localStorage.removeItem('token');
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

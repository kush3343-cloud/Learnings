import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  register(name: string, email: string, password: string) {
    return this.http.post<any>(`${this.api}/auth/register`, { name, email, password })
      .pipe(tap(res => this.saveSession(res)));
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.api}/auth/login`, { email, password })
      .pipe(tap(res => this.saveSession(res)));
  }

  private saveSession(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify({ name: res.name, email: res.email, role: res.role }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.getToken(); }
  getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
}

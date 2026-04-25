import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getUsers() {
    return this.http.get<any[]>(`${this.api}/users`, { headers: this.headers() });
  }

  addUser(name: string, email: string) {
    return this.http.post<any>(`${this.api}/users`, { name, email }, { headers: this.headers() });
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.api}/users/${id}`, { headers: this.headers() });
  }

  updateRole(id: string, role: string) {
    return this.http.patch<any>(`${this.api}/users/${id}/role`, { role }, { headers: this.headers() });
  }

  updateProfile(name: string, password: string) {
    return this.http.put<any>(`${this.api}/users/profile`, { name, password }, { headers: this.headers() });
  }
}

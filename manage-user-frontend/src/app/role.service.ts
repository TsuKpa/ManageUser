import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from "./role";


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'https://localhost:3000/userfunction';
  private token: string;

  constructor(private http: HttpClient) { }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  getRole(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`,{ headers: { Authorization: `Bearer ${this.getToken()}` }});
  }

  getRolesList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}`,{ headers: { Authorization: `Bearer ${this.getToken()}` }});
  }
}

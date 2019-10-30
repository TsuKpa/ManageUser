import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string;
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`,{ headers: { Authorization: `Bearer ${this.getToken()}` }});
  }

  createUser(user: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, user,{ headers: { Authorization: `Bearer ${this.getToken()}` }});
  }

  updateUser(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value,{ headers: { Authorization: `Bearer ${this.getToken()}` }});
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`,{ headers: { Authorization: `Bearer ${this.getToken()}`, responseType: 'text' }});
  }

  getUsersList(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}` ,{ headers: { Authorization: `Bearer ${this.getToken()}` }});
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Functions} from "./functions";

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  private baseUrl = 'http://localhost:3000/functions';
  private token: string;

  constructor(private http: HttpClient) {
  }
  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  getFunction(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`,{ headers: { Authorization: `Bearer ${this.getToken()}` }});
  }

  getFunctionsList(): Observable<Functions[]> {
    return this.http.get<Functions[]>(`${this.baseUrl}`,{ headers: { Authorization: `Bearer ${this.getToken()}` }});
  }
}

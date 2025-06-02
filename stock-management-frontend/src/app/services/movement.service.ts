import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private apiUrl = 'http://localhost:3000/api/movements';

  constructor(private http: HttpClient) {}

  getMovements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addMovement(movement: any): Observable<any> {
    return this.http.post(this.apiUrl, movement);
  }

  updateMovement(id: string, movement: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, movement);
  }

  deleteMovement(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

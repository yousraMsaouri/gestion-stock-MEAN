import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockService {
  private apiUrl = 'http://localhost:3000/api/stocks';

  constructor(private http: HttpClient) {}

  getStocks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addStock(stock: any): Observable<any> {
    return this.http.post(this.apiUrl, stock);
  }

  updateStock(id: string, stock: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, stock);
  }

  deleteStock(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

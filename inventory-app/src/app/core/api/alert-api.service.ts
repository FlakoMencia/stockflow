import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockAlert } from '../models/stock-alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1';

  getAlerts(): Observable<StockAlert[]> {
    return this.http.get<StockAlert[]>(`${this.baseUrl}/alerts`);
  }
}

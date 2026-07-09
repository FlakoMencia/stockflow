import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movement } from '../models/movement.model';
import { MovementRequest } from '../models/movement-request.model';

@Injectable({
  providedIn: 'root'
})
export class MovementApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1';

  registerMovement(request: MovementRequest): Observable<Movement> {
    return this.http.post<Movement>(`${this.baseUrl}/movements`, request);
  }

  getMovementHistory(productId: number, page = 0, size = 10): Observable<Movement[]> {
    const params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<Movement[]>(`${this.baseUrl}/movements/${productId}/history`, { params });
  }
}

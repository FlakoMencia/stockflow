import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/page-response.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1';

  getProducts(page: number, size: number, category?: string): Observable<PageResponse<Product>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<PageResponse<Product>>(`${this.baseUrl}/products`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }
}

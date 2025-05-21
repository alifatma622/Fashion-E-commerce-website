import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../shared/Models/Category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
   baseUrl = 'http://localhost:5149/api/';
  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(this.baseUrl + 'Product/getAll');
  }
  getProduct(id: number) {
    return this.http.get(this.baseUrl + 'Product/getAll/' + id);
  }

   getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.baseUrl + 'Category/getAll');
  }
}

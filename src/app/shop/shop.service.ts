import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../shared/Models/Category';
import { Observable } from 'rxjs';
import { Ipagination } from '../shared/Models/Pagination';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
   baseUrl = 'http://localhost:5149/api/';
  constructor(private http: HttpClient) { }

  // getProducts() {
  //   return this.http.get(this.baseUrl + 'Product/getAll');
  // }
  getProduct(id: number) {
    return this.http.get(this.baseUrl + 'Product/getAll/' + id);
  }
  
    getProducts(filterParms: any): Observable<Ipagination> {
    let params = new HttpParams();
    if (filterParms.CategoryId) params = params.set('CategoryId', filterParms.CategoryId);
    if (filterParms.Color) params = params.set('Color', filterParms.Color);
    if (filterParms.MinPrice) params = params.set('MinPrice', filterParms.MinPrice);
    if (filterParms.MaxPrice) params = params.set('MaxPrice', filterParms.MaxPrice);
    return this.http.get<Ipagination>(this.baseUrl + 'Product/getAll', { params });
  }

   getCategories(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.baseUrl + 'Category/getAll');
  }
}

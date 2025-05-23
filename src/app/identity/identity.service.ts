import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { RegisterDTO } from '../shared/Models/RegisterDTO'; // Import the RegisterDTO type

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  baseURL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  register(form: RegisterDTO) { // Use the RegisterDTO type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.baseURL + "Account/Register", form, { headers: headers });
  }
}


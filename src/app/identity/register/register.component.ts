import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone:false
})
export class RegisterComponent {
  registerModel = {
    userName: '',
    email: '',
    displayName: '',
    password: ''
  };
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:5149/api/Account/Register', this.registerModel)
      .subscribe({
        next: (response) => {
          
          // this.router.navigate(['/login']); // Redirect to login page
          console.log('Registration successful', response);
        },
        error: (error) => {

          this.errorMessage = error.error.message || 'Registration failed';
        }
      });
  }
}

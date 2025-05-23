import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
  ,standalone:false
})
export class LoginComponent {
  loginModel = {
    email: '',
    password: ''
  };
  errorMessage: string | null = null;
  accountExists: boolean = false; // Add this line

  constructor(private http: HttpClient, private router: Router, private toast: ToastrService) {}

  onSubmit() {
    this.http.post('http://localhost:5149/api/account/login', this.loginModel)
      .subscribe({
        next: (response) => {
          // Handle successful login
          this.toast.success("Login successful", 'Success');
          this.router.navigate(['/']); // Redirect to home or dashboard
        },
        error: (error) => {
          // Handle error
          this.errorMessage = error.error.message || 'Login failed';
          this.toast.error(this.errorMessage ?? 'Login failed', 'Error');
          this.accountExists = true; // Set to true if login fails
        }
      });
  }
}

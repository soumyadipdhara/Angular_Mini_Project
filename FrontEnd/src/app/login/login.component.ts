import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name: string = "";
  password: string = "";

  constructor(private http: HttpClient, private router: Router) {}

  signIn() {
    let userType: string;
if (this.name.toLowerCase() === 'admin') {
  userType = 'Admin';
} else {
  userType = 'User';
}

const user = {
  Name: this.name,
  Password: this.password,
  Type: userType
};

    this.http.post<any>("https://localhost:7143/api/Users/authenticate", user).subscribe({
      next: (data) => {
        console.log("Login successful:",data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        if (userType == "Admin") {
          this.router.navigate(["admin"]);
        } else {
          this.router.navigate(["user"]);
        }
      },
      error: (error) => {
        console.error("Login failed:", error);
      }
    });
  }
}
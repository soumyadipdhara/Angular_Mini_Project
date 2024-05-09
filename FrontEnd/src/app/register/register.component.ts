import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  Register: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.Register = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      email:['',[Validators.required,Validators.email]],
      phoneNo: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.Register.valid) {
      const userData = this.Register.value;
      userData.type='User';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post<any>('https://localhost:7143/api/Users', userData, httpOptions).subscribe(
        (response) => {
          console.log('User data saved successfully:', response);
          const navigationExtras: NavigationExtras = {
            state: {
              data: userData
            }
          };
          this.router.navigate(['login'], navigationExtras);
        },
        (error) => {
          console.error('Error saving user data:', error);
          // Handle error, show error message to the user
        }
      );
    }
  }

}

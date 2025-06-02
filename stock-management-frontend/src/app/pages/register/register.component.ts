import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    const data = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:3000/api/register', data).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Vous pouvez vous connecter.';
        this.errorMessage = '';
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l’inscription';
        this.successMessage = '';
      }
    });
  }
}

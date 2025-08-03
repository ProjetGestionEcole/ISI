import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    MessageModule
  ],
  templateUrl: './register.html'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  validationErrors: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    // Reset messages and validation errors
    this.errorMessage = '';
    this.successMessage = '';
    this.validationErrors = {};

    // Basic client-side validation
    if (!this.name || !this.email || !this.password || !this.password_confirmation) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    if (this.password !== this.password_confirmation) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères.';
      return;
    }

    this.isLoading = true;

    const registerData = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Inscription réussie! Redirection vers le tableau de bord...';
        
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.status === 422 && error.error.errors) {
          // Handle validation errors from Laravel
          this.validationErrors = error.error.errors;
          this.errorMessage = 'Veuillez corriger les erreurs ci-dessous.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
        }
      }
    });
  }

  // Helper method to get validation error for a field
  getFieldError(fieldName: string): string {
    return this.validationErrors[fieldName] ? this.validationErrors[fieldName][0] : '';
  }

  // Helper method to check if field has error
  hasFieldError(fieldName: string): boolean {
    return this.validationErrors[fieldName] && this.validationErrors[fieldName].length > 0;
  }
}

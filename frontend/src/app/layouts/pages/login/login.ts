import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppFloatingConfigurator } from '../../../layouts/components/app.floatingconfigurator';
import { AuthService, LoginCredentials } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule, 
    CheckboxModule, 
    InputTextModule, 
    PasswordModule, 
    FormsModule, 
    RouterModule, 
    RippleModule, 
    MessageModule,
    ProgressSpinnerModule,
    AppFloatingConfigurator
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
    email: string = '';
    password: string = '';
    checked: boolean = false;
    
    // États de l'interface
    isLoading: boolean = false;
    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        // Rediriger si déjà connecté
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/app']);
        }
    }

    /**
     * Gérer la soumission du formulaire de connexion
     */
    onLogin(): void {
        // Réinitialiser les messages
        this.errorMessage = '';
        this.successMessage = '';
        
        // Validation basique
        if (!this.email || !this.password) {
            this.errorMessage = 'Veuillez remplir tous les champs';
            return;
        }

        if (!this.isValidEmail(this.email)) {
            this.errorMessage = 'Veuillez entrer une adresse email valide';
            return;
        }

        // Préparer les données de connexion
        const credentials: LoginCredentials = {
            email: this.email,
            password: this.password
        };

        // Démarrer le loading
        this.isLoading = true;

        // Appeler le service d'authentification
        this.authService.login(credentials).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.successMessage = 'Connexion réussie ! Redirection...';
                
                // Rediriger vers le app après un court délai
                setTimeout(() => {
                    this.router.navigate(['/app']);
                }, 1000);
            },
            error: (error) => {
                this.isLoading = false;
                console.error('Erreur de connexion:', error);
                
                // Gérer les différents types d'erreurs
                if (error.status === 422) {
                    // Erreurs de validation
                    if (error.error.errors) {
                        const firstError = Object.values(error.error.errors)[0] as string[];
                        this.errorMessage = firstError[0];
                    } else {
                        this.errorMessage = 'Données de connexion invalides';
                    }
                } else if (error.status === 401) {
                    this.errorMessage = 'Email ou mot de passe incorrect';
                } else if (error.status === 0) {
                    this.errorMessage = 'Impossible de se connecter au serveur';
                } else {
                    this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
                }
            }
        });
    }

    /**
     * Validation simple de l'email
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Naviguer vers la page d'inscription
     */
    goToRegister(): void {
        this.router.navigate(['/register']);
    }

    /**
     * Naviguer vers la page de mot de passe oublié
     */
    goToForgotPassword(): void {
        this.router.navigate(['/forgot-password']);
    }
}

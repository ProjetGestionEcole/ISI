import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/v1';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.tokenSubject.asObservable().pipe(
    map((token: string | null) => !!token)
  );

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Vérifier si un token existe dans le localStorage au démarrage
    this.loadStoredAuth();
  }

  /**
   * Connexion utilisateur
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  /**
   * Inscription utilisateur
   */
  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userData)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  /**
   * Déconnexion
   */
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuthData();
          this.router.navigate(['/login']);
        })
      );
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user`);
  }

  /**
   * Mot de passe oublié
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  /**
   * Réinitialiser le mot de passe
   */
  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtenir le token actuel
   */
  getToken(): string | null {
    return this.tokenSubject.value || localStorage.getItem('auth_token');
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Sauvegarder les données d'authentification
   */
  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('auth_token', authResponse.access_token);
    localStorage.setItem('current_user', JSON.stringify(authResponse.user));
    
    this.tokenSubject.next(authResponse.access_token);
    this.currentUserSubject.next(authResponse.user);
  }

  /**
   * Supprimer les données d'authentification
   */
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  /**
   * Charger les données d'authentification stockées
   */
  private loadStoredAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'authentification:', error);
        this.clearAuthData();
      }
    }
  }
}

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Etudiant' | 'Prof' | 'Parent';
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
  private baseUrl = `${environment.apiURL}/v1`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.tokenSubject.asObservable().pipe(
    map((token: string | null) => !!token)
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
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
    if (isPlatformBrowser(this.platformId)) {
      return this.tokenSubject.value || sessionStorage.getItem('auth_token');
    }
    return this.tokenSubject.value;
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtenir le rôle de l'utilisateur actuel
   */
  getCurrentUserRole(): string | null {
    const user = this.getCurrentUserValue();
    return user ? user.role : null;
  }

  /**
   * Vérifier si l'utilisateur actuel est un admin
   */
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'Admin';
  }

  /**
   * Vérifier si l'utilisateur actuel est un étudiant
   */
  isEtudiant(): boolean {
    return this.getCurrentUserRole() === 'Etudiant';
  }

  /**
   * Vérifier si l'utilisateur actuel est un professeur
   */
  isProf(): boolean {
    return this.getCurrentUserRole() === 'Prof';
  }

  /**
   * Vérifier si l'utilisateur actuel est un parent
   */
  isParent(): boolean {
    return this.getCurrentUserRole() === 'Parent';
  }

  /**
   * Sauvegarder les données d'authentification
   */
  private setAuthData(authResponse: AuthResponse): void {
    console.log('Setting auth data:', authResponse);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('auth_token', authResponse.access_token);
      sessionStorage.setItem('current_user', JSON.stringify(authResponse.user));
      console.log('Token stored in sessionStorage:', authResponse.access_token);
      console.log('User stored in sessionStorage:', authResponse.user);
    }
    
    this.tokenSubject.next(authResponse.access_token);
    this.currentUserSubject.next(authResponse.user);
  }

  /**
   * Supprimer les données d'authentification
   */
  private clearAuthData(): void {
    console.log('Clearing auth data');
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('current_user');
      console.log('Auth data cleared from sessionStorage');
    }
    
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  /**
   * Force logout and clear all session data
   */
  forceLogout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  /**
   * Charger les données d'authentification stockées
   */
  private loadStoredAuth(): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Server side rendering, skipping sessionStorage access');
      return; // Skip localStorage access on server side
    }
    
    const token = sessionStorage.getItem('auth_token');
    const userStr = sessionStorage.getItem('current_user');
    
    console.log('Loading stored auth - token:', token);
    console.log('Loading stored auth - userStr:', userStr);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('Loaded user from sessionStorage:', user);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'authentification:', error);
        this.clearAuthData();
      }
    } else {
      console.log('No stored auth data found');
    }
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'http://localhost:8000/api/v1';

  constructor() {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  // Get all students
  getAllEtudiants(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/etudiants`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Get all professors
  getAllProfs(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/profs`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Get all admins
  getAllAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admins`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Get all parents
  getAllParents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/parents`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Get user by ID
  getUser(id: number | undefined): Observable<User> {
    if (!id) {
      return throwError(() => new Error('User ID is required'));
    }
    return this.http.get<User>(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Create new user
  store(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Update user
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${user.id}`, user, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Delete user
  destroy(id: number | undefined): Observable<any> {
    if (!id) {
      return throwError(() => new Error('User ID is required'));
    }
    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Create student
  createEtudiant(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/etudiants`, { ...user, role: 'Etudiant' }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Create professor
  createProf(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/profs`, { ...user, role: 'Prof' }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Create admin
  createAdmin(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/admins`, { ...user, role: 'Admin' }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Create parent
  createParent(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/parents`, { ...user, role: 'Parent' }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleFilteredService {
  private baseUrl = `${environment.apiURL}/v1/my`;

  constructor(private http: HttpClient) {}

  // Get user's role-filtered notes
  getMyNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notes`);
  }

  // Get user's role-filtered absences
  getMyAbsences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/absences`);
  }

  // Get user's role-filtered enseignements (for professors)
  getMyEnseignements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/enseignements`);
  }

  // Get user's role-filtered matieres
  getMyMatieres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/matieres`);
  }

  // Get user's role-filtered inscriptions (for students)
  getMyInscriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inscriptions`);
  }

  // Get user's children (for parents)
  getMyChildren(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/children`);
  }

  // Get dashboard statistics
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard-stats`);
  }
}

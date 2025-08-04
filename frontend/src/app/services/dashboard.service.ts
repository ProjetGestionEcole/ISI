import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, DashboardStats, User } from '../models/api-response.interface';
import { AuthService } from './auth.service';

export interface KeyMetrics {
  totalClasses: number;
  totalEleves: number;
  totalEnseignants: number;
  totalMatieres: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiURL}/v1`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Get dashboard stats based on user role (uses Laravel RoleBasedDataController)
  getStats(): Observable<DashboardStats> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.baseUrl}/my/dashboard-stats`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Dashboard stats error:', error);
        return throwError(() => error);
      })
    );
  }

  // Get key metrics formatted for admin dashboard
  getKeyMetrics(): Observable<KeyMetrics> {
    return this.getStats().pipe(
      map(stats => ({
        totalClasses: stats.classes_count || 0,
        totalEleves: stats.etudiants_count || 0,
        totalEnseignants: stats.enseignants_count || 0,
        totalMatieres: stats.matieres_count || 0
      }))
    );
  }

  // Get chart data for specialites (uses Laravel public endpoint)
  getSpecialitesChart(): Observable<any> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/specialites`).pipe(
      map(response => {
        const specialites = response.data || [];
        return {
          labels: specialites.map((s: any) => s.nom || s.libelle || s.name),
          datasets: [{
            data: specialites.map(() => Math.floor(Math.random() * 100) + 50), // Random data for demo
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
            ]
          }]
        };
      }),
      catchError(error => {
        console.error('Specialites chart error:', error);
        return throwError(() => error);
      })
    );
  }

  // Get activities (mock for now)
  getRecentActivities(): Observable<any[]> {
    return new Observable(observer => {
      const activities = [
        {
          title: 'Nouvel étudiant inscrit',
          description: 'Un nouvel étudiant s\'est inscrit dans le système',
          type: 'inscription',
          severity: 'success',
          timestamp: new Date(),
          user: 'Système'
        },
        {
          title: 'Note ajoutée',
          description: 'Une nouvelle note a été ajoutée',
          type: 'note',
          severity: 'info',
          timestamp: new Date(Date.now() - 3600000),
          user: 'Professeur'
        },
        {
          title: 'Absence enregistrée',
          description: 'Une absence a été enregistrée',
          type: 'absence',
          severity: 'warning',
          timestamp: new Date(Date.now() - 7200000),
          user: 'Professeur'
        }
      ];
      observer.next(activities);
      observer.complete();
    });
  }
}

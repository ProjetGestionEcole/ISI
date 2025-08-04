import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface DashboardStats {
  // Professor stats
  enseignements_count?: number;
  matieres_count?: number;
  notes_added?: number;
  absences_recorded?: number;
  students_count?: number;
  
  // Student stats
  notes_count?: number;
  absences_count?: number;
  inscriptions_count?: number;
  average_grade?: number;
  current_class?: string;
  
  // Parent stats
  children_count?: number;
  children_notes?: number;
  children_absences?: number;
  children_average_grade?: number;
  
  // Admin stats
  classes_count?: number;
  etudiants_count?: number;
  enseignants_count?: number;
  parents_count?: number;
  admins_count?: number;
  specialites_count?: number;
  niveaux_count?: number;
  semestres_count?: number;
  ues_count?: number;
  total_users?: number;
  total_notes?: number;
  total_absences?: number;
  total_inscriptions?: number;
  mentions_count?: number;
  annees_scolaires_count?: number;
}

export interface Child {
  id: number;
  name: string;
  email: string;
  relation: string;
  profession?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleBasedDataService {
  private baseApiUrl = `${environment.apiURL}/v1`;
  
  // Reactive data streams
  private dashboardStatsSubject = new BehaviorSubject<DashboardStats | null>(null);
  public dashboardStats$ = this.dashboardStatsSubject.asObservable();
  
  private myDataSubject = new BehaviorSubject<any>(null);
  public myData$ = this.myDataSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get role-specific API URL based on user role
   */
  private getRoleApiUrl(): string {
    const user = this.authService.getCurrentUserValue();
    const userRole = user?.role;
    
    console.log('RoleBasedDataService.getRoleApiUrl() - User:', user, 'Role:', userRole);
    
    switch (userRole) {
      case 'Prof':
        return `${this.baseApiUrl}/profs/my`;
      case 'Etudiant':
        return `${this.baseApiUrl}/etudiants/my`;
      case 'Parent':
        return `${this.baseApiUrl}/parents/my`;
      case 'Admin':
        return `${this.baseApiUrl}/admins/my`;
      default:
        console.warn('RoleBasedDataService: Unknown user role, falling back to admin:', userRole);
        return `${this.baseApiUrl}/admins/my`; // Fallback to admin
    }
  }

  /**
   * Get user's enseignements based on their role (Professor only)
   */
  getMyEnseignements(): Observable<any> {
    if (!this.authService.isProf()) {
      return of({ success: false, message: 'Accès non autorisé', data: [] });
    }
    return this.http.get(`${this.getRoleApiUrl()}/enseignements`);
  }

  /**
   * Get user's matieres based on their role (Professor only)
   */
  getMyMatieres(): Observable<any> {
    if (!this.authService.isProf()) {
      return of({ success: false, message: 'Accès non autorisé', data: [] });
    }
    return this.http.get(`${this.getRoleApiUrl()}/matieres`);
  }

  /**
   * Get user's notes based on their role
   */
  getMyNotes(): Observable<any> {
    const userRole = this.authService.getCurrentUserRole();
    if (userRole === 'Prof' || userRole === 'Etudiant') {
      return this.http.get(`${this.getRoleApiUrl()}/notes`);
    }
    return of({ success: false, message: 'Accès non autorisé', data: [] });
  }

  /**
   * Get user's absences based on their role
   */
  getMyAbsences(): Observable<any> {
    const userRole = this.authService.getCurrentUserRole();
    if (userRole === 'Prof' || userRole === 'Etudiant') {
      return this.http.get(`${this.getRoleApiUrl()}/absences`);
    }
    return of({ success: false, message: 'Accès non autorisé', data: [] });
  }

  /**
   * Get user's inscriptions based on their role (Student only)
   */
  getMyInscriptions(): Observable<any> {
    if (!this.authService.isEtudiant()) {
      return of({ success: false, message: 'Accès non autorisé', data: [] });
    }
    return this.http.get(`${this.getRoleApiUrl()}/inscriptions`);
  }

  /**
   * Get user's children (for parents only)
   */
  getMyChildren(): Observable<Child[]> {
    if (!this.authService.isParent()) {
      return of([]);
    }
    return this.http.get<Child[]>(`${this.getRoleApiUrl()}/children`);
  }

  /**
   * Get user's children notes (for parents only)
   */
  getMyChildrenNotes(): Observable<any> {
    if (!this.authService.isParent()) {
      return of({ success: false, message: 'Accès non autorisé', data: [] });
    }
    return this.http.get(`${this.getRoleApiUrl()}/children-notes`);
  }

  /**
   * Get user's children absences (for parents only)
   */
  getMyChildrenAbsences(): Observable<any> {
    if (!this.authService.isParent()) {
      return of({ success: false, message: 'Accès non autorisé', data: [] });
    }
    return this.http.get(`${this.getRoleApiUrl()}/children-absences`);
  }

  /**
   * Get dashboard statistics based on user role
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.getRoleApiUrl()}/dashboard-stats`);
  }

  /**
   * Load and cache dashboard stats
   */
  loadDashboardStats(): void {
    this.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStatsSubject.next(stats);
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.dashboardStatsSubject.next(null);
      }
    });
  }

  /**
   * Get cached dashboard stats
   */
  getCachedDashboardStats(): DashboardStats | null {
    return this.dashboardStatsSubject.value;
  }

  /**
   * Load all user's relevant data based on their role
   */
  loadMyData(): void {
    const userRole = this.authService.getCurrentUserRole();
    const dataPromises: Promise<any>[] = [];
    
    // Load data based on user role
    switch (userRole) {
      case 'Prof':
        dataPromises.push(
          this.getMyEnseignements().toPromise(),
          this.getMyMatieres().toPromise(),
          this.getMyNotes().toPromise(),
          this.getMyAbsences().toPromise()
        );
        break;
        
      case 'Etudiant':
        dataPromises.push(
          this.getMyNotes().toPromise(),
          this.getMyAbsences().toPromise(),
          this.getMyInscriptions().toPromise()
        );
        break;
        
      case 'Parent':
        dataPromises.push(
          this.getMyChildren().toPromise(),
          this.getMyChildrenNotes().toPromise(),
          this.getMyChildrenAbsences().toPromise()
        );
        break;
        
      case 'Admin':
        // Admin doesn't need specific data loading, just dashboard stats
        dataPromises.push(Promise.resolve({ success: true, data: [] }));
        break;
        
      default:
        dataPromises.push(Promise.resolve({ success: false, data: [] }));
    }

    Promise.allSettled(dataPromises).then((results) => {
      let myData: any = {};
      
      switch (userRole) {
        case 'Prof':
          myData = {
            enseignements: results[0]?.status === 'fulfilled' ? results[0].value : [],
            matieres: results[1]?.status === 'fulfilled' ? results[1].value : [],
            notes: results[2]?.status === 'fulfilled' ? results[2].value : [],
            absences: results[3]?.status === 'fulfilled' ? results[3].value : [],
          };
          break;
          
        case 'Etudiant':
          myData = {
            notes: results[0]?.status === 'fulfilled' ? results[0].value : [],
            absences: results[1]?.status === 'fulfilled' ? results[1].value : [],
            inscriptions: results[2]?.status === 'fulfilled' ? results[2].value : [],
          };
          break;
          
        case 'Parent':
          myData = {
            children: results[0]?.status === 'fulfilled' ? results[0].value : [],
            children_notes: results[1]?.status === 'fulfilled' ? results[1].value : [],
            children_absences: results[2]?.status === 'fulfilled' ? results[2].value : [],
          };
          break;
          
        default:
          myData = { data: [] };
      }
      
      this.myDataSubject.next(myData);
    });
  }

  /**
   * Get cached user data
   */
  getCachedMyData(): any {
    return this.myDataSubject.value;
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    this.dashboardStatsSubject.next(null);
    this.myDataSubject.next(null);
  }
}

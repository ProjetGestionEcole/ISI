import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Absence } from '../models/absence';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService extends BaseService<Absence> {
  protected resourceName = 'absences';
  protected primaryKey = 'id';

  constructor(httpclient: HttpClient, private authService: AuthService) {
    super(httpclient);
    this.initializeUrl();
  }

  // Override getAll to use role-specific endpoint
  override getAll(): Observable<Absence[]> {
    const userRole = this.authService.getCurrentUserRole();
    let endpoint = '';
    
    switch (userRole) {
      case 'Prof':
        endpoint = `${environment.apiURL}/v1/profs/my/absences`;
        break;
      case 'Etudiant':
        endpoint = `${environment.apiURL}/v1/etudiants/my/absences`;
        break;
      case 'Parent':
        endpoint = `${environment.apiURL}/v1/parents/my/children-absences`;
        break;
      case 'Admin':
        endpoint = `${environment.apiURL}/v1/absences`; // Admin can see all absences
        break;
      case null:
      case undefined:
      default:
        // Fallback to admin endpoint if role is not recognized or user not authenticated
        console.warn('User role not found, falling back to admin endpoint:', userRole);
        endpoint = `${environment.apiURL}/v1/absences`;
        break;
    }
    
    return this.httpclient.get<Absence[]>(endpoint);
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(absence: Absence) {
    return this.update(absence);
  }
}

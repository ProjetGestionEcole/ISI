import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inscription } from '../models/inscription';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService extends BaseService<Inscription> {
  protected resourceName = 'inscriptions';
  protected primaryKey = 'id';

  constructor(httpclient: HttpClient, private authService: AuthService) {
    super(httpclient);
    this.initializeUrl();
  }

  // Override getAll to use role-specific endpoint
  override getAll(): Observable<Inscription[]> {
    const userRole = this.authService.getCurrentUserRole();
    let endpoint = '';
    
    switch (userRole) {
      case 'Etudiant':
        endpoint = `${environment.apiURL}/v1/etudiants/my/inscriptions`;
        break;
      case 'Admin':
        endpoint = `${environment.apiURL}/v1/inscriptions`; // Admin can see all inscriptions
        break;
      case 'Prof':
      case 'Parent':
        // Professors and Parents don't have direct access to inscriptions
        // Fallback to admin endpoint for now
        endpoint = `${environment.apiURL}/v1/inscriptions`;
        break;
      case null:
      case undefined:
      default:
        // Fallback to admin endpoint if role is not recognized or user not authenticated
        console.warn('User role not found, falling back to admin endpoint:', userRole);
        endpoint = `${environment.apiURL}/v1/inscriptions`;
        break;
    }
    
    return this.httpclient.get<Inscription[]>(endpoint);
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(inscription: Inscription) {
    return this.update(inscription);
  }
}

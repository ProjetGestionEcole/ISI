import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Specialite } from '../models/specialite';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SpecialiteService extends BaseService<Specialite> {
  protected resourceName = 'specialites';
  protected primaryKey = 'id'; // Specialite uses numeric id

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(specialite: Specialite) {
    return this.update(specialite);
  }

}

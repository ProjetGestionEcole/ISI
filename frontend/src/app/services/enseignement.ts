import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Enseignement } from '../models/enseignement';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EnseignementService extends BaseService<Enseignement> {
  protected resourceName = 'enseignements';
  protected primaryKey = 'code_enseignement'; // Enseignement uses string primary key

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(enseignement: Enseignement) {
    return this.update(enseignement);
  }
}

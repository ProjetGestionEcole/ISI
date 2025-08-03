import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Niveau } from '../models/niveau';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class NiveauService extends BaseService<Niveau> {
  protected resourceName = 'niveaux';
  protected primaryKey = 'id';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(niveau: Niveau) {
    return this.update(niveau);
  }
}

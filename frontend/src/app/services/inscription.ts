import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inscription } from '../models/inscription';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService extends BaseService<Inscription> {
  protected resourceName = 'inscriptions';
  protected primaryKey = 'id';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(inscription: Inscription) {
    return this.update(inscription);
  }
}

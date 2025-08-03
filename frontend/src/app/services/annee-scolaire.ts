import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnneeScolaire } from '../models/annee-scolaire';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AnneeScolaireService extends BaseService<AnneeScolaire> {
  protected resourceName = 'anneescolaires';
  protected primaryKey = 'id';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(anneeScolaire: AnneeScolaire) {
    return this.update(anneeScolaire);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ue } from '../models/ue';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UeService extends BaseService<Ue> {
  protected resourceName = 'ues';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(ue: Ue) {
    return this.update(ue);
  }
}

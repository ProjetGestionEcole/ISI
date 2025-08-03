import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Leparent } from '../models/leparent';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class LeparentService extends BaseService<Leparent> {
  protected resourceName = 'leparents';

  constructor(httpclient: HttpClient) {
    super(httpclient);
    this.initializeUrl();
  }

  // Legacy method names for backward compatibility
  getOffreById(id: number) {
    return this.getById(id);
  }

  updateOffre(leparent: Leparent) {
    return this.update(leparent);
  }
}

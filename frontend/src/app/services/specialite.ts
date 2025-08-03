import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Specialite } from '../models/specialite';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecialiteService {

  url = environment.apiURL+"/v1/specialites";
  constructor(private httpclient :HttpClient) { }

    getAll(){
      return  this.httpclient.get<Specialite[]>(this.url);
    }

    store(Specialite: Specialite){
      return  this.httpclient.post<Specialite>(this.url,Specialite);
    }

    destroy(id:number){
      return this.httpclient.delete(this.url+'/'+id);
    }

    getOffreById(id: number){
      return this.httpclient.get<Specialite>(this.url+'/'+id);
    }

    updateOffre(Specialite: Specialite,){
      return this.httpclient.put<Specialite>(this.url+'/'+Specialite.id, Specialite);
    }

}

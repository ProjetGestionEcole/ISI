import { Specialite } from './specialite';

export interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  username?: string;
  matricule?: string; // Backend uses 'matricule' instead of 'enrolment'
  enrolment?: string; // Legacy property for compatibility
  specialite_id?: number; // Backend uses 'specialite_id' instead of 'speciality'
  speciality?: string; // Legacy property for compatibility
  phone?: string;
  telephone?: string; // Backend may use 'telephone' instead of 'phone'
  address?: string;
  adresse?: string; // Backend may use 'adresse' instead of 'address'
  nom?: string; // Backend uses separate nom/prenom
  prenom?: string;
  date_naissance?: string;
  lieu_naissance?: string;
  sexe?: 'M' | 'F';
  created_at?: string;
  updated_at?: string;
  
  // Relations (populated when needed)
  specialite?: Specialite;
}

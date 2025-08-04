import { Niveau } from './niveau';
import { Specialite } from './specialite';
import { Etudiant } from './etudiant.interface';
import { Enseignement } from './enseignement';

export class Classe {
    id!: number;
    name!: string; // Main name field
    nom_classe?: string; // Backend may use 'nom_classe'
    code_classe!: string;
    niveau_id!: number;
    specialite_id!: number;
    effectif?: number;
    effectif_max?: number; // Backend may include max capacity
    created_at?: string;
    updated_at?: string;
    
  // Relationships (populated when needed)
  niveau?: Niveau;
  specialite?: Specialite;
  etudiants?: Etudiant[];
  enseignements?: Enseignement[];
}

import { Matiere } from './matiere';
import { User } from './user';
import { Classe } from './classe';
import { AnneeScolaire } from './annee-scolaire';
import { Note } from './note';

export class Enseignement {
    id?: number; // Primary key
    code_enseignement!: string;
    code_matiere!: string; // Foreign key to matieres
    code_prof!: number; // Foreign key to users (Prof role)
    enseignant_id?: number; // Alternative foreign key reference
    professeur_id?: number; // Alternative foreign key reference
    matiere_id?: number; // Alternative foreign key reference
    classe_id?: number; // Foreign key to classes
    annee_scolaire_id?: number; // Foreign key to annee_scolaire
    volume_horaire?: number; // Teaching hours
    coefficient?: number; // Subject coefficient
    created_at?: string;
    updated_at?: string;
    
  // Relationships (populated when needed)
  matiere?: Matiere;
  professeur?: User; // User with Prof role
  classe?: Classe;
  annee_scolaire?: AnneeScolaire;
  notes?: Note[]; // Notes for this enseignement
}

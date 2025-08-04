import { Etudiant } from './etudiant.interface';
import { Matiere } from './matiere';
import { Enseignement } from './enseignement';

export class Absence {
    id!: number;
    date_absence!: string;
    statut!: 'justifiee' | 'non_justifiee'; // Backend uses string status instead of boolean
    justifiee?: boolean; // Keep boolean for backwards compatibility
    motif?: string;
    etudiant_id!: number;
    matiere_id!: number;
    enseignement_id!: number;
    duree_heures?: number;
    heure_debut?: string;
    heure_fin?: string;
    created_at?: string;
    updated_at?: string;
    
  // Relationships (populated when needed)
  etudiant?: Etudiant;
  matiere?: Matiere;
  enseignement?: Enseignement;
}

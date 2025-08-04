export interface Prof {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at?: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Additional properties for professors
  user_id?: number;
  nom?: string;
  prenom?: string;
  telephone?: string;
  adresse?: string;
  specialite?: string;
  grade?: string;
  date_embauche?: Date | string;
  statut?: 'actif' | 'inactif' | 'suspendu';
  
  // Relations
  enseignements?: Enseignement[];
  notes?: Note[];
  matieres?: Matiere[];
}

export interface EnseignementProf {
  id: number;
  prof_id: number;
  matiere_id: number;
  classe_id: number;
  semestre_id: number;
  annee_scolaire_id: number;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Relations
  matiere: Matiere;
  classe: Classe;
  semestre: Semestre;
  annee_scolaire: AnneeScolaire;
  notes?: Note[];
}

export interface NoteProf {
  id: number;
  etudiant_id: number;
  matiere_id: number;
  enseignement_id: number;
  prof_id: number;
  valeur: number;
  note_mcc?: number;
  note_examen?: number;
  type_evaluation: string;
  date_evaluation: Date | string;
  coefficient: number;
  semestre_id: number;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Relations
  etudiant: Etudiant;
  matiere: Matiere;
  enseignement: Enseignement;
  semestre: Semestre;
}

export interface ClasseProf {
  id: number;
  nom: string;
  niveau_id: number;
  specialite_id: number;
  effectif: number;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Relations
  niveau: Niveau;
  specialite: Specialite;
  etudiants?: Etudiant[];
  inscriptions?: Inscription[];
}

export interface CreateProfRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  specialite?: string;
  grade?: string;
  date_embauche?: string;
  statut?: 'actif' | 'inactif';
}

export interface UpdateProfRequest extends Partial<CreateProfRequest> {
  id: number;
}

export interface ProfFilterOptions {
  search?: string;
  specialite?: string;
  grade?: string;
  statut?: string;
}

export interface ProfStatistiques {
  totalProfs: number;
  profsActifs: number;
  profsInactifs: number;
  profsSuspendus: number;
  repartitionParSpecialite: { specialite: string; count: number }[];
  repartitionParGrade: { grade: string; count: number }[];
  moyenneAnciennete: number;
}

// Types for Prof dashboard
export interface ProfDashboardStats {
  totalEnseignements: number;
  totalEtudiants: number;
  totalNotes: number;
  totalMatieres: number;
  notesRecentes: NoteProf[];
  enseignementsActifs: EnseignementProf[];
}

export interface ProfFilters {
  matiere_id?: number;
  classe_id?: number;
  semestre_id?: number;
  periode?: string;
  [key: string]: any;
}

// Import des interfaces liées
import { User } from './user';
import { Classe } from './classe';
import { Matiere } from './matiere';
import { Enseignement } from './enseignement';
import { Semestre } from './semestre';
import { AnneeScolaire } from './annee-scolaire';
import { Note } from './note';
import { Etudiant } from './etudiant.interface';
import { Niveau } from './niveau';
import { Specialite } from './specialite';
import { Inscription } from './inscription';

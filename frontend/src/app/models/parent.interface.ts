export interface Parent {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at?: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Additional properties for parents
  user_id?: number;
  nom?: string;
  prenom?: string;
  telephone?: string;
  adresse?: string;
  profession?: string;
  type_parent?: 'pere' | 'mere' | 'tuteur';
  statut?: 'actif' | 'inactif';
  
  // Relations
  children?: Etudiant[];
  leparents?: LeparentRelation[];
}

export interface CreateParentRequest {
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  profession?: string;
  type_parent: 'pere' | 'mere' | 'tuteur';
}

export interface UpdateParentRequest extends Partial<CreateParentRequest> {
  id: number;
}

export interface LeparentRelation {
  id: number;
  user_id: number;
  eleve_id: number;
  relation: 'pere' | 'mere' | 'tuteur';
  profession?: string;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Relations
  parent: Parent;
  etudiant: Etudiant;
}

export interface ParentFilterOptions {
  search?: string;
  type_parent?: string;
  statut?: string;
  profession?: string;
}

export interface ParentStatistiques {
  totalParents: number;
  parentsActifs: number;
  parentsInactifs: number;
  repartitionParType: { type: string; count: number }[];
  repartitionParProfession: { profession: string; count: number }[];
  moyenneEnfantsParParent: number;
}

// Types for Parent dashboard
export interface ParentDashboardStats {
  totalChildren: number;
  totalNotes: number;
  totalAbsences: number;
  moyenneGenerale: number;
  notesRecentes: NoteEnfant[];
  absencesRecentes: AbsenceEnfant[];
  enfantsInfo: EnfantInfo[];
}

export interface NoteEnfant {
  id: number;
  etudiant_id: number;
  matiere_id: number;
  valeur: number;
  type_evaluation: string;
  date_evaluation: Date | string;
  coefficient: number;
  
  // Relations
  etudiant: Etudiant;
  matiere: Matiere;
}

export interface AbsenceEnfant {
  id: number;
  etudiant_id: number;
  matiere_id: number;
  date_absence: Date | string;
  statut: 'justifiee' | 'non_justifiee';
  motif?: string;
  duree_heures?: number;
  
  // Relations
  etudiant: Etudiant;
  matiere: Matiere;
}

export interface EnfantInfo {
  id: number;
  nom: string;
  prenom: string;
  classe?: string;
  moyenne?: number;
  totalAbsences?: number;
  relation: 'pere' | 'mere' | 'tuteur';
}

export interface ParentFilters {
  enfant_id?: number;
  matiere_id?: number;
  periode?: string;
  type_evaluation?: string;
  [key: string]: any;
}

// Import des interfaces liées
import { Etudiant } from './etudiant.interface';
import { Matiere } from './matiere';

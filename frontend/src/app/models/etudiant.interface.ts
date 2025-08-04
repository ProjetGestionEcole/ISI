export interface Etudiant {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at?: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Additional properties that may be added later
  user_id?: number;
  matricule?: string;
  nom?: string;
  prenom?: string;
  date_naissance?: Date | string;
  lieu_naissance?: string;
  sexe?: 'M' | 'F';
  telephone?: string;
  adresse?: string;
  nom_pere?: string;
  nom_mere?: string;
  telephone_parent?: string;
  email_parent?: string;
  numero_parent?: string;
  classe_id?: number;
  date_inscription?: Date | string;
  statut_inscription?: 'inscrit' | 'en_attente' | 'suspendu' | 'diplome';
  
  // Relations
  classe?: Classe;
  user?: User;
  notes?: NoteEtudiant[];
  absences?: AbsenceEtudiant[];
  inscriptions?: Inscription[];
  parents?: Parent[];
}

export interface NoteEtudiant {
  id: number;
  etudiant_id: number;
  matiere_id: number;
  enseignement_id: number;
  valeur: number;
  note_mcc?: number;
  note_examen?: number;
  type_evaluation: string;
  date_evaluation: Date | string;
  coefficient: number;
  semestre_id: string;
  observation?: string;
  comment?: string;
  appreciation?: string;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Relations
  matiere: Matiere;
  enseignement: Enseignement;
  semestre: Semestre;
}

export interface AbsenceEtudiant {
  id: number;
  etudiant_id: number;
  matiere_id: number;
  enseignement_id: number;
  date_absence: Date | string;
  statut: 'justifiee' | 'non_justifiee';
  motif?: string;
  duree_heures?: number;
  heure_debut?: string;
  heure_fin?: string;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Relations
  matiere: Matiere;
  enseignement: Enseignement;
}

export interface InscriptionEtudiant {
  id: number;
  etudiant_id: number;
  classe_id: number;
  annee_scolaire_id: number;
  date_inscription: Date | string;
  statut: 'active' | 'suspendue' | 'terminee';
  frais_inscription?: number;
  created_at: Date | string;
  updated_at: Date | string;
  
  // Relations
  classe: Classe;
  annee_scolaire: AnneeScolaire;
}

export interface ParentEtudiant {
  id: number;
  etudiant_id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  profession?: string;
  type_parent: 'pere' | 'mere' | 'tuteur';
  created_at: Date | string;
  updated_at: Date | string;
}

export interface BulletinEtudiant {
  etudiant: Etudiant;
  semestre: Semestre;
  notes: NoteEtudiant[];
  moyenne_generale: number;
  rang: number;
  mention: Mention;
  appreciation: string;
  absences_total: number;
  date_generation: Date | string;
}

export interface CreateEtudiantRequest {
  nom: string;
  prenom: string;
  date_naissance: string; // Format YYYY-MM-DD
  lieu_naissance: string;
  sexe: 'M' | 'F';
  telephone: string;
  email: string;
  adresse: string;
  nom_pere?: string;
  nom_mere?: string;
  telephone_parent?: string;
  classe_id?: number;
  statut_inscription?: 'inscrit' | 'en_attente';
}

export interface UpdateEtudiantRequest extends Partial<CreateEtudiantRequest> {
  id: number;
}

export interface EtudiantFilterOptions {
  search?: string;
  classe_id?: number;
  specialite_id?: number;
  statut_inscription?: string;
  sexe?: 'M' | 'F';
  annee_inscription?: number;
}

export interface EtudiantStatistiques {
  totalEtudiants: number;
  etudiantsActifs: number;
  etudiantsEnAttente: number;
  etudiantsSuspendus: number;
  repartitionParClasse: { classe: string; count: number }[];
  repartitionParSexe: { sexe: string; count: number }[];
  moyenneAge: number;
}

// Types for API responses
export interface StudentPeriodFilter {
  label: string;
  value: 'this_month' | 'this_semester' | 'this_year' | 'all';
}

export interface StudentSemester {
  id: string; // code_semestre as primary key
  nom: string;
  numero: number;
  date_debut: string;
  date_fin: string;
}

export interface StudentFilters {
  semestre_id?: number;
  period?: string;
  [key: string]: any;
}

// Import des interfaces liées
import { User } from './user';
import { Classe } from './classe';
import { Matiere } from './matiere';
import { Enseignement } from './enseignement';
import { Semestre } from './semestre';
import { AnneeScolaire } from './annee-scolaire';
import { Mention } from './mention';
import { Inscription } from './inscription';
import { Parent } from './parent.interface';

export interface EleveAdmin {
  id: number;
  user_id?: number;
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance: Date;
  lieu_naissance: string;
  sexe: 'M' | 'F';
  telephone: string;
  email: string;
  adresse: string;
  nom_pere?: string;
  nom_mere?: string;
  telephone_parent?: string;
  email_parent?: string;
  numero_parent?: string;
  documents_justificatifs?: DocumentJustificatif[];
  classe_id?: number;
  date_inscription: Date;
  statut_inscription: 'inscrit' | 'en_attente' | 'suspendu' | 'diplome';
  created_at: Date;
  updated_at: Date;
  
  // Relations
  classe?: ClasseInfo;
  user?: UserInfo;
  documents?: DocumentEleve[];
  notes?: NoteEleve[];
  absences?: AbsenceEleve[];
}

export interface DocumentJustificatif {
  type: 'acte_naissance' | 'photo' | 'certificat_scolarite' | 'releve_notes' | 'certificat_medical';
  nom: string;
  url?: string;
  taille?: number;
  date_upload?: Date;
}

export interface DocumentEleve {
  id: number;
  eleve_id: number;
  type: string;
  nom_original: string;
  nom_fichier: string;
  taille: number;
  mime_type: string;
  url_download: string;
  created_at: Date;
}

export interface ClasseInfo {
  id: number;
  code_classe: string;
  nom_classe: string;
  niveau: string;
  specialite: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface NoteEleve {
  id: number;
  matiere: string;
  note: number;
  coefficient: number;
  semestre: string;
  date_evaluation: Date;
}

export interface AbsenceEleve {
  id: number;
  matiere: string;
  date_absence: Date;
  statut: 'justifiee' | 'non_justifiee';
  motif?: string;
}

export interface CreateEleveRequest {
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

export interface UpdateEleveRequest extends Partial<CreateEleveRequest> {
  id: number;
}

export interface EleveFilterOptions {
  search?: string;
  classe_id?: number;
  specialite_id?: number;
  statut_inscription?: string;
  sexe?: 'M' | 'F';
  annee_inscription?: number;
}

export interface EleveStatistiques {
  totalEleves: number;
  elevesActifs: number;
  elevesEnAttente: number;
  elevesSuspendus: number;
  repartitionParClasse: { classe: string; count: number }[];
  repartitionParSexe: { sexe: string; count: number }[];
  moyenneAge: number;
}
export interface EnseignantAdmin {
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
  diplome_principal: string;
  specialites: string[];
  documents_administratifs?: DocumentAdministratif[];
  salaire_base: number;
  date_embauche: Date;
  statut_emploi: 'actif' | 'conge' | 'suspendu' | 'demissionne';
  type_contrat: 'cdi' | 'cdd' | 'vacation';
  created_at: Date;
  updated_at: Date;
  
  // Relations
  user?: UserInfo;
  enseignements?: EnseignementInfo[];
  classes?: ClasseEnseignant[];
  matieres?: MatiereEnseignant[];
  
  // Computed properties
  nomComplet?: string;
  telephoneFormatte?: string;
  age?: number;
  anneeExperience?: number;
  specialitesPrincipal?: string;
  totalVolumeHoraire?: number;
}

export interface DocumentAdministratif {
  type: 'cv' | 'diplome' | 'certificat_travail' | 'photo' | 'contrat';
  nom: string;
  url?: string;
  taille?: number;
  date_upload?: Date;
}

export interface EnseignementInfo {
  id: number;
  matiere: string;
  classe: string;
  volume_horaire: number;
  semestre: string;
}

export interface ClasseEnseignant {
  id: number;
  code_classe: string;
  nom_classe: string;
  niveau: string;
  specialite: string;
  effectif: number;
}

export interface MatiereEnseignant {
  id: number;
  nom: string;
  code: string;
  coefficient: number;
  volume_horaire_total: number;
}

export interface CreateEnseignantRequest {
  nom: string;
  prenom: string;
  date_naissance: string; // Format YYYY-MM-DD
  lieu_naissance: string;
  sexe: 'M' | 'F';
  telephone: string;
  email?: string;
  adresse: string;
  diplome_principal: string;
  specialites: string[];
  salaire_base?: number;
  date_embauche?: string; // Format YYYY-MM-DD
  type_contrat: 'cdi' | 'cdd' | 'vacation';
  statut_emploi?: 'actif' | 'conge' | 'suspendu';
}

export interface UpdateEnseignantRequest extends Partial<CreateEnseignantRequest> {
  id: number;
}

export interface EnseignantFilterOptions {
  search?: string;
  specialite?: string;
  type_contrat?: 'cdi' | 'cdd' | 'vacation';
  statut_emploi?: 'actif' | 'conge' | 'suspendu' | 'demissionne';
  salaire_min?: number;
  salaire_max?: number;
  annee_embauche?: number;
}

export interface EnseignantStatistiques {
  totalEnseignants: number;
  enseignantsActifs: number;
  enseignantsConge: number;
  enseignantsSuspendus: number;
  repartitionParContrat: { type: string; count: number }[];
  repartitionParSpecialite: { specialite: string; count: number }[];
  salaireMoyen: number;
  ancienneteMoyenne: number;
}

export interface AssignEnseignementRequest {
  enseignant_id: number;
  matiere_id: number;
  classe_id: number;
  volume_horaire: number;
  semestre_id?: number;
}

export interface AjustSalaireRequest {
  enseignant_id: number;
  nouveau_salaire: number;
  motif?: string;
  date_effet?: string; // Format YYYY-MM-DD
}

export interface ChangeStatutEnseignantRequest {
  enseignant_id: number;
  nouveau_statut: 'actif' | 'conge' | 'suspendu' | 'demissionne';
  motif?: string;
  date_effet?: string; // Format YYYY-MM-DD
}
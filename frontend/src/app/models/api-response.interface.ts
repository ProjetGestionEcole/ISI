// Laravel API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// User model from Laravel
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Etudiant' | 'Prof' | 'Parent';
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Parent-Student relationship from Laravel
export interface ParentRelation {
  id?: number;
  user_id?: number;  // Parent user ID
  eleve_id?: number; // Student user ID
  relation?: 'pere' | 'mere' | 'tuteur';
  profession?: string;
  created_at?: string;
  updated_at?: string;
  parent?: User;    // Related parent user
  etudiant?: User;  // Related student user
}

// Dashboard stats from Laravel RoleBasedDataController
export interface DashboardStats {
  // Admin stats
  classes_count?: number;
  etudiants_count?: number;
  enseignants_count?: number;
  parents_count?: number;
  admins_count?: number;
  matieres_count?: number;
  specialites_count?: number;
  niveaux_count?: number;
  semestres_count?: number;
  ues_count?: number;
  enseignements_count?: number;
  total_users?: number;
  total_notes?: number;
  total_absences?: number;
  total_inscriptions?: number;
  mentions_count?: number;
  annees_scolaires_count?: number;
  
  // Professor stats
  notes_added?: number;
  absences_recorded?: number;
  students_count?: number;
  
  // Student stats
  notes_count?: number;
  absences_count?: number;
  inscriptions_count?: number;
  average_grade?: number;
  current_class?: string;
  
  // Parent stats
  children_count?: number;
  children_notes?: number;
  children_absences?: number;
  children_average_grade?: number;
}

// Other models from Laravel
export interface Note {
  id: number;
  id_etudiant: number;
  code_enseignement: string;
  mcc?: number;
  examen?: number;
  created_at?: string;
  updated_at?: string;
  etudiant?: User;
  enseignement?: any;
}

export interface Absence {
  id: number;
  etudiant_id: number;
  prof_id?: number;
  matiere_id?: number;
  date_absence: string;
  justifie: boolean;
  created_at?: string;
  updated_at?: string;
  etudiant?: User;
  prof?: User;
  matiere?: any;
}

export interface Inscription {
  id: number;
  etudiant_id: number;
  code_classe: string;
  code_annee_scolaire: string;
  created_at?: string;
  updated_at?: string;
  etudiant?: User;
  classe?: any;
  anneeScolaire?: any;
}

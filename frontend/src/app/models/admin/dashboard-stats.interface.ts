export interface DashboardStats {
  totalEleves: number;
  totalEnseignants: number;
  totalClasses: number;
  totalMatieres: number;
  repartitionSpecialites: SpecialiteStats[];
  activiteRecente: Activity[];
  elevesByStatut: EleveStatutStats[];
  enseignantsByContrat: EnseignantContratStats[];
}

export interface SpecialiteStats {
  specialite: string;
  codeSpecialite: string;
  totalEleves: number;
  totalClasses: number;
  pourcentage: number;
}

export interface Activity {
  id: number;
  type: 'eleve' | 'enseignant' | 'inscription' | 'note' | 'absence';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  severity?: 'success' | 'info' | 'warning' | 'danger';
}

export interface EleveStatutStats {
  statut: 'inscrit' | 'en_attente' | 'suspendu' | 'diplome';
  count: number;
  pourcentage: number;
}

export interface EnseignantContratStats {
  typeContrat: 'cdi' | 'cdd' | 'vacation';
  count: number;
  pourcentage: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor?: string[];
  borderWidth?: number;
}
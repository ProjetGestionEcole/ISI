export class Absence {
    id!: number;
    date_absence!: string;
    justifiee!: boolean;
    motif?: string;
    etudiant_id!: number;
    matiere_id!: number;
    enseignement_id!: number;
    duree_heures?: number;
    heure_debut?: string;
    heure_fin?: string;
}

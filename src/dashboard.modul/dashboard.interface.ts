
export const StatutPointage = {
  PRESENT: "present",
  RETARD: "retard",
  ABSENT: "absent",
  VALIDATION_EN_COURS: "validation_en_cours",
} as const;

export type StatutPointage = typeof StatutPointage[keyof typeof StatutPointage];



// ============ Réponses ============
export interface PointageCheckinResponse {
  id: number;
  idUser: number;
  debutCheckin: string; // ISO DateTime
  finCheckin: string | null;
  dureeTravail?: number; // en minutes
  methode: string;
  ipAddress: string | null;
  ssidReseau: string | null;
  estRetard: boolean;
  minutesRetard: number;
  statut: StatutPointage;
  estValide: boolean;
  niveauConfiance: 0 | 1 | 2 | 3;
  messageConfiance?: string;
  sourceDevice?: string;
  latitude?: number;
  longitude?: number;
  message?: string;
  success?: boolean;
}

export interface StatsPersonnellesResponse {
  mois: number;
  annee: number;
  totalJoursPresents: number;
  joursComplets: number;
  totalRetards: number;
  totalMinutesTravail: number; // en minutes
  totalHeuresTravail: number; // heures arrondies
  joursOuvrables: number;
  tauxAssiduite: number; // pourcentage (0-100)
  pointagesSuspects: number;
  historique: PointageCheckinResponse[];
}
/**
 * Interfaces TypeScript pour le module de Présence/Pointage
 */

// ============ Constants & Types ============
export const MethodePointage = {
  MANUEL: "manuel",
  WIFI: "wifi",
  QR: "qr",
  GPS: "gps",
  EMPREINTE: "empreinte",
  FACIAL: "facial",
} as const;

export type MethodePointage = typeof MethodePointage[keyof typeof MethodePointage];

export const StatutPointage = {
  PRESENT: "present",
  RETARD: "retard",
  ABSENT: "absent",
  VALIDATION_EN_COURS: "validation_en_cours",
} as const;

export type StatutPointage = typeof StatutPointage[keyof typeof StatutPointage];

// ============ Types de Confiance ============
export interface NiveauConfiance {
  niveau: 0 | 1 | 2 | 3;
  message: string;
  valideAuto: boolean;
}

// ============ Requêtes ============
export interface PointageEntreePayload {
  methode?: MethodePointage | string;
  ipAddress?: string;
  ssidReseau?: string;
  sourceDevice?: string;
  latitude?: number;
  longitude?: number;
}

export interface PointageSortiePayload {
  sourceDevice?: string;
}

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

export interface PointageSortieResponse {
  id: number;
  idUser: number;
  debutCheckin: string;
  finCheckin: string;
  dureeTravail: number; // en minutes
  methode: string;
  estRetard: boolean;
  minutesRetard: number;
  statut: StatutPointage;
  message?: string;
  success?: boolean;
}

export interface StatutAujourdhuiResponse {
  aPointe: boolean;
  estSorti: boolean;
  heureEntree: string | null;
  heureSortie: string | null;
  dureeTravail: number | null; // en minutes
  estRetard: boolean;
  minutesRetard: number;
  estValide: boolean;
  checkin: PointageCheckinResponse | null;
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

export interface StatsEquipeUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  rang?: {
    libelle: string;
    niveau?: number;
  };
}

export interface StatsEquipeEntry {
  user: StatsEquipeUser;
  stats: StatsPersonnellesResponse;
}

// ============ Erreurs API ============
export interface PresenceErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

// ============ State Management ============
export interface PresenceState {
  loading: boolean;
  error: string | null;
  lastCheckin: PointageCheckinResponse | null;
  statutAujourdhui: StatutAujourdhuiResponse | null;
  statsPersonnelles: StatsPersonnellesResponse | null;
  statsEquipe: StatsEquipeEntry[] | null;
}

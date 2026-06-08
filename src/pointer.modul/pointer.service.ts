/**
 * Service API pour la gestion de la Présence/Pointage
 * Gère l'enregistrement d'entrée/sortie, les statistiques et la validation
 */

import type {
  PointageEntreePayload,
  PointageSortiePayload,
  PointageCheckinResponse,
  PointageSortieResponse,
  StatutAujourdhuiResponse,
  StatsEquipeEntry,
} from "./pointer.interface";
import {apiClient} from "../utils/constant";

const API_BASE = "/presence";

// ============ Pointage d'Entrée ============
/**
 * Enregistre le pointage d'entrée (check-in)
 * @param payload - Données du pointage (méthode, IP, WiFi, GPS, etc.)
 * @returns Réponse avec détails du pointage et niveau de confiance
 * @throws Error - Si le pointage échoue
 */
export async function pointageEntree(
  payload: PointageEntreePayload
): Promise<PointageCheckinResponse> {
  try {
    const response = await apiClient.post<{ success: boolean; message: string; data: PointageCheckinResponse }>(
      `${API_BASE}/entree`,
      payload
    );
    return response.data.data;
  } catch (error) {
    throw toPresenceError(error);
  }
}

// ============ Pointage de Sortie ============
/**
 * Enregistre le pointage de sortie (check-out)
 * @param payload - Données optionnelles (sourceDevice)
 * @returns Réponse avec détails du pointage et durée de travail
 * @throws Error - Si la sortie échoue (ex: pas d'entrée trouvée)
 */
export async function pointageSortie(
  payload?: PointageSortiePayload
): Promise<PointageSortieResponse> {
  try {
    const response = await apiClient.post<{ success: boolean; message: string; data: PointageSortieResponse }>(
      `${API_BASE}/sortie`,
      payload || {}
    );
    return response.data.data;
  } catch (error) {
    throw toPresenceError(error);
  }
}

// ============ Statut du Jour ============
/**
 * Récupère le statut du pointage d'aujourd'hui
 * @returns Statut avec horaires d'entrée/sortie et durée de travail
 * @throws Error - Si la requête échoue
 */
export async function getStatutAujourdhui(): Promise<StatutAujourdhuiResponse> {
  try {
    const response = await apiClient.get<{ success: boolean; message: string; data: StatutAujourdhuiResponse }>(
      `${API_BASE}/aujourd-hui`
    );
    return response.data.data;
  } catch (error) {
    throw toPresenceError(error);
  }
}

// ============ Statistiques Personnelles ============
/**
 * Récupère les statistiques mensuelles de présence personnelles
 * @param mois - Mois (1-12), défaut = mois courant
 * @param annee - Année (YYYY), défaut = année courante
 * @returns Stats mensuelles avec historique et taux d'assiduité
 * @throws Error - Si la requête échoue
 */
// export async function getStatsPersonnelles(
//   mois?: number,
//   annee?: number
// ): Promise<StatsPersonnellesResponse> {
//   try {
//     const params: Record<string, number> = {};
//     if (mois !== undefined) params.mois = mois;
//     if (annee !== undefined) params.annee = annee;

//     const response = await apiClient.get<{ success: boolean; message: string; data: StatsPersonnellesResponse }>(
//       `${API_BASE}/mes-stats`,
//       { params }
//     );
//     return response.data.data;
//   } catch (error) {
//     throw toPresenceError(error);
//   }
// }

// ============ Statistiques de l'Équipe (Manager) ============
/**
 * Récupère les statistiques de l'équipe (managers uniquement)
 * Nécessite la permission VOIR_EQUIPE_PROPRE ou VOIR_EQUIPE_COMPLETE
 * @param mois - Mois (1-12), défaut = mois courant
 * @param annee - Année (YYYY), défaut = année courante
 * @returns Tableau des statistiques par employé avec infos utilisateur
 * @throws Error - Si non autorisé ou si la requête échoue
 */
export async function getStatsEquipe(
  mois?: number,
  annee?: number
): Promise<StatsEquipeEntry[]> {
  try {
    const params: Record<string, number> = {};
    if (mois !== undefined) params.mois = mois;
    if (annee !== undefined) params.annee = annee;

    const response = await apiClient.get<StatsEquipeEntry[]>(
      `${API_BASE}/equipe`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw toPresenceError(error);
  }
}

// ============ Utilitaires ============

/**
 * Convertit une erreur Axios en message utilisateur lisible
 * @param error - Erreur Axios
 * @returns Message d'erreur personnalisé
 */
function toPresenceError(error: any): Error {
  // Erreur réseau
  if (!error.response) {
    return new Error(
      "Erreur de connexion. Vérifiez votre connexion internet."
    );
  }

  const status = error.response.status;
  const data = error.response.data;

  // Messages d'erreur spécifiques par code HTTP
  switch (status) {
    case 400:
      return new Error(
        data?.error || "Données invalides. Vérifiez votre saisie."
      );

    case 401:
      return new Error("Session expirée. Veuillez vous reconnecter.");

    case 403:
      return new Error(
        "Vous n'avez pas les permissions requises pour cette action."
      );

    case 404:
      return new Error(
        data?.error || "Aucun pointage trouvé pour aujourd'hui."
      );

    case 409:
      // Conflit - ex: double pointage
      return new Error(
        data?.error ||
          "Un pointage est déjà ouvert. Veuillez d'abord enregistrer la sortie."
      );

    case 422:
      return new Error(
        data?.error ||
          "Données invalides. Vérifiez tous les champs requis."
      );

    case 500:
      return new Error(
        "Erreur serveur. Veuillez réessayer dans quelques instants."
      );

    case 503:
      return new Error("Service temporairement indisponible. Réessayez plus tard.");

    default:
      return new Error(
        data?.error ||
          `Erreur ${status}. Veuillez réessayer ou contacter le support.`
      );
  }
}

/**
 * Formate une durée en minutes en format lisible (ex: "2h 30m")
 * @param minutes - Durée en minutes
 * @returns Chaîne formatée
 */
export function formatDureeTravail(minutes: number): string {
  if (minutes <= 0) return "0m";

  const heures = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (heures === 0) return `${mins}m`;
  if (mins === 0) return `${heures}h`;

  return `${heures}h ${mins}m`;
}

/**
 * Formate une heure ISO en format lisible pour l'affichage
 * @param isoDateTime - Date ISO (ex: "2026-05-30T05:15:00.000Z")
 * @returns Heure formatée (ex: "05:15")
 */
export function formatHeure(isoDateTime: string): string {
  try {
    return new Date(isoDateTime).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoDateTime;
  }
}

/**
 * Formate une date ISO en format lisible
 * @param isoDateTime - Date ISO
 * @returns Date formatée (ex: "30 mai 2026")
 */
export function formatDate(isoDateTime: string): string {
  try {
    return new Date(isoDateTime).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoDateTime;
  }
}

/**
 * Détermine le statut visuel basé sur le niveau de confiance
 * @param niveauConfiance - Niveau de confiance (0-3)
 * @returns Objet avec couleur et label
 */
export function getStatutConfiance(niveauConfiance: 0 | 1 | 2 | 3) {
  const statusMap = {
    3: { label: "Absolue", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30" },
    2: { label: "Élevée", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
    1: { label: "Partielle", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
    0: { label: "Faible", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" },
  };

  return statusMap[niveauConfiance];
}

/**
 * Calcule le nombre de jours entre deux dates
 * @param debut - Date de début
 * @param fin - Date de fin
 * @returns Nombre de jours
 */
export function calculerJoursDifference(debut: string, fin: string): number {
  const d1 = new Date(debut).getTime();
  const d2 = new Date(fin).getTime();
  return Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
}

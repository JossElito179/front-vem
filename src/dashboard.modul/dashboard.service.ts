

const API_BASE = "/presence";


// ============ Statistiques Personnelles ============

import apiClient from "../auth.modul/auth.api";
import type { StatsPersonnellesResponse } from "./dashboard.interface";


/**
 * Récupère les statistiques mensuelles de présence personnelles
 * @param mois - Mois (1-12), défaut = mois courant
 * @param annee - Année (YYYY), défaut = année courante
 * @returns Stats mensuelles avec historique et taux d'assiduité
 * @throws Error - Si la requête échoue
 */
export async function getStatsPersonnelles(
  mois?: number,
  annee?: number
): Promise<StatsPersonnellesResponse> {
  try {
    const params: Record<string, number> = {};
    if (mois !== undefined) params.mois = mois;
    if (annee !== undefined) params.annee = annee;

    const response = await apiClient.get<{ success: boolean; message: string; data: StatsPersonnellesResponse }>(
      `${API_BASE}/mes-stats`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Erreur inconnue lors de la récupération des statistiques personnelles.");
  }
}
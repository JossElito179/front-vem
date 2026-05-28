export interface Holiday {
  date: string;
  localName: string;
  name: string;
}

const HOLIDAYS_API_URL = "https://date.nager.at/api/v3/PublicHolidays/2026/MG";

/**
 * Récupère la liste des jours fériés pour Madagascar en 2026
 * @returns Promesse contenant un tableau de jours fériés
 */
export const fetchHolidays = async (): Promise<Holiday[]> => {
  try {
    const response = await fetch(HOLIDAYS_API_URL);
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    const data: Holiday[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors du chargement des jours fériés:", error);
    return [];
  }
};

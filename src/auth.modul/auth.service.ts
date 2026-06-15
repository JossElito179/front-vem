import axios from 'axios';
import { apiClient } from '../utils/constant';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type SubordonneeUser = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  rang: { id: number; niveau: number; libelle: string } | null;
  poste: { id: number; rolePredefini: string; estActif: boolean } | null;
};

export type Poste = {
  id: number;
  rolePredefini: string;
};

export type Manager = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  rang: { id: number; niveau: number; libelle: string };
};

function toAuthError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error) && error.response?.data) {
    const d = error.response.data as { error?: string; details?: string[] };
    if (d.details?.length) return new Error(d.details.join(' • '));
    if (d.error) return new Error(d.error);
  }
  return new Error(fallback);
}

/**
 * GET /api/auth/mes-subordonnes
 * Requires VOIR_EQUIPE_PROPRE permission.
 * - rang 1 (admin)   → all active users except self
 * - rang 2 (manager) → direct reports only
 */
export async function getSubordonnees(): Promise<SubordonneeUser[]> {
  try {
    const res = await apiClient.get<ApiResponse<SubordonneeUser[]>>('/auth/mes-subordonnes');
    return res.data.data;
  } catch (error) {
    throw toAuthError(error, 'Impossible de charger la liste des employés');
  }
}

/** GET /api/auth/postes — public, returns list of active postes */
export async function getPostes(): Promise<Poste[]> {
  try {
    const res = await apiClient.get<ApiResponse<Poste[]>>('/auth/postes');
    return res.data.data;
  } catch (error) {
    throw toAuthError(error, 'Impossible de charger la liste des postes');
  }
}

/** GET /api/auth/all-managers — public, returns users with rang niveau 1 or 2 */
export async function getManagers(): Promise<Manager[]> {
  try {
    const res = await apiClient.get<ApiResponse<Manager[]>>('/auth/all-managers');
    return res.data.data;
  } catch (error) {
    throw toAuthError(error, 'Impossible de charger la liste des managers');
  }
}

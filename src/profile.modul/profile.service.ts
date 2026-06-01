import axios from 'axios';
import { apiClient } from '../utils/constant';
import type { User, ProfileApiResponse } from './interface';

function toProfileError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error) && error.response?.data) {
    const d = error.response.data as { error?: string; details?: string[] };
    if (d.details?.length) return new Error(d.details.join(' • '));
    if (d.error) return new Error(d.error);
  }
  return new Error(fallback);
}

/**
 * GET /api/auth/me
 * Récupère les données du profil utilisateur authentifié
 */
export async function getUserProfile(): Promise<User> {
  try {
    const res = await apiClient.get<ProfileApiResponse>('/auth/me');
    return res.data.data;
  } catch (error) {
    throw toProfileError(error, 'Impossible de charger votre profil');
  }
}


export async function validatePasswordForSalary(password: string): Promise<boolean> {
  try {
    const response = await apiClient.post<{ success: boolean; data: { message: string } }>(
      "/auth/password-validate",
      { motDePasse: password }
    );
    return response.data.success;
  } catch (error) {
    throw toProfileError(error, "Erreur lors de la validation du mot de passe");
  }
}
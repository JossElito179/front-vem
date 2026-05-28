import axios from 'axios';
import { apiClient } from '../utils/constant';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ApiErrorBody = {
  error?: string;
  details?: string[];
};

function toApiError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError(error) && error.response?.data) {
    const body = error.response.data as ApiErrorBody;
    if (body.details?.length) return new Error(body.details.join(' • '));
    if (body.error) return new Error(body.error);
  }
  return new Error(fallback);
}

export type ApiTask = {
  id: number;
  idConfigTask: number | null;
  idUserAssigne: number;
  idUserCreateur: number;
  titre: string;
  description: string | null;
  dateDebut: string;
  dateLimite: string;
  poids: number;
  priorite: 'BASSE' | 'NORMALE' | 'HAUTE';
  commentaire: string | null;
  statut: 'EN_COURS' | 'TERMINE' | 'EN_RETARD';
  dateCompletion: string | null;
  assigne: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    idManager: number | null;
  } | null;
  createur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  } | null;
  config: { id: number; titre: string } | null;
};

export type CreateTaskPayload = {
  idConfigTask?: number | null;
  idUserAssigne: number;
  titre: string;
  description?: string | null;
  dateDebut: string;
  dateLimite: string;
  poids?: number;
  priorite?: 'BASSE' | 'NORMALE' | 'HAUTE';
  commentaire?: string | null;
};

export type UpdateTaskPayload = {
  titre?: string;
  description?: string | null;
  dateDebut?: string;
  dateLimite?: string;
  poids?: number;
  priorite?: 'BASSE' | 'NORMALE' | 'HAUTE';
  commentaire?: string | null;
};

export type TaskQueryParams = {
  statut?: 'EN_COURS' | 'TERMINE' | 'EN_RETARD';
  priorite?: 'BASSE' | 'NORMALE' | 'HAUTE';
  mois?: number;
  annee?: number;
};

export async function getMyTasks(params?: TaskQueryParams): Promise<ApiTask[]> {
  try {
    const res = await apiClient.get<ApiResponse<ApiTask[]>>('/tasks/mes-taches', { params });
    return res.data.data;
  } catch (error) {
    throw toApiError(error, 'Impossible de charger vos tâches');
  }
}

export async function getTeamTasks(params?: TaskQueryParams): Promise<ApiTask[]> {
  try {
    const res = await apiClient.get<ApiResponse<ApiTask[]>>('/tasks/equipe', { params });
    return res.data.data;
  } catch (error) {
    throw toApiError(error, "Impossible de charger les tâches de l'équipe");
  }
}

export async function createTask(payload: CreateTaskPayload): Promise<{ data: ApiTask; message: string }> {
  try {
    const res = await apiClient.post<ApiResponse<ApiTask>>('/tasks', payload);
    return { data: res.data.data, message: res.data.message ?? 'Tâche créée avec succès' };
  } catch (error) {
    throw toApiError(error, 'Impossible de créer la tâche');
  }
}

export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<{ data: ApiTask; message: string }> {
  try {
    const res = await apiClient.put<ApiResponse<ApiTask>>(`/tasks/${id}`, payload);
    return { data: res.data.data, message: res.data.message ?? 'Tâche mise à jour' };
  } catch (error) {
    throw toApiError(error, 'Impossible de mettre à jour la tâche');
  }
}

export async function completeTask(id: number, commentaire?: string | null): Promise<{ data: ApiTask; message: string }> {
  try {
    const res = await apiClient.patch<ApiResponse<ApiTask>>(`/tasks/${id}/complete`, {
      commentaire: commentaire ?? null,
    });
    return { data: res.data.data, message: res.data.message ?? 'Tâche marquée comme terminée' };
  } catch (error) {
    throw toApiError(error, 'Impossible de compléter la tâche');
  }
}

export async function getTaskById(id: number): Promise<ApiTask> {
  try {
    const res = await apiClient.get<ApiResponse<ApiTask>>(`/tasks/${id}`);
    return res.data.data;
  } catch (error) {
    throw toApiError(error, 'Impossible de charger la tâche');
  }
}

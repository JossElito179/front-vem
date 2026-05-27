import absenceApi from "./absence.api";

type ApiResponse<T> = {
	success: boolean;
	message?: string;
	data: T;
};

export type AbsenceConfig = {
	id: number;
	typeAbsence: string;
	libelle: string;
	joursAutorises: number;
	estActif: boolean;
};

export type AbsenceRequestPayload = {
	idConfigAbsence: number;
	dateDebutAbsence: string;
	dateFinAbsence: string;
	typeJournee?: "JOURNEE" | "MATIN" | "APRES_MIDI";
	priorite?: "BASSE" | "NORMALE" | "HAUTE";
	motif?: string;
};

export type AbsenceRequest = {
	id: number;
	idConfigAbsence: number;
	idUserDemandeur: number;
	dateDemande: string;
	dateDebutAbsence: string;
	dateFinAbsence: string;
	typeJournee?: string | null;
	priorite?: string | null;
	motif?: string | null;
	statut: string;
	nombreJours?: number;
	commentaireValidateur?: string | null;
	configAbsence?: AbsenceConfig | null;
	demandeur?: {
		id: number;
		nom: string;
		prenom: string;
		email: string;
		idManager?: number | null;
	} | null;
};

export type AbsenceValidationPayload = {
	statut: "VALIDE" | "REFUSE";
	commentaireValidateur?: string | null;
};

export type AbsenceQueryParams = {
	statut?: string;
	mois?: number;
	annee?: number;
};

const buildQueryString = (params?: AbsenceQueryParams) => {
	if (!params) {
		return "";
	}

	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			searchParams.append(key, String(value));
		}
	});

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : "";
};

export async function getAbsenceConfigs() {
	const response = await absenceApi.get<ApiResponse<AbsenceConfig[]>>("/absences/config");
	return response.data.data;
}

export async function createAbsenceDemand(payload: AbsenceRequestPayload) {
	const response = await absenceApi.post<ApiResponse<AbsenceRequest>>("/absences/demande", payload);
	return response.data.data;
}

export async function getMyAbsenceRequests(params?: AbsenceQueryParams) {
	const response = await absenceApi.get<ApiResponse<AbsenceRequest[]>>(
		`/absences/mes-demandes${buildQueryString(params)}`,
	);
	return response.data.data;
}

export async function getTeamAbsenceRequests(params?: AbsenceQueryParams) {
	const response = await absenceApi.get<ApiResponse<AbsenceRequest[]>>(
		`/absences/equipe${buildQueryString(params)}`,
	);
	return response.data.data;
}

export async function updateAbsenceValidation(
	id: number,
	payload: AbsenceValidationPayload,
) {
	const response = await absenceApi.patch<ApiResponse<AbsenceRequest>>(
		`/absences/${id}/validation`,
		payload,
	);
	return response.data.data;
}

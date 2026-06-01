// Permission interface
export interface Permission {
  id: number;
  code: string;
  description: string;
  rang_permission: RangPermission;
}

// RangPermission (relation table)
export interface RangPermission {
  id: number;
  idRang: number;
  idPermission: number;
}

// Rang (Role/Rank)
export interface Rang {
  id: number;
  niveau: number;
  libelle: string;
  description: string;
  permissions: Permission[];
}

// Poste (Position)
export interface Poste {
  id: number;
  code: string;
  libelle: string;
  description: string;
}

// Manager
export interface Manager {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

// User/Employee Profile
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string; // ISO 8601 format
  dateEmbauche: string; // ISO 8601 format
  salaire: string; // decimal as string
  idPoste: number | null;
  intitulePersonnalise: string | null;
  idRang: number;
  idManager: number | null;
  estActif: boolean;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  rang: Rang;
  poste: Poste | null;
  manager: Manager | null;
  permissions: string[]; // permission codes
}

// API Response wrapper
export interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: User;
}

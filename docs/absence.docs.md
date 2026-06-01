# Auth + Absences — Frontend Integration Guide

Base URL: `http://localhost:3000/api`

All protected endpoints require:

```http
Authorization: Bearer <token>
```

Standard response envelope:

```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": {}
}
```

Error envelope:

```json
{
  "success": false,
  "error": "Short error message",
  "details": []
}
```

`details` is mainly present on validation errors.

---

## AuthProvider contract

The frontend can use a simple auth state with one token and one user profile.

```ts
type AuthUser = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  rang: {
    id: number;
    niveau: number;
    libelle: string;
  };
  poste: {
    id: number;
    libelle?: string;
  } | null;
  permissions: string[];
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
};
```

Recommended flow:

1. Store the token in `localStorage` after login.
2. On app mount, restore the token and call `GET /auth/me`.
3. If `GET /auth/me` succeeds, hydrate the user state.
4. If it returns `401`, clear auth state and redirect to login.
5. On logout, remove the token and reset the store.

Suggested axios interceptor:

```ts
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Auth endpoints

### POST `/auth/register`

Creates a user account. In most frontend setups this screen is admin-only.

Request body:

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.societe@example.com",
  "motDePasse": "Test1234!",
  "dateEmbauche": "2024-06-01",
  "idRang": 3,
  "telephone": "+261340000000",
  "dateNaissance": "1995-01-15",
  "salaire": 2500000,
  "idPoste": 2,
  "idManager": 5,
  "intitulePersonnalise": "Développeur frontend"
}
```

Required fields:

| Field | Type | Notes |
|---|---|---|
| `nom` | string | Required |
| `prenom` | string | Required |
| `email` | string | Must be unique |
| `motDePasse` | string | Hashed by the backend |
| `dateEmbauche` | date | Format `YYYY-MM-DD` |
| `idRang` | integer | Must exist in DB |

Optional fields:

| Field | Type | Notes |
|---|---|---|
| `telephone` | string | Optional |
| `dateNaissance` | date | Optional |
| `salaire` | number | Optional decimal accepted |
| `idPoste` | integer | Optional FK |
| `idManager` | integer | Optional FK |
| `intitulePersonnalise` | string | Optional custom label |

Response `201 Created`:

```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "data": {
    "id": 4,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.societe@example.com",
    "telephone": "+261340000000",
    "dateNaissance": "1995-01-15",
    "dateEmbauche": "2024-06-01",
    "salaire": "2500000.00",
    "idPoste": 2,
    "idRang": 3,
    "idManager": 5,
    "intitulePersonnalise": "Développeur frontend",
    "estActif": true,
    "createdAt": "2026-05-26T08:00:00.000Z",
    "updatedAt": "2026-05-26T08:00:00.000Z"
  }
}
```

Important:

- `motDePasse` is never returned.
- This endpoint does not return a token.

Error cases:

| Status | Cause |
|---|---|
| `400` | Missing or invalid field |
| `409` | Email already exists |

### POST `/auth/login`

Use this endpoint to authenticate and initialize the `AuthProvider`.

Request body:

```json
{
  "email": "admin@test.mg",
  "motDePasse": "Test1234!"
}
```

Response `200 OK`:

```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nom": "AdminTest",
      "prenom": "Un",
      "email": "admin@test.mg",
      "rang": {
        "id": 1,
        "niveau": 1,
        "libelle": "Manager général"
      },
      "poste": null,
      "permissions": [
        "SOUMETTRE_DEMANDE",
        "VALIDER_CONGE",
        "VOIR_EQUIPE_COMPLETE"
      ]
    }
  }
}
```

Frontend usage:

- Save `data.token`.
- Save `data.user` in the auth store.
- Redirect to the app after success.

Error cases:

| Status | Cause |
|---|---|
| `401` | Wrong email or password |

### GET `/auth/me`

Returns the current authenticated user profile.

No body.

Response `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nom": "AdminTest",
    "prenom": "Un",
    "email": "admin@test.mg",
    "rang": {
      "id": 1,
      "niveau": 1,
      "libelle": "Manager général",
      "permissions": ["SOUMETTRE_DEMANDE", "VALIDER_CONGE"]
    },
    "poste": null,
    "manager": null
  }
}
```

Use this endpoint on app boot to restore the session from a persisted token.

---

## Absence workflow

Status flow:

```text
ATTENTE -> VALIDE
ATTENTE -> REFUSE
```

Frontend notes:

- Always fetch configs before opening the leave request form.
- Block submit until both dates and a config are selected.
- Show API errors clearly, especially `400`, `403`, and `409`.

---

## Absence endpoints

### GET `/absences/config`

Returns all active absence configurations.

Response `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "typeAbsence": "CONGE",
      "libelle": "Congé annuel",
      "joursAutorises": 30,
      "estActif": true
    },
    {
      "id": 2,
      "typeAbsence": "OFF",
      "libelle": "Congé compensatoire",
      "joursAutorises": 2,
      "estActif": true
    }
  ]
}
```

Use this endpoint to build the absence type selector.

### POST `/absences/demande`

Creates a leave request for the authenticated user.

Required permission: `SOUMETTRE_DEMANDE`

Request body:

```json
{
  "idConfigAbsence": 1,
  "dateDebutAbsence": "2026-07-15",
  "dateFinAbsence": "2026-07-17",
  "typeJournee": "JOURNEE",
  "priorite": "NORMALE",
  "motif": "Vacances annuelles"
}
```

Field rules:

| Field | Type | Required | Notes |
|---|---|---|---|
| `idConfigAbsence` | integer | yes | Must come from `/absences/config` |
| `dateDebutAbsence` | date | yes | ISO date `YYYY-MM-DD` |
| `dateFinAbsence` | date | yes | Must be greater than or equal to start date |
| `typeJournee` | string | no | `JOURNEE`, `MATIN`, `APRES_MIDI` |
| `priorite` | string | no | `BASSE`, `NORMALE`, `HAUTE` |
| `motif` | string | no | Optional reason, max 500 chars |

Response `201 Created`:

```json
{
  "success": true,
  "message": "Demande enregistrée. Le manager sera notifié.",
  "data": {
    "id": 1,
    "idConfigAbsence": 1,
    "idUserDemandeur": 3,
    "dateDemande": "2026-05-26T10:00:00.000Z",
    "dateDebutAbsence": "2026-07-15",
    "dateFinAbsence": "2026-07-17",
    "typeJournee": "JOURNEE",
    "priorite": "NORMALE",
    "motif": "Vacances annuelles",
    "statut": "ATTENTE",
    "nombreJours": 3,
    "commentaireValidateur": null,
    "configAbsence": {
      "id": 1,
      "typeAbsence": "CONGE",
      "libelle": "Congé annuel",
      "joursAutorises": 30,
      "estActif": true
    },
    "demandeur": {
      "id": 3,
      "nom": "EmployeTest",
      "prenom": "Un",
      "email": "employe@test.mg",
      "idManager": 2
    }
  }
}
```

Important validation rules:

- The start date cannot be before today.
- The end date must be on or after the start date.
- Overlapping requests are rejected.
- Some leave types require a minimum advance notice.
- `OFF` requests are limited by a monthly quota.

Error cases:

| Status | Cause |
|---|---|
| `400` | Invalid date or missing field |
| `401` | No or invalid token |
| `409` | Overlapping request or quota exceeded |

### GET `/absences/mes-demandes`

Returns the leave requests of the connected user.

Optional query params:

| Query | Type | Notes |
|---|---|---|
| `statut` | string | `ATTENTE`, `VALIDE`, `REFUSE` |
| `mois` | number | 1 to 12 |
| `annee` | number | Year, minimum 1970 |

Example:

```http
/absences/mes-demandes?statut=ATTENTE&mois=7&annee=2026
```

### GET `/absences/equipe`

Returns leave requests for the manager's team.

Required permission: `VALIDER_CONGE`

Optional query params are the same as `/absences/mes-demandes`.

### PATCH `/absences/:id/validation`

Validates or refuses a leave request.

Required permission: `VALIDER_CONGE`

URL param:

- `id`: absence request ID

Request body:

```json
{
  "statut": "VALIDE",
  "commentaireValidateur": "Approuvé, merci de prévenir l'équipe."
}
```

Response `200 OK`:

```json .......
{
  "success": true,
  "message": "Demande mise à jour",
  "data": {
    "id": 1,
    "statut": "VALIDE",
    "commentaireValidateur": "Approuvé, merci de prévenir l'équipe.",
    "updatedAt": "2026-05-26T11:30:00.000Z"
  }
}
```

Error cases:

| Status | Cause |
|---|---|
| `401` | No or invalid token |
| `403` | User lacks `VALIDER_CONGE` |
| `404` | Absence not found |

---

## Suggested frontend screens

1. Login page, which stores token and hydrates the `AuthProvider`.
2. Leave request form, which loads `/absences/config` first.
3. My requests page, which uses `/absences/mes-demandes`.
4. Team approval page for managers, which uses `/absences/equipe` and `PATCH /absences/:id/validation`.

## Permission summary

| Permission | Typical use |
|---|---|
| `SOUMETTRE_DEMANDE` | Submit a leave request |
| `VALIDER_CONGE` | View team requests and validate them |
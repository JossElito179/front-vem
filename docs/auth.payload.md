# Auth — Frontend Integration Guide

Base URL: `http://localhost:3000/api`

All protected routes require: `Authorization: Bearer <token>`

All responses use the standard envelope:

```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": {}
}
```

On errors:

```json
{
  "success": false,
  "error": "Short error message",
  "details": []
}
```

`details` is present mainly for validation errors on `400`.

---

## What the frontend should store

The login endpoint returns a JWT token and the current user profile. The recommended frontend state is:

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

Suggested persistence:

- Save the token in `localStorage` under a single key like `auth_token`.
- Optionally keep `user` in memory or also cache it if your app needs fast reloads.
- On app startup, restore the token and call `GET /auth/me` to rebuild the session.

---

## AuthProvider flow

This backend is compatible with a simple provider flow:

1. On mount, read the token from storage.
2. If a token exists, call `GET /auth/me`.
3. If `GET /auth/me` succeeds, hydrate `user` and set `isAuthenticated = true`.
4. If it fails with `401`, clear storage and redirect to login.
5. On login, save `data.token`, store `data.user`, then redirect to the app.
6. On logout, remove the token and clear the auth state.

If your frontend uses an Axios client, add an interceptor that injects the token:

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

## POST `/auth/register`

Creates a new user account. In practice this is usually admin-only at the UI level.

**Request body**

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
| `nom` | string | 2 to 80 chars |
| `prenom` | string | 2 to 80 chars |
| `email` | string | Must be unique |
| `motDePasse` | string | At least 8 chars |
| `dateEmbauche` | date (YYYY-MM-DD) | Required |
| `idRang` | integer | Must exist in DB |

Optional fields:

| Field | Type | Notes |
|---|---|---|
| `telephone` | string | Max 20 chars |
| `dateNaissance` | date | ISO date |
| `salaire` | number | Decimal accepted |
| `idPoste` | integer | FK to poste |
| `idManager` | integer | FK to another user |
| `intitulePersonnalise` | string | Free label for custom job title |

**201 Created**

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
- This endpoint does not return a token, so the usual flow is: register -> redirect to login -> login -> hydrate `AuthProvider`.

Error cases:

| Status | Cause |
|---|---|
| `400` | Missing or invalid field |
| `409` | Email already exists |

---

## POST `/auth/login`

Use this endpoint to authenticate and initialize the `AuthProvider`.

**Request body**

```json
{
  "email": "admin@test.mg",
  "motDePasse": "Test1234!"
}
```

**200 OK**

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
        "CREER_TACHE",
        "GERER_BONUS_PENALITE",
        "GERER_UTILISATEURS",
        "POINTER_PRESENCE",
        "SOUMETTRE_DEMANDE",
        "VALIDER_CONGE",
        "VOIR_EQUIPE_COMPLETE",
        "VOIR_EQUIPE_PROPRE",
        "VOIR_SALAIRES",
        "VOIR_SES_DONNEES",
        "VOIR_STATS_GLOBALES"
      ]
    }
  }
}
```

What the frontend should do with this response:

- save `data.token`
- store `data.user`
- use `data.user.permissions` to show or hide protected UI blocks
- navigate to the app shell after login

Error cases:

| Status | Cause |
|---|---|
| `400` | Missing email or motDePasse |
| `401` | Wrong credentials or inactive user |

---

## GET `/auth/me`

Returns the current user profile from the JWT session.

**Headers**

```http
Authorization: Bearer <token>
```

**200 OK**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": 1,
    "nom": "AdminTest",
    "prenom": "Un",
    "email": "admin@test.mg",
    "dateEmbauche": "2024-01-01",
    "estActif": true,
    "rang": {
      "id": 1,
      "niveau": 1,
      "libelle": "Manager général",
      "permissions": [
        {
          "code": "CREER_TACHE"
        }
      ]
    },
    "poste": null,
    "manager": {
      "id": 2,
      "nom": "Boss",
      "prenom": "Marie",
      "email": "boss@test.mg"
    },
    "permissions": ["CREER_TACHE", "GERER_BONUS_PENALITE", "..."]
  }
}
```

Use cases on the frontend:

- session bootstrap after reload
- route guarding
- permission-based navigation
- displaying the current user in the layout header

Error cases:

| Status | Cause |
|---|---|
| `401` | No token, expired token, or malformed token |
| `404` | User not found or inactive |

---

## Recommended AuthProvider contract

Minimal interface for the frontend:

```ts
type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, motDePasse: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};
```

Suggested `RegisterPayload`:

```ts
type RegisterPayload = {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  dateEmbauche: string;
  idRang: number;
  telephone?: string | null;
  dateNaissance?: string | null;
  salaire?: number | null;
  idPoste?: number | null;
  idManager?: number | null;
  intitulePersonnalise?: string | null;
};
```

---

## Permission codes reference

Use `data.user.permissions` to conditionally enable or hide routes, menus, and actions.

| Code | Who has it | What it unlocks |
|---|---|---|
| `VOIR_SES_DONNEES` | Everyone | Own profile, own presence, own tasks |
| `POINTER_PRESENCE` | Everyone | Clock in / clock out |
| `SOUMETTRE_DEMANDE` | Everyone | Submit leave requests |
| `VOIR_EQUIPE_PROPRE` | Manager + Admin | Team presence, team tasks, team bonus view |
| `VOIR_EQUIPE_COMPLETE` | Admin only | All-team overview, bulk bonus calculation |
| `VALIDER_CONGE` | Manager + Admin | Approve/refuse leave requests |
| `CREER_TACHE` | Manager + Admin | Assign tasks |
| `GERER_BONUS_PENALITE` | Manager + Admin | Calculate and manage bonuses |
| `VOIR_SALAIRES` | Manager + Admin | Salary figures |
| `VOIR_STATS_GLOBALES` | Admin only | Global statistics |
| `GERER_UTILISATEURS` | Admin only | Register new users |

---

## Practical frontend checklist

Before wiring the `AuthProvider`, make sure the frontend does these four things:

1. Attach the token to every protected request.
2. Call `GET /auth/me` on app start if a token exists.
3. Treat `data.user.permissions` as the source of truth for UI access.
4. Clear the auth state immediately on `401`.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import authApi from "./auth.api";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../utils/constant";

export type AuthUser = {
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

export type RegisterPayload = {
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

type AuthResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type LoginData = {
  token: string;
  user: AuthUser;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const persistSession = (nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  };

  const handleExpiredSession = () => {
    clearSession();
    toast.error("token session expiré", {
      position: "top-center",
    });
    navigate("/", { replace: true });
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!storedToken) {
      clearSession();
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.get<AuthResponse<AuthUser>>("/auth/me");
      const nextUser = response.data.data;

      setToken(storedToken);
      setUser(nextUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleExpiredSession();
        return;
      }

      clearSession();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, motDePasse: string) => {
    const response = await authApi.post<AuthResponse<LoginData>>(
      "/auth/login",
      {
        email,
        motDePasse,
      },
    );

    const { token: nextToken, user: nextUser } = response.data.data;
    persistSession(nextToken, nextUser);
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);

    try {
      await authApi.post<AuthResponse<unknown>>("/auth/register", payload);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = readStoredUser();

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(storedUser);
    }

    if (!storedToken) {
      setLoading(false);
      return;
    }

    void refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout: clearSession,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

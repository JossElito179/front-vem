import axios from "axios";

export const API_BASE_URL = "http://localhost:3000/api";
export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem(AUTH_TOKEN_KEY);

	if (token) {
		config.headers = config.headers ?? {};
		(config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
	}

	return config;
});
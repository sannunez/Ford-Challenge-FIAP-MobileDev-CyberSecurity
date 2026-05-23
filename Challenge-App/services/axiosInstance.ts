import axios, { type InternalAxiosRequestConfig } from "axios";
import { getToken, fetchAndStoreToken } from "./authService";

export const BASE_URL = "http://10.0.2.2:8080";

interface RetryableRequest extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RetryableRequest;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await fetchAndStoreToken();
            const token = await getToken();
            if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api.request(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

import * as SecureStore from "expo-secure-store";
import axios from "axios";

const AUTH_URL = "http://10.0.2.2:8080/auth/token";
const APP_KEY = "ford-challenge-2026";
const TOKEN_KEY = "auth_token";

export async function initializeAuth(): Promise<void> {
    const existing = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!existing) {
        await fetchAndStoreToken();
    }
}

export async function fetchAndStoreToken(): Promise<void> {
    try {
        const response = await axios.post<{ token: string }>(AUTH_URL, { appKey: APP_KEY });
        await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
    } catch {
        // Token fetch failed; app will retry automatically on first 401 response
    }
}

export async function getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

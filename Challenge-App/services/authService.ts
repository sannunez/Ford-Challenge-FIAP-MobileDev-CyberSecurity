import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { Platform } from "react-native";

const AUTH_URL = `${Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080"}/auth/token`;
const APP_KEY = "ford-challenge-2026";
const TOKEN_KEY = "auth_token";

// expo-secure-store não tem implementação web — usa localStorage como fallback
async function saveToken(value: string): Promise<void> {
    if (Platform.OS === "web") {
        localStorage.setItem(TOKEN_KEY, value);
    } else {
        await SecureStore.setItemAsync(TOKEN_KEY, value);
    }
}

async function loadToken(): Promise<string | null> {
    if (Platform.OS === "web") {
        return localStorage.getItem(TOKEN_KEY);
    }
    return SecureStore.getItemAsync(TOKEN_KEY);
}

async function removeToken(): Promise<void> {
    if (Platform.OS === "web") {
        localStorage.removeItem(TOKEN_KEY);
    } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
}

export async function initializeAuth(): Promise<void> {
    const existing = await loadToken();
    if (!existing) {
        await fetchAndStoreToken();
    }
}

export async function fetchAndStoreToken(): Promise<void> {
    try {
        const response = await axios.post<{ token: string }>(AUTH_URL, { appKey: APP_KEY });
        await saveToken(response.data.token);
    } catch {
        // Token fetch failed; app will retry automatically on first 401 response
    }
}

export async function getToken(): Promise<string | null> {
    return loadToken();
}

export async function clearToken(): Promise<void> {
    await removeToken();
}

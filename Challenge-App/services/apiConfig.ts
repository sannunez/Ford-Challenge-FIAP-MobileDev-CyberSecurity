import { Platform } from "react-native";

const LOCAL_API_URL = Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || LOCAL_API_URL).replace(/\/$/, "");

// EXPO_PUBLIC values are bundled into the app and must never contain real secrets.
export const APP_KEY = process.env.EXPO_PUBLIC_APP_KEY || "ford-challenge-development-key";


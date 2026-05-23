import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@saved_cars";

export interface SavedCar {
    id: number;
    make: string;
    model: string;
    trim: string;
    type: string;
    year: number;
}

function isValidCar(item: unknown): item is SavedCar {
    if (typeof item !== "object" || item === null) return false;
    const car = item as Record<string, unknown>;
    return (
        typeof car.id === "number" &&
        typeof car.make === "string" &&
        typeof car.model === "string" &&
        typeof car.trim === "string" &&
        typeof car.type === "string" &&
        typeof car.year === "number"
    );
}

function isValidCarArray(data: unknown): data is SavedCar[] {
    return Array.isArray(data) && data.every(isValidCar);
}

export async function getSavedCarsStorage(): Promise<SavedCar[]> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        return isValidCarArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export async function saveCarsStorage(data: SavedCar[]): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // State is preserved in memory; storage failure is non-fatal
    }
}

export async function clearCarsStorage(): Promise<void> {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
        // State is cleared in memory; storage failure is non-fatal
    }
}

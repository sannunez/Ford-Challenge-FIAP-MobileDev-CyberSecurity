import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@saved_cars";

export async function getSavedCarsStorage() {
    const storage = await AsyncStorage.getItem(STORAGE_KEY);

    if (!storage) return [];

    return JSON.parse(storage);
}

export async function saveCarsStorage(data: any) {
    await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}

export async function clearCarsStorage() {
    await AsyncStorage.removeItem(STORAGE_KEY);
}
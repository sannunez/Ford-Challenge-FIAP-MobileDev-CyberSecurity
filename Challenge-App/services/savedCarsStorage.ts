import AsyncStorage
from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@saved_cars";

export async function getSavedCarsStorage() {

    try {

        const storage =
            await AsyncStorage.getItem(
                STORAGE_KEY
            );

        console.log(
            "STORAGE LIDO:",
            storage
        );

        if (!storage) {
            return [];
        }

        return JSON.parse(storage);

    } catch (error) {

        console.log(
            "ERRO AO LER STORAGE:",
            error
        );

        return [];
    }
}

export async function saveCarsStorage(
    data: any
) {

    try {

        console.log(
            "SALVANDO STORAGE:",
            data
        );

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

        console.log(
            "STORAGE SALVO COM SUCESSO"
        );

    } catch (error) {

        console.log(
            "ERRO AO SALVAR STORAGE:",
            error
        );
    }
}

export async function clearCarsStorage() {

    try {

        await AsyncStorage.removeItem(
            STORAGE_KEY
        );

        console.log(
            "STORAGE LIMPO"
        );

    } catch (error) {

        console.log(
            "ERRO AO LIMPAR STORAGE:",
            error
        );
    }
}
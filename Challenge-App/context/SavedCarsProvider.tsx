import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSavedCarsStorage, saveCarsStorage, clearCarsStorage, type SavedCar } from "../services/savedCarsStorage";

interface SavedCarsContextData {
    savedCars: SavedCar[];
    saveCar: (car: SavedCar) => void;
    removeCar: (id: number) => void;
    clearSavedCars: () => void;
    isSaved: (id: number) => boolean;
}

const SavedCarsContext = createContext({} as SavedCarsContextData);

export function SavedCarsProvider({ children }: React.PropsWithChildren) {
    const [savedCars, setSavedCars] = useState<SavedCar[]>([]);

    useEffect(() => {
        loadCars();
    }, []);

    async function loadCars() {
        const data = await getSavedCarsStorage();
        setSavedCars(data);
    }

    const saveCar = useCallback((car: SavedCar) => {
        setSavedCars((prevCars) => {
            const alreadySaved = prevCars.some((item) => item.id === car.id);
            if (alreadySaved) return prevCars;
            const updatedCars = [...prevCars, car];
            saveCarsStorage(updatedCars);
            return updatedCars;
        });
    }, []);

    const removeCar = useCallback((id: number) => {
        setSavedCars((prevCars) => {
            const updatedCars = prevCars.filter((car) => car.id !== id);
            saveCarsStorage(updatedCars);
            return updatedCars;
        });
    }, []);

    const clearSavedCars = useCallback(async () => {
        setSavedCars([]);
        await clearCarsStorage();
    }, []);

    const isSaved = useCallback((id: number) => {
        return savedCars.some((car) => car.id === id);
    }, [savedCars]);

    const value = useMemo(() => ({
        savedCars,
        saveCar,
        removeCar,
        clearSavedCars,
        isSaved,
    }), [savedCars, saveCar, removeCar, clearSavedCars, isSaved]);

    return (
        <SavedCarsContext.Provider value={value}>
            {children}
        </SavedCarsContext.Provider>
    );
}

export function useSavedCars() {
    return useContext(SavedCarsContext);
}

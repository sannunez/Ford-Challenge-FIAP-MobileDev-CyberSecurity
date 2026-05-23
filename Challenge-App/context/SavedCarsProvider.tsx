import React, { createContext, useContext, useEffect, useState } from "react";
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

    function saveCar(car: SavedCar) {
        setSavedCars((prevCars) => {
            const alreadySaved = prevCars.some((item) => item.id === car.id);
            if (alreadySaved) return prevCars;
            const updatedCars = [...prevCars, car];
            saveCarsStorage(updatedCars);
            return updatedCars;
        });
    }

    function removeCar(id: number) {
        setSavedCars((prevCars) => {
            const updatedCars = prevCars.filter((car) => car.id !== id);
            saveCarsStorage(updatedCars);
            return updatedCars;
        });
    }

    async function clearSavedCars() {
        setSavedCars([]);
        await clearCarsStorage();
    }

    function isSaved(id: number) {
        return savedCars.some((car) => car.id === id);
    }

    return (
        <SavedCarsContext.Provider value={{ savedCars, saveCar, removeCar, clearSavedCars, isSaved }}>
            {children}
        </SavedCarsContext.Provider>
    );
}

export function useSavedCars() {
    return useContext(SavedCarsContext);
}

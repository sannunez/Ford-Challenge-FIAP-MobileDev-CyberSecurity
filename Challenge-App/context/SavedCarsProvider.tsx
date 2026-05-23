import {createContext, useContext, useEffect, useState} from "react";

import {getSavedCarsStorage, saveCarsStorage, clearCarsStorage} from "../services/savedCarsStorage";

interface Car {
    id: number;
    make: string;
    model: string;
    trim: string;
    type: string;
    year: number;
}

interface SavedCarsContextData {
    savedCars: Car[];

    saveCar: (car: Car) => void;

    removeCar: (id: number) => void;

    clearSavedCars: () => void;

    isSaved: (id: number) => boolean;
}

const SavedCarsContext = createContext({} as SavedCarsContextData);

export function SavedCarsProvider({children}: any) {
    const [savedCars, setSavedCars] = useState<Car[]>([]);

    useEffect(() => {
        loadCars();
    }, []);

    async function loadCars() {
        const data = await getSavedCarsStorage();

        setSavedCars(data);
    }

    function saveCar(car: Car) {

    setSavedCars((prevCars) => {

        const alreadySaved =
            prevCars.some(
                (item) => item.id === car.id
            );

        if (alreadySaved) {
            return prevCars;
        }

        const updatedCars = [
            ...prevCars,
            car,
        ];

        saveCarsStorage(updatedCars);

        return updatedCars;
    });
}

    function removeCar(id: number) {

    setSavedCars((prevCars) => {

        const updatedCars =
            prevCars.filter(
                (car) => car.id !== id
            );

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
        <SavedCarsContext.Provider
            value={{
                savedCars,
                saveCar,
                removeCar,
                clearSavedCars,
                isSaved,
            }}
        >
            {children}
        </SavedCarsContext.Provider>
    );
}

export function useSavedCars() {
    return useContext(SavedCarsContext);
}
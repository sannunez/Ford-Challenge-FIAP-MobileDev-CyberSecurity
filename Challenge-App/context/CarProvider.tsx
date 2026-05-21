import { createContext, useContext, useState, ReactNode } from "react";

type CarContextType = {
    selectedCarId: number | null;
    setSelectedCarId: (id: number) => void;
};

type CarProviderProps = {
    children: ReactNode;
};

const CarContext = createContext({} as CarContextType);

export function CarProvider({ children } : CarProviderProps){
    const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

    return(
        <CarContext.Provider
            value={{
                selectedCarId,
                setSelectedCarId
            }}
        >
            {children}
        </CarContext.Provider>
    )
};

export function useCar(){
    return useContext(CarContext)
}
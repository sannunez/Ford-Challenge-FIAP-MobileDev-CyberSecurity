import type { CarDetailsDTO } from "../interface/CarDetailsDTO";
import api from "../services/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchCarDetails = async (id: number): Promise<CarDetailsDTO> => {
    const response = await api.get<CarDetailsDTO>(`/cars/${id}`);
    return response.data;
};

export function getCarDetails(id: number) {
    // Guard: only sends request if ID is a positive integer — prevents malformed API calls
    const isValidId = Number.isInteger(id) && id > 0;

    return useQuery({
        queryFn: () => fetchCarDetails(id),
        queryKey: ["car-details", id],
        enabled: isValidId,
        retry: 2
    });
}

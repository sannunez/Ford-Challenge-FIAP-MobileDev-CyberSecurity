import type { CarTruckResponse } from "../interface/CarTruckResponse";
import api from "../services/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchCars = async (pageParam: number = 1, filter?: string): Promise<CarTruckResponse> => {
    const url = filter
        ? `/cars?page=${pageParam}&${filter}`
        : `/cars?page=${pageParam}`;

    const response = await api.get<CarTruckResponse>(url);
    return response.data;
};

export function getCarTruck(filter?: string) {
    return useInfiniteQuery({
        queryKey: ["car-data", filter],
        queryFn: ({ pageParam }) => fetchCars(pageParam, filter),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.data || lastPage.data.length === 0) {
                return undefined;
            }
            return allPages.length + 1;
        },
        retry: 2
    });
}

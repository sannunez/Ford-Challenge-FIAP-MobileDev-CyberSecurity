import type { CarTruckResponse } from "../interface/CarTruckResponse";
import axios from "axios";

import { useInfiniteQuery } from "@tanstack/react-query";

const API_URL = "http://10.0.2.2:8080/cars";

const fetchCars = async (pageParam: number = 1,filter?: string): Promise<CarTruckResponse> => {

    const url = filter
        ? `${API_URL}?page=${pageParam}&${filter}`
        : `${API_URL}?page=${pageParam}`;

    const response = await axios.get<CarTruckResponse>(url);

    return response.data;
};

export function getCarTruck(filter?: string) {

    return useInfiniteQuery({

        queryKey: ['car-data', filter],

        queryFn: ({ pageParam }) =>
            fetchCars(pageParam, filter),

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
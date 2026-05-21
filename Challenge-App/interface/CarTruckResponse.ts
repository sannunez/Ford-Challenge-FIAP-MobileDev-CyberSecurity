import { CarTruckDTO } from "./CarTruckDTO";
import { CollectionDTO } from "./CollectionDTO";

export interface CarTruckResponse {
    collection: CollectionDTO;
    data: CarTruckDTO[];
}
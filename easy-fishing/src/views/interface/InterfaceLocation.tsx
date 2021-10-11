import { Coordinates } from "./InterfaceCoordinates";

export interface Location {
    id: string,
    coordinates: Coordinates,
    title: string,
    description: string,
    date: string,
    publicLocation: boolean,
}
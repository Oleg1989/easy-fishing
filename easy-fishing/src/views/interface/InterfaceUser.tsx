import { Location } from "./InterfaceLocation";

export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    locations: Location[],
}
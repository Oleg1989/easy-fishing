import { Location } from "./InterfaceLocation";

export interface UserApp {
    name: string,
    email: string,
    password: string,
    locations: { [key: string]: Location },
}
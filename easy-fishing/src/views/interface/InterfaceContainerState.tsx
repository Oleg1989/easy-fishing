import { User } from './InterfaceUser';
import { Location } from './InterfaceLocation';

export interface ContainerState {
    isAuthenticated: boolean;
    flagAddLocation: boolean;
    user: User | null;
    publicLocations: Location[];
    status: 'idle' | 'loading' | 'failed';
}
import { UserApp } from './InterfaceUserApp';
import { Location } from './InterfaceLocation';

export interface ContainerState {
    uId: string | null;
    uIdStatus: string;
    isAuthenticated: boolean;
    isAuthenticatedStatus: string;
    flagAddLocation: boolean;
    flagAddLocationStatus: string;
    user: UserApp | null;
    userStatus: string;
    publicLocations: Location[];
    publicLocationsStatus: string;
    showError: boolean;
    showErrorStatus: string;
    errorMessage: string;
    errorMessageStatus: string;
}
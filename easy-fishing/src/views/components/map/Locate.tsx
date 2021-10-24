import { InterfaceSearchProps } from "../../interface/InterfaceSearchProps";
import compass from '../../../compass.svg';

export const Locate = (panTo: InterfaceSearchProps) => {
    return (
        <div className="absolute top-2 right-16 z-10" title="Geolocation">
            <button onClick={() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        panTo.panTo({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    () => null,
                );
            }}>
                <img src={compass} alt="Compass - locate me" className="w-10 h-10" />
            </button>
        </div>
    )
}
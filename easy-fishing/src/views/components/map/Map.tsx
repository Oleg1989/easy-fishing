import { useCallback, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Search } from './Search';
import { Locate } from './Locate';
import { Location } from '../../interface/InterfaceLocation';
import { FormInputData } from '../../interface/InterfaceFormInputData';
import {
    selectFlagAddLocation,
    selectUserLocations,
    selectPublicLocations,
    selectUId,
    selectIsAuthenticated,
    showModal,
    isMessage,
    isError
} from '../../containerSlice';
import cuid from 'cuid';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { FormAddLocation } from '../forms/FormAddLocation';
import { NewLocationMap } from '../../interface/InterfaceNewLocationMap';
import { Coordinates } from '../../interface/InterfaceCoordinates';
import { FormUpdateLocation } from '../forms/FormUpdateLocation';
import { addLocathinDatabase, deleteLocathinDatabase } from '../../containerAPI';
import { SelectMenu } from './SelectMenu';
import "@reach/combobox/styles.css";

//Google map settings
const containerStyle = {
    width: '100%',
    height: '91.5vh'

};
const libraries: ["places"] = ["places"];
// let options: { styles: [] | null } = {
//     styles: null,
// }
let center: Coordinates;
const userCenter = (): void => {

    navigator.geolocation.getCurrentPosition(
        (position) => {
            center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
        }
    )
}
userCenter();

export const Map: React.FC = () => {
    const dispatch = useAppDispatch();

    const flagAddLocation = useAppSelector(selectFlagAddLocation);
    const userLocations = useAppSelector(selectUserLocations);
    const publicLocations = useAppSelector(selectPublicLocations);
    const uId = useAppSelector(selectUId);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [selected, setSelected] = useState<Location | null>(null);
    const [showModalAddLocation, setShowModalAddLocation] = useState<boolean>(false);
    const [formInputData, setFormInputData] = useState<FormInputData>({
        title: '',
        description: '',
        date: new Date(),
        publicLocation: false,
    });
    const [newLocation, setNewLocation] = useState<NewLocationMap | null>(null);
    const [updateLocationUser, setUpdateLocationUser] = useState<Location>();
    const [options, setOptions] = useState<{ styles: any | null }>({ styles: JSON.parse(localStorage.getItem('mapStyle')!) });

    const error = (message: string) => {
        dispatch(isMessage(message));
        dispatch(isError());
    }

    let locations: Location[] = [];
    for (let key in userLocations) {
        locations.push(userLocations[key]);
    }

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_KEY}`,
        libraries,
    })
    const mapRef = useRef<google.maps.Map>();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);
    const panTo = useCallback(({ lat, lng }: { lat: number, lng: number }) => {
        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(15);
    }, []);

    const deleteLocation = (id: string) => {
        dispatch(deleteLocathinDatabase({ userId: uId!, locationId: id, error: error }));
    }
    const updateLocation = (id: string) => {
        dispatch(showModal())
        const location = locations.find((loc) => loc.id === id);
        setUpdateLocationUser(location);
    }

    const addLocation = useCallback(() => {
        if (!formInputData.title || !formInputData.description) {
            return;
        }
        dispatch(addLocathinDatabase(
            {
                location: {
                    id: newLocation!.id,
                    coordinates: newLocation!.coordinates,
                    title: formInputData.title,
                    description: formInputData.description,
                    date: formInputData.date.toLocaleString("en-US", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long',
                    }),
                    publicLocation: formInputData.publicLocation,
                },
                uId: uId!,
            }
        ));
        setFormInputData({
            title: '',
            description: '',
            date: new Date(),
            publicLocation: false,
        });

    }, [formInputData, newLocation, dispatch, uId]);

    const onMapClick = useCallback((event) => {
        if (flagAddLocation) {
            setShowModalAddLocation(true);
            setNewLocation(
                {
                    id: cuid(),
                    coordinates: {
                        lat: event.latLng!.lat(),
                        lng: event.latLng!.lng(),
                    }
                }
            );
        }
        return;
    }, [flagAddLocation]);

    if (loadError) return <h1>Error loading maps!</h1>;
    if (!isLoaded) return <h1>Loading maps</h1>;

    return (
        <div className="relative">

            <Search panTo={panTo} />
            <Locate panTo={panTo} />
            <SelectMenu setOptions={setOptions} />
            <FormAddLocation
                showModal={showModalAddLocation}
                setShowModal={setShowModalAddLocation}
                formInputData={formInputData}
                setFormInputData={setFormInputData}
                addLocation={addLocation}
            />
            <FormUpdateLocation
                updateLocationUser={updateLocationUser!}
                setUpdateLocationUser={setUpdateLocationUser}
            />

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                options={options}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
                {locations.length !== 0 ? locations.map(location => {
                    return <Marker
                        key={location.id}
                        position={{
                            lat: +location.coordinates.lat,
                            lng: +location.coordinates.lng,
                        }}
                        onClick={() => {
                            setSelected(location);
                        }}
                    />
                }) : publicLocations.map(location => {
                    return <Marker
                        key={location.id}
                        position={{
                            lat: +location.coordinates.lat,
                            lng: +location.coordinates.lng,
                        }}
                        onClick={() => {
                            setSelected(location);
                        }}
                    />
                })}

                {selected ? (<InfoWindow
                    position={{
                        lat: +selected.coordinates.lat,
                        lng: +selected.coordinates.lng,
                    }}
                    onCloseClick={() => {
                        setSelected(null);
                    }
                    }
                >
                    <div id={selected.id} className=" relative w-full bg-white rounded shadow-lg transitionOpacity transitionTransform duration-300">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-600">{selected.title}</h2>
                        </div>
                        <div className="w-full p-3">
                            <p><b>Description:</b> {selected.description}</p>
                        </div>
                        <div className="border-gray-200 w-full p-3">
                            <p><b>Date:</b> {selected.date}</p>
                        </div>
                        <div className="border-gray-200 w-full p-3">
                            <p>
                                <b>Status:</b> {selected.publicLocation === true ? 'Publicly' : 'Private'}</p>
                        </div>
                        <div>
                            {isAuthenticated ? <>
                                <button
                                    className="text-indigo-600 hover:text-indigo-900 m-5"
                                    onClick={(event) => {
                                        updateLocation((event.target as HTMLElement).parentElement?.parentElement?.id!);
                                        setSelected(null);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-900 m-5"
                                    onClick={(event) => {
                                        deleteLocation((event.target as HTMLElement).parentElement?.parentElement?.id!);
                                        setSelected(null);
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className="text-yellow-600 hover:text-yellow-900 m-5"
                                    onClick={() => {
                                        setSelected(null);
                                    }}
                                >
                                    Close
                                </button>
                            </> : null}
                        </div>
                    </div>
                </InfoWindow>) : null}

            </GoogleMap>
        </div >
    )
}
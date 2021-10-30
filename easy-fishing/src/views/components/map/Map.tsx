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
    selectMapStyle
} from '../../containerSlice';
import cuid from 'cuid';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { FormAddLocation } from '../forms/FormAddLocation';
import { NewLocationMap } from '../../interface/InterfaceNewLocationMap';
import { Coordinates } from '../../interface/InterfaceCoordinates';
import { FormUpdateLocation } from '../forms/FormUpdateLocation';
import { addLocathinDatabase } from '../../containerAPI';
import "@reach/combobox/styles.css";
import { Delete } from '../delete/Delete';

//Google map settings
const containerStyle = {
    width: '100%',
    height: '91vh'

};
const libraries: ["places"] = ["places"];
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
    const options = useAppSelector(selectMapStyle);

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
    const [search, setSearch] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [locationId, setLocationId] = useState<string>('');

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
            <div
                className="w-5 absolute  top-14 right-7 z-10 cursor-pointer"
                title="Search"
                onClick={() => {
                    setSearch(true);
                }}
            >
                <i className="fa fa-search text-blue-900 hover:text-gray-500 ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </i>
            </div>
            {search ? <Search panTo={panTo} setSearch={setSearch} /> : null}
            <Locate panTo={panTo} />
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
            {showDelete ? <Delete
                setShowDelete={setShowDelete}
                locationId={locationId}
            /> : null}

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                options={{ styles: options }}
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
                    <div id={selected.id} className="relative max-w-xs rounded-md shadow-lg z-20 break-words">
                        <div className="px-4 py-3 border-b border-gray-300">
                            <h2 className="text-xl font-semibold text-gray-600">Name</h2>
                        </div>
                        <div className="p-3">
                            <p><b className="mr-2">Title:</b>{selected.title}</p>
                        </div>
                        <div className="p-3">
                            <p><b className="mr-2">Description:</b>{selected.description}</p>
                        </div>
                        <div className="p-3">
                            <p><b className="mr-2">Date:</b>{selected.date}</p>
                        </div>
                        <div className="p-3">
                            <p>
                                <b className="mr-2">Status:</b>{selected.publicLocation === true ? 'Publicly' : 'Private'}</p>
                        </div>
                        <div className="flex justify-between">
                            {isAuthenticated ? <>
                                <button
                                    className="text-indigo-600 hover:text-indigo-900 m-3"
                                    onClick={(event) => {
                                        updateLocation((event.target as HTMLElement).parentElement?.parentElement?.id!);
                                        setSelected(null);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600 hover:text-red-900 m-3"
                                    onClick={(event) => {
                                        setShowDelete(true);
                                        setLocationId((event.target as HTMLElement).parentElement?.parentElement?.id!);
                                        setSelected(null);
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className="text-yellow-600 hover:text-yellow-900 m-3"
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
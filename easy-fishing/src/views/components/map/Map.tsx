import { useCallback, useRef, useState } from 'react';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import "@reach/combobox/styles.css";
import mapStyles from './mapStyles';
import { Search } from './Search';
import { Locate } from './Locate';
import { Location } from '../../interface/InterfaceLocation';
import { selectFlagAddLocation } from '../../containerSlice';

import cuid from 'cuid';
import { useAppSelector } from '../../../app/hooks';
import { FormAddLocation } from '../forms/FormAddLocation';

const containerStyle = {
    width: '100%',
    height: '91.5vh'
};

const center = {
    lat: 49.2348249,
    lng: 28.3995944,
};

const libraries: ["places"] = ["places"];


const options = {
    styles: mapStyles,
}

export const Map: React.FC = () => {

    const flagAddLocation = useAppSelector(selectFlagAddLocation);

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

    const [locations, setLocation] = useState<Location[]>([]);

    const [selected, setSelected] = useState<Location | null>(null);

    const [showModal, setShowModal] = useState<boolean>(false);

    const onMapClick = useCallback((event) => {
        if (flagAddLocation) {
            setShowModal(true);
            setLocation((current) => [
                ...current,
                {
                    id: cuid(),
                    coordinates: {
                        lat: event.latLng!.lat(),
                        lng: event.latLng!.lng(),
                    },
                    title: 'New market',
                    description: 'Description string Description string Description string Description string Description string Description string Description string Description string Description string Description string Description string Description string',
                    date: new Date().toLocaleString("en-US", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long',
                    }),
                    publicLocation: false,
                }
            ]);
        }
        return;
    }, [flagAddLocation]);

    if (loadError) return <h1>Error loading maps!</h1>;
    if (!isLoaded) return <h1>Loading maps</h1>;

    return (
        <div className="relative">

            <Search panTo={panTo} />
            <Locate panTo={panTo} />
            <FormAddLocation
                showModal={showModal}
                setShowModal={setShowModal}
            />

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                options={options}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
                {locations.map(location => {
                    return <Marker
                        key={location.id}
                        position={{
                            lat: location.coordinates.lat,
                            lng: location.coordinates.lng,
                        }}
                        onClick={() => {
                            setSelected(location);
                        }}
                    // icon={{
                    //     url: '../../../img/av_64.png',
                    //     scaledSize: new window.google.maps.Size(30, 30),
                    //     origin: new window.google.maps.Point(0, 0),
                    //     anchor: new window.google.maps.Point(15, 15)
                    // }}
                    />
                })}
                {selected ? (<InfoWindow
                    position={{
                        lat: selected.coordinates.lat,
                        lng: selected.coordinates.lng,
                    }}
                    onCloseClick={() => {
                        setSelected(null);
                    }
                    }
                >
                    {/* <div>
                        <h1>{selected.title}</h1>
                        <p>{selected.date}</p>
                    </div> */}
                    <div className=" relative w-full bg-white rounded shadow-lg transitionOpacity transitionTransform duration-300">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-600">{selected.title}</h2>
                        </div>
                        <div className="w-full p-3">
                            <p><b>Description:</b> {selected.description}</p>
                        </div>
                        <div className="border-gray-200 w-full p-3">
                            <p><b>Date:</b> {selected.date}</p>
                        </div>
                    </div>
                </InfoWindow>) : null}

            </GoogleMap>
        </div>
    )
}
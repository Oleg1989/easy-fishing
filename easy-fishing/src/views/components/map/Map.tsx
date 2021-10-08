import React, { useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import "@reach/combobox/styles.css";
import mapStyles from './mapStyles';
import { Search } from './Search';
import { Locate } from './Locate';

const containerStyle = {
    width: '100%',
    height: '91.5vh'
};

const center = {
    lat: 49.2348249,
    lng: 28.3995944,
};

//const libraries = ["places"];


const options = {
    styles: mapStyles,
}

export function Map() {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_KEY}`,
        libraries: ["places"],
    })

    const mapRef = useRef<google.maps.Map>();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = useCallback(({ lat, lng }: { lat: number, lng: number }) => {
        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(15);
    }, []);

    if (loadError) return <h1>Error loading maps!</h1>;
    if (!isLoaded) return <h1>Loading maps</h1>;

    return (
        <div className="relative">

            <Search panTo={panTo} />
            <Locate panTo={panTo} />

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                options={options}
                onLoad={onMapLoad}
            >
                { /* Child components, such as markers, info windows, etc. */}

            </GoogleMap>
        </div>
    )
}


// import React from "react";
// import GoogleMapReact from 'google-map-react';

// interface props {
//     lat: number,
//     lng: number,
//     text: string
// }

// const AnyReactComponent = (props: props) => <div>{props.text}</div>;

// export default function Map() {
//     const defaultProps = {
//         center: {
//             lat: 49.2348249,
//             lng: 28.3995944,
//         },
//         zoom: 11
//     };

//     return (
//         // Important! Always set the container height explicitly
//         <div style={{ height: '91.5vh', width: '100%' }}>
//             <GoogleMapReact
//                 bootstrapURLKeys={{ key: `${process.env.REACT_APP_GOOGLE_KEY}` }}
//                 defaultCenter={defaultProps.center}
//                 defaultZoom={defaultProps.zoom}
//             >
//                 <AnyReactComponent
//                     lat={49.2348249}
//                     lng={28.3995944}
//                     text="My Marker"
//                 />
//             </GoogleMapReact>
//         </div>
//     );
// }
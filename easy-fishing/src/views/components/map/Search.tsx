import React from 'react';
import
usePlacesAutocomplete,
{
    getGeocode,
    getLatLng
}
    from 'use-places-autocomplete';
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from '@reach/combobox';
import { InterfaceSearchProps } from '../../interface/InterfaceSearchProps';

export const Search = (panTo: InterfaceSearchProps) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: new google.maps.LatLng(49.2348249, 37.617300),
            radius: 200 * 1000,
        }
    });

    return (
        <div className="flex justify-center items-center z-10 absolute top-32 left-3 shadow" title="Search">
            <div className="relative">
                <Combobox onSelect={async (address) => {
                    setValue(address, false);
                    clearSuggestions();
                    try {
                        const results = await getGeocode({ address });
                        const { lat, lng } = await getLatLng(results[0]);
                        panTo.panTo({ lat, lng });
                    } catch (error) {
                        console.log('Error!');
                    }
                }}>
                    <div className="absolute top-4 left-3">
                        <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </i>
                    </div>
                    <ComboboxInput
                        className="h-12 w-94 pl-10 pr-20 z-0 focus:shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent " placeholder="Search..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={!ready}
                    />
                    <ComboboxPopover
                        className="pl-5 pr-5 rounded-lg z-0 focus:shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent ">
                        <ComboboxList>
                            {status === 'OK' &&
                                data.map(({ description }, index) => (<ComboboxOption key={index} value={description} />))}
                        </ComboboxList>
                    </ComboboxPopover>
                </Combobox>
            </div>
        </div>
    );
}
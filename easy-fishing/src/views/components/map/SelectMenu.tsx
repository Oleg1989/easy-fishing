/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import mapStyles from './mapStyles';
import { changeMapStyle } from '../../containerSlice';
import { useAppDispatch } from '../../../app/hooks';

const styles = [
    {
        id: 1,
        name: 'Default',
    },
    {
        id: 2,
        name: 'Blue Essence',
    },
    {
        id: 3,
        name: 'Map Clean',
    }
    ,
    {
        id: 4,
        name: 'Color Byte',
    }
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const SelectMenu = () => {
    const dispatch = useAppDispatch();
    const [selected, setSelected] = useState(styles[0]);

    const newStyleMap = (style: string) => {
        switch (style) {
            case 'Blue Essence':
                localStorage.setItem('mapStyle', JSON.stringify(mapStyles['Blue Essence']));
                dispatch(changeMapStyle({ newStyle: mapStyles['Blue Essence'], name: 'Blue Essence' }));
                break;
            case 'Map Clean':
                localStorage.setItem('mapStyle', JSON.stringify(mapStyles['Map Clean']));
                dispatch(changeMapStyle({ newStyle: mapStyles['Map Clean'], name: 'Map Clean' }));
                break;
            case 'Color Byte':
                localStorage.setItem('mapStyle', JSON.stringify(mapStyles['Color Byte']));
                dispatch(changeMapStyle({ newStyle: mapStyles['Color Byte'], name: 'Color Byte' }));
                break;
            default:
                localStorage.setItem('mapStyle', JSON.stringify([]));
                dispatch(changeMapStyle({ newStyle: [], name: 'Default' }));
        }
    }

    return (
        <Listbox
            value={selected}
            onChange={setSelected}
        >
            <div className="mr-5 ml-3" title="Map styles">
                <Listbox.Button
                    className="relative w-auto bg-white shadow pl-0.5 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-300 sm:text-sm"
                >
                    <span className="flex items-center">
                        <span className="ml-3 block truncate">{selected.name}</span>
                    </span>
                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </Listbox.Button>

                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options
                        className="absolute z-10 mt-1 w-auto bg-white shadow-lg max-h-56 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            newStyleMap((event.target as HTMLElement).textContent!);
                        }}
                    >
                        {styles.map((style) => (
                            <Listbox.Option
                                key={style.id}
                                className={({ active }) =>
                                    classNames(
                                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                    )
                                }
                                value={style}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <div className="flex items-center">
                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
                                                {style.name}
                                            </span>
                                        </div>

                                        {selected ? (
                                            <span
                                                className={classNames(
                                                    active ? 'text-white' : 'text-indigo-600',
                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                )}
                                            >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}

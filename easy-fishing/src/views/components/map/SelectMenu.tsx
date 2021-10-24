/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import mapStyles from './mapStyles';

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

export const SelectMenu = (
    props: {
        //Attention needs to change type any
        setOptions: (style: { styles: any | null }) => void
    }) => {
    const [selected, setSelected] = useState(styles[0]);

    const newStyleMap = (style: string) => {
        switch (style) {
            case 'Blue Essence':
                props.setOptions({ styles: mapStyles['Blue Essence'] });
                localStorage.setItem('mapStyle', JSON.stringify(mapStyles['Blue Essence']));
                break;
            case 'Map Clean':
                props.setOptions({ styles: mapStyles['Map Clean'] });
                localStorage.setItem('mapStyle', JSON.stringify(mapStyles['Map Clean']));
                break;
            case 'Color Byte':
                props.setOptions({ styles: mapStyles['Color Byte'] });
                localStorage.setItem('mapStyle', JSON.stringify(mapStyles['Color Byte']));
                break;
            default:
                props.setOptions({ styles: [] });
                localStorage.setItem('mapStyle', JSON.stringify([]));
        }
    }

    return (
        <Listbox
            value={selected}
            onChange={setSelected}
        >
            <div className="z-10 absolute top-16 right-2" title="Map styles">
                <Listbox.Button
                    className="relative w-max bg-white shadow pl-0.5 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-300 sm:text-sm"
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
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
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

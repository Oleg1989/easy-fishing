import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Link } from "react-router-dom";
import {
    isError,
    isMessage,
    selectUId,
    selectUserLocations,
    selectUser,
    showModal
} from '../containerSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import React, { useEffect, useState } from 'react';
import { Location } from '../interface/InterfaceLocation';
import { FormUpdateLocation } from '../components/forms/FormUpdateLocation';
import { getUserFromDatabase } from '../containerAPI';
import { Delete } from '../components/delete/Delete';


const navigation = [
    { name: 'User page', to: '/user/page', current: false }
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const UserPageTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const userLocations = useAppSelector(selectUserLocations);
    const uId = useAppSelector(selectUId);
    const user = useAppSelector(selectUser);

    const [updateLocationUser, setUpdateLocationUser] = useState<Location>();
    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [locationId, setLocationId] = useState<string>('');

    const error = (message: string) => {
        dispatch(isMessage(message));
        dispatch(isError());
    }

    let locations: Location[] = [];

    for (let key in userLocations) {
        locations.push(userLocations[key]);
    }

    const updateLocation = (id: string) => {
        dispatch(showModal())
        const location = locations.find((loc) => loc.id === id);
        setUpdateLocationUser(location);
    }

    useEffect(() => {
        if (user?.name === '') {
            dispatch(getUserFromDatabase({ uId: uId, error: error }));
        }
    });
    return (
        <>
            <FormUpdateLocation
                updateLocationUser={updateLocationUser!}
                setUpdateLocationUser={setUpdateLocationUser}
            />
            {showDelete ? <Delete
                setShowDelete={setShowDelete}
                locationId={locationId}
            /> : null}
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto">
                            <div className="relative flex items-center justify-between h-16">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-between">
                                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                        <div className="flex-shrink-0 flex items-center">
                                            <span className="block md:hidden h-8 w-auto text-white text-3xl ">Easy-Fishing</span>
                                            <span className="hidden md:block h-8 w-auto text-white text-3xl ml-20">Easy-Fishing</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block sm:ml-6">
                                        <div className="flex sm:block sm:ml-6 flex-auto">
                                            <div className="flex flex-auto justify-between space-x-4">
                                                <div className="flex flex-wrap content-center justify-end">
                                                    {navigation.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            to={item.to}
                                                            className={classNames(
                                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                                'px-3 py-2 rounded-md text-sm font-medium'
                                                            )}
                                                            aria-current={item.current ? 'page' : undefined}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.to}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block px-3 py-2 rounded-md text-base font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            {locations.length !== 0 ? <div className="container mx-auto p-10 max-h-screen">
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Title
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Description
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xl font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {locations.map((location) => (
                                            <tr key={location.id} id={location.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{location.date}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{location.title}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{location.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="text-sm text-gray-900">{location.publicLocation === true ? 'Publicly' : 'Private'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        className="text-indigo-600 hover:text-indigo-900 m-5"
                                                        onClick={(event) => {
                                                            updateLocation((event.target as HTMLElement).parentElement?.parentElement?.id!);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900 m-5"
                                                        onClick={(event) => {
                                                            setShowDelete(true);
                                                            setLocationId((event.target as HTMLElement).parentElement?.parentElement?.id!);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <div>
                <h1 className="text-center m-5 text-6xl text-blue-600">
                    There are no locations
                </h1>
            </div>}
        </>
    )
}
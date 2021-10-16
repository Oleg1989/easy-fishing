import React from 'react';
import { Link } from "react-router-dom";
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Map } from '../components/map/Map';
import { turnOnAddLocation, isNotAuthenticated } from '../containerSlice';
import { useAppDispatch } from '../../app/hooks';

const navigation = [
    { name: 'Add a location', to: '#', current: false },
    { name: 'Table', to: '/user/page/table', current: false },
    { name: 'Sign out', to: '#', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const UserPage: React.FC = () => {
    const dispatch = useAppDispatch();

    const addLocation = () => {
        dispatch(turnOnAddLocation());
    }
    const singOut = () => {
        dispatch(isNotAuthenticated());
        localStorage.removeItem('token');
    }
    return (
        <>
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
                                            <span className="hidden md:block h-8 w-auto text-white text-3xl ml-10">Easy-Fishing</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block lg:ml-6">
                                        <div className="flex sm:block lg:ml-6 flex-auto">
                                            <div className="flex flex-auto justify-between space-x-4">
                                                <div className="flex flex-wrap content-center justify-end">
                                                    {navigation.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            to={item.to}
                                                            onClick={() => {
                                                                if (item.name === 'Add a location') {
                                                                    addLocation();
                                                                }
                                                                if (item.name === 'Sign out') {
                                                                    singOut();
                                                                }
                                                            }}
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
                                        onClick={() => {
                                            if (item.name === 'Add a location') {
                                                addLocation();
                                            }
                                            if (item.name === 'Sign out') {
                                                singOut();
                                            }
                                        }}
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
            <Map />
        </>
    );
}
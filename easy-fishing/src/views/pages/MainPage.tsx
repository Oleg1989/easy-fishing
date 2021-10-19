import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Map } from '../components/map/Map';
import { getPublicLocations } from '../containerSlice';
import { useAppDispatch } from '../../app/hooks';

const navigation = [
    { name: 'Sign in', to: '/login', current: false },
    { name: 'Sign up', to: '/registration', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const MainPage: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getPublicLocations());
    });
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
                                            <span className="hidden md:block h-8 w-auto text-white text-3xl ml-20">Easy-Fishing</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block sm:ml-6">
                                        <div className="flex sm:block sm:ml-6 flex-auto">
                                            <div className="flex flex-auto justify-between space-x-4">
                                                {/* <div className="flex justify-center items-center">
                                                    <div className="relative">
                                                        <div className="absolute top-4 left-3"><i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg></i>
                                                        </div>
                                                        <input type="text" className="h-12 w-94 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none" placeholder="Search anything..." />
                                                        <div className="absolute top-2 right-2">
                                                            <button className="h-8 w-20 text-white rounded-lg bg-gray-800 hover:bg-gray-900">Search</button>
                                                        </div>
                                                    </div>
                                                </div> */}
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
                                {/* <div className="flex justify-center items-center">
                                    <div className="relative">
                                        <div className="absolute top-4 left-3"> <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg></i> </div> <input type="text" className="h-12 w-94 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none" placeholder="Search anything..." />
                                        <div className="absolute top-2 right-2"> <button className="h-8 w-20 text-white rounded-lg bg-gray-800 hover:bg-gray-900">Search</button> </div>
                                    </div>
                                </div> */}
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
            <Map />
        </>
    );
}
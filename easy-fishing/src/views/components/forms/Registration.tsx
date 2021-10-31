import React, { useState } from "react";
import { LockClosedIcon } from '@heroicons/react/solid';
import { isError, isMessage } from '../../containerSlice';
import { registrationUser } from '../../containerAPI';
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch } from "../../../app/hooks";

export const Registration = (
    props: {
        setIsRegistration: (isRegistration: boolean) => void;
    }
) => {
    const dispatch = useAppDispatch();

    const error = (message: string) => {
        dispatch(isMessage(message));
        dispatch(isError());
    }

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        locations: {},
        error: error,
    });

    const handleRegistration = () => {
        dispatch(registrationUser(user));
    }

    return (
        <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            id="registration"
            onClick={(event) => {
                if ((event.target as HTMLElement).id === 'registration') {
                    props.setIsRegistration(false);
                }
            }}
        >
            <div className="h-3/6 w-11/12 max-w-md rounded-md flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Registration</h2>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Your name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={user.name}
                                    onChange={(event) => {
                                        setUser({
                                            ...user,
                                            name: event.target.value,
                                        });
                                    }}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={user.email}
                                    onChange={(event) => {
                                        setUser({
                                            ...user,
                                            email: event.target.value,
                                        });
                                    }}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={user.password}
                                    onChange={(event) => {
                                        setUser({
                                            ...user,
                                            password: event.target.value,
                                        });
                                    }}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleRegistration}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-gray-700"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-white group-hover:text-indigo-400" aria-hidden="true" />
                                </span>
                                Registration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
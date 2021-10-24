import React from "react";
import DatePicker from "react-datepicker";
import { Location } from '../../interface/InterfaceLocation';
import { closeModal, disableAddLocation, selectModalUpdate, selectUId } from '../../containerSlice';
import { updateLocathinDatabase } from '../../containerAPI';
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

export const FormUpdateLocation = (
    props: {
        updateLocationUser: Location,
        setUpdateLocationUser: (formData: Location) => void,
    }) => {

    const dispatch = useAppDispatch();
    const modal = useAppSelector(selectModalUpdate);
    const uId = useAppSelector(selectUId);

    return (
        <>
            {modal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-5"
                    >
                        <div className="relative w-full my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Update location
                                    </h3>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <div className="w-full py-5">
                                        <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            defaultValue={props.updateLocationUser.title}
                                            onChange={(event) => {
                                                props.setUpdateLocationUser({
                                                    ...props.updateLocationUser,
                                                    title: event.target.value
                                                })
                                            }}
                                            className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="w-full py-5">
                                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                name="about"
                                                rows={3}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-2 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                placeholder="Your description..."
                                                defaultValue={props.updateLocationUser.description}
                                                onChange={(event) => {
                                                    props.setUpdateLocationUser({
                                                        ...props.updateLocationUser,
                                                        description: event.target.value
                                                    })
                                                }}
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            A brief description of your event.
                                        </p>
                                    </div>
                                    <div className="w-full py-5">
                                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                            Public location?
                                        </label>
                                        <input
                                            type="checkbox"
                                            name="checkbox"
                                            defaultChecked={props.updateLocationUser.publicLocation}
                                            onClick={(event) => {
                                                props.setUpdateLocationUser({
                                                    ...props.updateLocationUser,
                                                    publicLocation: (event.target as HTMLInputElement).checked
                                                })
                                            }}
                                            className="mt-2 block shadow-sm sm:text-sm border-gray-400"
                                        />
                                    </div>
                                    <div className="w-full py-5">
                                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                            Date
                                        </label>
                                        <div className="mt-2">
                                            <DatePicker
                                                selected={new Date(props.updateLocationUser.date)}
                                                onChange={(newDate: Date) => props.setUpdateLocationUser({
                                                    ...props.updateLocationUser!,
                                                    date: `${newDate.toLocaleString("en-US", {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        weekday: 'long',
                                                    })}`,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            dispatch(closeModal());
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-green-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            dispatch(closeModal());
                                            dispatch(disableAddLocation());
                                            dispatch(updateLocathinDatabase(
                                                {
                                                    location: props.updateLocationUser,
                                                    uId: uId!,
                                                }));
                                        }}
                                    >
                                        Save location
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}
import React from "react";
import DatePicker from "react-datepicker";
import { FormInputData } from '../../interface/InterfaceFormInputData';
import { disableAddLocation } from '../../containerSlice'
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch } from "../../../app/hooks";

export const FormAddLocation = (props: {
    showModal: boolean,
    setShowModal: (showModal: boolean) => void,
    formInputData: FormInputData,
    setFormInputData: (formData: FormInputData) => void,
    addLocation: () => void,
}) => {

    const dispatch = useAppDispatch();

    return (
        <>
            {props.showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-11/12 m-6 mx-auto max-w-sm">
                            {/*content*/}
                            <div className="rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-center p-2 border-b border-solid border-blueGray-200 rounded-t">
                                    <h3 className="text-3xl font-semibold text-blue-900">
                                        New location
                                    </h3>
                                </div>
                                {/*body*/}
                                <div className="relative p-2 flex-auto">
                                    <div className="w-full py-2">
                                        <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            defaultValue={''}
                                            onChange={(event) => {
                                                props.setFormInputData({
                                                    ...props.formInputData,
                                                    title: event.target.value
                                                })
                                            }}
                                            className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div className="w-full py-2">
                                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                name="about"
                                                rows={3}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-2 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                placeholder="Your description..."
                                                defaultValue={''}
                                                onChange={(event) => {
                                                    props.setFormInputData({
                                                        ...props.formInputData,
                                                        description: event.target.value
                                                    })
                                                }}
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            A brief description of your event.
                                        </p>
                                    </div>
                                    <div className="w-full py-2">
                                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                            Public location?
                                        </label>
                                        <input
                                            type="checkbox"
                                            name="checkbox"
                                            onClick={(event) => {
                                                props.setFormInputData({
                                                    ...props.formInputData,
                                                    publicLocation: (event.target as HTMLInputElement).checked
                                                })
                                            }}
                                            className="mt-2 block shadow-sm sm:text-sm border-gray-400"
                                        />
                                    </div>
                                    <div className="w-full py-2">
                                        <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                            Date
                                        </label>
                                        <div className="mt-2">
                                            <DatePicker
                                                selected={props.formInputData.date}
                                                onChange={(newDate: Date) => props.setFormInputData({
                                                    ...props.formInputData!,
                                                    date: newDate,
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            props.setShowModal(false);
                                            dispatch(disableAddLocation());
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-green-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 opacity-80"
                                        type="button"
                                        onClick={(event) => {
                                            props.setShowModal(false);
                                            dispatch(disableAddLocation());
                                            props.addLocation();
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
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { deleteLocathinDatabase } from '../../containerAPI';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { isError, isMessage, selectUId } from "../../containerSlice";

export const Delete = (
    props: {
        setShowDelete: (isDelete: boolean) => void;
        locationId: string;
    }
) => {
    const dispatch = useAppDispatch();
    const uId = useAppSelector(selectUId);

    const error = (message: string) => {
        dispatch(isMessage(message));
        dispatch(isError());
    }

    const deleteLocation = (id: string) => {
        dispatch(deleteLocathinDatabase({ userId: uId!, locationId: id, error: error }));
    }

    return (
        <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none m-5"
        >
            <div className="relative w-full my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-center p-5 border-b border-solid border-blueGray-200 rounded-t text-center">
                        <h3 className="text-3xl font-semibold text-red-600">
                            Delete location
                        </h3>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                            className="bg-green-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={(event) => {
                                props.setShowDelete(false);
                            }}
                        >
                            Close
                        </button>
                        <button
                            className="bg-red-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 opacity-80"
                            type="button"
                            onClick={() => {
                                props.setShowDelete(false);
                                deleteLocation(props.locationId);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
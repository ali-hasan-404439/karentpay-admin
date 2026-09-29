import moment from "moment";
import React from "react";
import { MdClose } from "react-icons/md";

function ShowPayoutMethodSms({ showPayoutMethodSms, setShowPayoutMethodSms }) {
    const formatMessages = (message) => {
        if (typeof message !== "string") {
            return <p>Invalid message format</p>;
        }

        const regex =
            /Cash Out Tk ([\d,]+\.\d{2}) from (\d{4}X{4}\d{3}) successful\. Fee Tk ([\d,]+\.\d{2})\. Balance Tk ([\d,]+\.\d{2})\. TrxID (\w+) at (\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})/g;

        const matches = [...message.matchAll(regex)];

        if (matches.length > 0) {
            return matches.map((match, index) => {
                const [
                    ,
                    cashOutAmount,
                    fromNumber,
                    fee,
                    balance,
                    trxID,
                    dateTime,
                ] = match;

                return (
                    <div key={index} className="mb-4">
                        <p>
                            <strong>Cash Out Amount: </strong> Tk {cashOutAmount}
                        </p>
                        <p>
                            <strong>From Number: </strong> {fromNumber}
                        </p>
                        <p>
                            <strong>Fee: </strong> Tk {fee}
                        </p>
                        <p>
                            <strong>Balance: </strong> Tk {balance}
                        </p>
                        <p>
                            <strong>Transaction ID: </strong> {trxID}
                        </p>
                        <p>
                            <strong>Date and Time: </strong>
                            {moment(dateTime, "DD/MM/YYYY HH:mm").isValid()
                                ? moment(dateTime, "DD/MM/YYYY HH:mm").format(
                                    "DD MMMM YYYY, HH:mm a"
                                )
                                : "Invalid date"}
                        </p>
                        <hr className="my-2 border-gray-300 dark:border-gray-600" />
                    </div>
                );
            });
        }

        return <p>{message}</p>;
    };

    return (
        <div
            id="popup-modal"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
            <div className="relative w-full rounded bg-white dark:bg-gray-700 max-w-md p-10 max-h-[90vh] overflow-y-auto">
                <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center">
                    <button
                        onClick={() => setShowPayoutMethodSms("")}
                        type="button"
                        className="text-xl text-white cursor-pointer w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
                    >
                        <MdClose />
                    </button>
                </div>
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    SMS Details
                </h2>
                <div className="text-gray-800 dark:text-gray-200">
                    {showPayoutMethodSms?.message &&
                        formatMessages(showPayoutMethodSms?.message || "")}
                </div>
            </div>
        </div>
    );
}

export default ShowPayoutMethodSms;

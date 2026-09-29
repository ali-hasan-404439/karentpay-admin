import moment from 'moment';
import React from 'react';
import { MdClose } from 'react-icons/md';

function ShowDeviceSms({ showDeviceSms, setShowDeviceSms }) {
    const formatMessage = (message) => {
        if (typeof message !== 'string') {
            return <p>Invalid message format</p>;
        }

        const regex =
            /(?:You have received Tk (\d+\.\d+) from (\d+)\. (?:Ref ([^\s.]+)\. )?Fee Tk (\d+\.\d+)\. Balance Tk (\d+\.\d+)\. TrxID ([^\s.]+) at ([^\.]+)|Money Received\. Amount: Tk (\d+\.\d+) Sender: (\d+) Ref: ([^\s]+) TxnID: ([^\s]+) Balance: Tk (\d+\.\d+) ([^\.]+))/;
        const matches = message?.match(regex);

        if (matches) {
            if (matches[1]) {
                const [
                    ,
                    receivedAmount,
                    fromNumber,
                    ref,
                    fee,
                    balance,
                    trxID,
                    dateTime,
                ] = matches;

                return (
                    <div>
                        <p>
                            <strong>Received Amount : </strong> Tk {receivedAmount}
                        </p>
                        <p>
                            <strong>Sender : </strong> {fromNumber}
                        </p>
                        {ref && (
                            <p>
                                <strong>Reference : </strong> {ref}
                            </p>
                        )}
                        <p>
                            <strong>Fee : </strong> Tk {fee}
                        </p>
                        <p>
                            <strong>Balance : </strong> Tk {balance}
                        </p>
                        <p>
                            <strong>Transaction ID :</strong> {trxID}
                        </p>
                        <p>
                            <strong>Date and Time : </strong>
                            {moment(dateTime, "DD-MM-YYYY HH:mm:ss").isValid()
                                ? moment(dateTime, "DD-MM-YYYY HH:mm:ss").format('DD MMMM YYYY HH:mm a')
                                : 'Invalid date'}
                        </p>

                    </div>
                );
            }
            if (matches[8]) {
                const [
                    ,
                    ,
                    ,
                    ,
                    ,
                    ,
                    ,
                    receivedAmount,
                    sender,
                    ref,
                    txnID,
                    balance,
                    dateTime,
                ] = matches;

                return (
                    <div>
                        <p>
                            <strong>Received Amount : </strong> Tk {receivedAmount}
                        </p>
                        <p>
                            <strong>Sender : </strong> {sender}
                        </p>
                        <p>
                            <strong>Reference : </strong> {ref}
                        </p>
                        <p>
                            <strong>Transaction ID : </strong> {txnID}
                        </p>
                        <p>
                            <strong>Balance : </strong> Tk {balance}
                        </p>
                        <p>
                            <strong>Date and Time : </strong> {dateTime}
                        </p>
                    </div>
                );
            }
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
                        onClick={() => setShowDeviceSms('')}
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
                    {showDeviceSms?.message && formatMessage(showDeviceSms?.message || '')}
                </div>
            </div>
        </div>
    );
}

export default ShowDeviceSms;

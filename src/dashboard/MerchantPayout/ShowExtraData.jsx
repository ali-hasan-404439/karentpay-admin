import { useEffect, useState } from "react";
import moment from "moment";
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

function ShowExtraData({ setPayoutExtraData, payoutExtraData }) {
    if (!payoutExtraData) return null;
    const [parsedContext, setParsedContext] = useState({});


    useEffect(() => {
        if (payoutExtraData?.extra_data) {
            parseContextData(payoutExtraData.extra_data);
        }
    }, [payoutExtraData]);

    const parseContextData = (extraData) => {
        let context = {};
        try {
            context = JSON.parse(extraData);
        } catch (error) {
            // console.error("Error parsing extra_data:", error);
        }
        setParsedContext(context);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-6/12 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b p-6 relative bg-gray-50">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white ">
                        Payout Extra Data
                    </h2>
                    <button
                        onClick={() => setPayoutExtraData(false)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 w-8 h-8 flex items-center justify-center text-white text-xl font-bold rounded-full"
                    >
                        X
                    </button>
                </div>
                <div className="space-y-4 p-6">
                    <div className="flex justify-between border-b pb-2">
                        <strong>Date And Time :</strong>
                        <span>{payoutExtraData.created_at && (
                            <>
                                {/* Format Date and Time */}
                                <span>{moment(payoutExtraData.created_at).format("DD MMM YYYY")}</span>
                                <span className="mx-2">|</span>
                                <span>{moment(payoutExtraData.created_at).format("h:mm a")}</span>

                                {/* Time Ago */}
                                <div className="text-gray-500 text-sm mt-1 text-right">
                                    <span className="text-blue-600">( {moment(payoutExtraData.created_at).isValid() ? moment(payoutExtraData.created_at).fromNow() : ""} )</span>
                                </div>
                            </>
                        )}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <strong>Amount :</strong>
                        <span className="text-blue-600">{payoutExtraData.amount} {payoutExtraData.currency}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <strong>Payment Method :</strong>
                        <span>{payoutExtraData.payment_method}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <strong>Withdraw Number :</strong>
                        <span>{payoutExtraData.withdraw_number}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <strong>Status :</strong>
                        <span>{payoutExtraData.status}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <strong>Failed Reason :</strong>
                        <span>{payoutExtraData.failed_reason}</span>
                    </div>
                    {
                        parsedContext && payoutExtraData.extra_data && (
                            <div className="mt-4">
                                <h3 className="font-bold mb-2">Extra Data :</h3>
                                <div className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                                    <JsonView
                                        src={parsedContext}
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default ShowExtraData;

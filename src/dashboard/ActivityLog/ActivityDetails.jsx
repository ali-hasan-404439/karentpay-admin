import { useEffect, useState } from "react";
import Auth from "../../utils/Auth";
import moment from "moment";
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
function ActivityDetails({ setShowActivityDetails, showActivityDetails }) {
    if (!showActivityDetails) return null;

    const { ApiRequest } = Auth();
    const [parsedContext, setParsedContext] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showActivityDetails) {
            getLevels();
        }
    }, [showActivityDetails]);

    const getLevels = async () => {
        if (!showActivityDetails?.id) return
        setLoading(true);
        try {
            const response = await ApiRequest({
                url: `/admin/logs/${showActivityDetails?.id}`,
                method: "get",
            });
            const data = response.data || {};

            let context = {};
            if (data.context) {
                try {
                    context = JSON.parse(data.context);
                } catch (error) {
                    console.error("Error parsing context:", error);
                }
            }
            setParsedContext(context);
        } catch (error) {
            // console.error("Error fetching activity details:", error);
        }
        setLoading(false);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-6/12 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b p-6 relative bg-gray-50">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white ">
                        Activity Details
                    </h2>
                    <button
                        onClick={() => setShowActivityDetails(false)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 w-8 h-8 flex items-center justify-center text-white text-xl font-bold rounded-full"
                    >
                        X
                    </button>
                </div>
                <div className="space-y-4 p-6">
                    <div className="flex justify-between border-b pb-2">
                        <strong>Date And Time :</strong>
                        <span>{showActivityDetails.logged_at && (
                            <>
                                {/* Format Date and Time */}
                                <span>{moment(showActivityDetails.logged_at).format("DD MMM YYYY")}</span>
                                <span className="mx-2">|</span>
                                <span>{moment(showActivityDetails.logged_at).format("h:mm a")}</span>

                                {/* Time Ago */}
                                <div className="text-gray-500 text-sm mt-1 text-right">
                                    <span className="text-blue-600">( {moment(showActivityDetails.logged_at).isValid() ? moment(showActivityDetails.logged_at).fromNow() : ""} )</span>
                                </div>
                            </>
                        )}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <strong>Level :</strong>
                        <span className="text-blue-600">{showActivityDetails.level_name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <strong>Section :</strong>
                        <span>{showActivityDetails.section}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <strong>Message :</strong>
                        <span>{showActivityDetails.message}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <strong>IP Address :</strong>
                        <span>{showActivityDetails.user_ip}</span>
                    </div>
                    {loading ? (
                        <div className="mt-4">
                            <h3 className="font-bold mb-2">Context:</h3>
                            <div className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                                {/* Skeleton loader */}
                                <div className="space-y-3">
                                    <div className="h-[30vh] bg-gray-300 dark:bg-gray-600 animate-pulse  rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        parsedContext && (
                            <div className="mt-4">
                                <h3 className="font-bold mb-2">Context:</h3>
                                <div className="bg-gray-100 p-3 rounded text-sm overflow-auto">

                                    <JsonView
                                        src={parsedContext}
                                    />
                                </div>
                            </div>
                        )
                    )}

                </div>
            </div>
        </div>
    );
}

export default ActivityDetails;

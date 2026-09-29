import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Auth from '../../utils/Auth';

function ResetBalance({ approveModal,
    setApproveModal,
    setData,
}) {
    if (!approveModal) return;
    const { ApiRequest } = Auth();
    const [loading, setLoading] = useState(false);

    const handlePayoutStatusReset = async (refund) => {
        if (!refund?.id) return;
        if (refund?.status !== "Failed") {
            setApproveModal(null);
            return toast.warn("Only failed payout can be reset");
        };
        setLoading(true);
        try {
            const response = await ApiRequest({
                url: `/admin/merchant/payout_reset/${refund?.id}`,
                method: "PUT",
            });
            setData((prevData) => {
                return prevData.map((data) => {
                    if (data.id === refund?.id) {
                        return { ...data, status: "Pending" };
                    }
                    return data;
                });
            })
            toast.success(response?.data);
            setApproveModal(null);
        } catch (error) {
            toast.error("Failed to change status of payout");
        }
        setLoading(false);
    };

    return (
        <div
            id="popup-modal"
            className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        >
            <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
                <div
                    className={`flex flex-col items-center p-6 text-white ${approveModal?.bgColor}`}
                >
                    <div
                        className={`w-16 h-16 bg-white ${approveModal?.iconColor} flex items-center justify-center rounded-full mb-4`}
                    >
                        {approveModal?.icon}
                    </div>
                    <h2 className="text-lg font-semibold text-center">
                        {approveModal?.title}
                    </h2>
                </div>
                <div className="p-6 text-center">
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={() => handlePayoutStatusReset(approveModal)}
                            type="button"
                            className={`w-full px-4 py-2 text-white ${approveModal?.btnColor} rounded-lg flex items-center justify-center gap-2`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                approveModal?.btnText
                            )}
                        </button>
                        <button
                            onClick={() => setApproveModal("")}
                            type="button"
                            className={`w-full px-4 py-2  ${approveModal?.cancelBgColor} rounded-lg`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetBalance;
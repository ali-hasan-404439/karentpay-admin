import { useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";

function IpRequestStatusChange({ rejectModal, setRejectModal, setIpRequest }) {
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  const handleReject = async () => {
    if (!token) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("ip_address", rejectModal?.ip_address);
    formData.append("merchant_id", rejectModal?.merchant_id);
    formData.append("status", rejectModal?.status);
    formData.append("_method", "PUT");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/allowed-ips/${rejectModal.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIpRequest((prev) =>
        prev.map((item) =>
          item.id === rejectModal.id
            ? { ...item, status: rejectModal?.status }
            : item
        )
      );

      toast.success("Status updated successfully");
      setRejectModal(null);
    } catch (err) {
      toast.error("Status update failed");
    }
    setLoading(false);
  };

  return (
    <>
      {rejectModal && (
        <div
          id="popup-modal"
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/5 bg-opacity-50"
        >
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Modal Header */}
            <div className={`flex flex-col items-center ${rejectModal?.bgColor} p-6 text-white`}>
              <div className="w-16 h-16 bg-white text-red-500 flex items-center justify-center rounded-full mb-4">
                {rejectModal?.icon}
              </div>
              <h2 className="text-lg font-semibold text-center">
                {rejectModal?.title}
              </h2>
            </div>
            {/* Modal Actions */}
            <div className="p-6 text-center">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handleReject(rejectModal)}
                  type="button"
                  className={`w-full px-4 py-2 text-white ${rejectModal?.btnColor} rounded-lg flex items-center justify-center gap-2`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    rejectModal?.btnText
                  )}
                </button>
                <button
                  onClick={() => setRejectModal("")}
                  type="button"
                  className={`w-full px-4 py-2 ${rejectModal?.cancelBgColor} rounded-lg border border-gray-300`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default IpRequestStatusChange;

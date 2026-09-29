import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Auth from "../../utils/Auth";
import { FaSpinner } from "react-icons/fa";

function MerchantCashInStatusChange({
  approveModal,
  setApproveModal,
  setCashInData,
  setCashInStatus,
}) {
  const { ApiRequest } = Auth();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  const handleApprove = async (id) => {
    if (
      approveModal?.itemStatus === "Success" &&
      approveModal?.status === "Success"
    ) {
      setApproveModal("");
      return toast.warn(
        `This Cash In is already marked as ${approveModal?.itemStatus}.`,
        { position: "top-center" }
      );
    }

    setLoading(true);

    if (approveModal?.status === "Manual") {
      if (approveModal?.itemStatus === "Success") {
        setApproveModal("");
        return toast.warn(
          `This SMS is already marked as ${approveModal?.itemStatus}.`,
          { position: "top-center" }
        );
      }
      try {
        const response = await ApiRequest({
          url: `admin/merchant/check_message_manual_cashin/${id}`,
          method: "get",
        });
        if (response?.status == 404) {
          toast.error(response?.message);
        } else {
          setCashInData((prev) => ({
            ...prev,
            paymentSite: prev?.paymentSite?.map((item) =>
              item.id === id
                ? { ...item, transactionStatus: "Success" }
                : item
            ),
          }));
          toast.success("Manual SMS re-generated successfully!");
        };
      } catch (error) {
        toast.error("Failed to re-generate manual SMS. Please try again.");
      } finally {
        setApproveModal("");
        setLoading(false);
      }
      return;
    }

    const formData = new FormData();
    formData.append("status", approveModal?.status);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/merchant/deposits/change_status/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCashInStatus((prev) =>
        !prev.includes(approveModal?.status)
          ? [...prev, approveModal?.status]
          : prev
      );

      setCashInData((prev) => ({
        ...prev,
        paymentSite: prev?.paymentSite?.map((item) =>
          item.id === id
            ? { ...item, transactionStatus: approveModal?.status }
            : item
        ),
      }));
      toast.success(response?.data?.data.message);
    } catch (error) {
      toast.error("Failed to approve Cash In. Please try again.");
    } finally {
      setApproveModal("");
      setLoading(false);
    }
  };

  return (
    <div
      id="popup-modal"
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/5"
    >
      <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg">
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
              onClick={() => handleApprove(approveModal?.id)}
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
              className={`w-full px-4 py-2 ${approveModal?.cancelBgColor} rounded-lg`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MerchantCashInStatusChange;

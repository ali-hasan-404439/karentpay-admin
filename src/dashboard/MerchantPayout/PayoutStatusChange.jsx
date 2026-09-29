import axios from "axios";
import { useState } from "react";
import { LuCheck } from "react-icons/lu";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa6";

function PayoutStatusChange({
  payoutStatusChangeModalOpen,
  setPayoutStatusChangeModalOpen,
  setData,
  setPayoutStatus
}) {
  const [loading, setLoading] = useState(false);
  const [trxId, setTrxId] = useState("");
  const [note, setNote] = useState("");

  const token = Cookies.get("token");
  const handleCashInApprove = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("trxID", trxId);
    formData.append("failed_reason", note);
    formData.append("_method", "PUT");
    formData.append("status", payoutStatusChangeModalOpen.status);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/merchant/payout_status_change/${payoutStatusChangeModalOpen.id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 500) {
        setLoading(false);
        setPayoutStatusChangeModalOpen(null);
        toast.error(response.data.message);
        return;
      };
      toast.success(response.data.data);
      setPayoutStatus((prev) => {
        const statusExists = prev.includes(payoutStatusChangeModalOpen.status);
        if (!statusExists) {
          return [...prev, payoutStatusChangeModalOpen.status];
        }
        return prev;
      });

      setData((prev) =>
        prev.map((item) =>
          item.id === payoutStatusChangeModalOpen.id
            ? { ...item, status: payoutStatusChangeModalOpen.status, failed_reason: note }
            : item
        )
      );

    } catch (error) {
      toast.error("Failed to change status of payout");
    }
    setLoading(false);
    setPayoutStatusChangeModalOpen(null);
  };

  return (
    <>
      {payoutStatusChangeModalOpen && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50 bg-black/5"
        >
          <div className="relative w-full max-w-xl max-h-full p-4">
            <div className="relative bg-white p-10 rounded-[4px] shadow dark:bg-gray-700">
              <div className="space-y-5">
                <div className="relative">
                  <label
                    htmlFor="trx id"
                    className="block mb-1 text-gray-900 uppercase dark:text-white"
                  >
                    Trx ID
                  </label>
                  <input
                    type="text"
                    id="trx id"
                    name="siteTitle"
                    onChange={(e) => setTrxId(e.target.value)}
                    className={`border  text-gray-900 rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${trxId
                      ? "focus:ring-green-500  border-green-500"
                      : "border-gray-300 "
                      }`}
                    placeholder="Trx Id"
                  />
                  {trxId && (
                    <span className="absolute top-[2.4rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
                      <LuCheck />
                    </span>
                  )}
                </div>

                <div className="relative mt-4">
                  <label
                    htmlFor="Note"
                    className="block mb-1 text-gray-900 uppercase dark:text-white"
                  >
                    Note
                  </label>
                  <textarea
                    id="Note"
                    placeholder="Note"
                    onChange={(e) => setNote(e.target.value)}
                    required
                    cols="30"
                    rows="7"
                    className={`border  text-gray-900 rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${note
                      ? "focus:ring-green-500  border-green-500"
                      : "border-gray-300 "
                      }`}
                  ></textarea>

                  {note && (
                    <span className="absolute top-[2.4rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
                      <LuCheck />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => {
                      handleCashInApprove();
                    }}
                    type="button"
                    className="button_gradient"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      payoutStatusChangeModalOpen.title
                    )}
                  </button>
                  <button
                    onClick={() => setPayoutStatusChangeModalOpen(null)}
                    type="button"
                    className="button_cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PayoutStatusChange;

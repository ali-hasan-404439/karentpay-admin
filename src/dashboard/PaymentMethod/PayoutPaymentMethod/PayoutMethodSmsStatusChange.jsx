import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Auth from "../../../utils/Auth";

function PayoutMethodSmsStatusChange({
  smsPayoutReGenerate,
  setSmsPayoutReGenerate,
  viewPayoutMethodSms,
  setSmsPayoutMethod,
  ItemsPerPage,
  currentPage,
  setTotal,
}) {
  const { ApiRequest } = Auth();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const handleRoboticReGenerate = async (id) => {
    if (smsPayoutReGenerate?.status === "Success") {
      setSmsPayoutReGenerate("");
      return toast.warn(
        `This SMS is already marked as ${smsPayoutReGenerate?.itemStatus}.`,
        {
          position: "top-center",
        }
      );
    }
    return toast.warn(
      `Payout sms is upcoming. Please try again after some time.`,
      {
        position: "top-center",
      }
    );

    setLoading(true);
    const formData = new FormData();
    formData.append('_method', 'PUT');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/auto-withdraw-messages?automotion_setting_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {

        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/admin/auto-withdraw-messages`,
          {
            params: {
              id: viewPayoutMethodSms,
              /* per_page: ItemsPerPage,
              page: currentPage,*/
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { last_page, total, data } = response?.data?.data || {};
        setTotal({
          totalPage: last_page || 0,
          totalItems: total || 0,
        });
        setSmsPayoutMethod(data || []);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
      toast.success("Payout sms re-generate successfully!");
    } catch (error) {
      toast.error("Failed to re-generate payout sms. Please try again.");

    } finally {
      setSmsPayoutReGenerate("");
      setLoading(false);

    }
  };

  return (
    <div
      id="popup-modal"
      className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
    >
      <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          className={`flex flex-col items-center p-6 text-white ${smsPayoutReGenerate?.bgColor}`}
        >
          <div
            className={`w-16 h-16 bg-white ${smsPayoutReGenerate?.iconColor} flex items-center justify-center rounded-full mb-4`}
          >
            {smsPayoutReGenerate?.icon}
          </div>
          <h2 className="text-lg font-semibold text-center">
            {smsPayoutReGenerate?.title}
          </h2>
        </div>
        <div className="p-6 text-center">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => handleRoboticReGenerate(smsPayoutReGenerate?.item?.id)}
              type="button"
              className={`w-full px-4 py-2 text-white ${smsPayoutReGenerate?.btnColor} rounded-lg flex items-center justify-center gap-2`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Loading...
                </>
              ) : (
                smsPayoutReGenerate?.btnText
              )}
            </button>
            <button
              onClick={() => setSmsPayoutReGenerate("")}
              type="button"
              className={`w-full px-4 py-2  ${smsPayoutReGenerate?.cancelBgColor} rounded-lg`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayoutMethodSmsStatusChange;

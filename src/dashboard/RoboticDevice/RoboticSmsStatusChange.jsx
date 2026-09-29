import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Auth from "../../utils/Auth";

function RoboticSmsStatusChange({
  smsRoboticReGenerate,
  setSmsRoboticReGenerate,
  viewDeviceSms,
  ItemsPerPage,
  currentPage,
  setSmdViewRobot,
  setTotal
}) {

  const { ApiRequest } = Auth();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  const handleRoboticReGenerate = async (id) => {

    if (smsRoboticReGenerate?.status === "Success") {
      setSmsRoboticReGenerate("");
      return toast.warn(
        `This SMS is already marked as ${smsRoboticReGenerate?.itemStatus}.`,
        {
          position: "top-center",
        }
      );
    }

    setLoading(true);
    try {
      const response = await ApiRequest({
        url: `admin/manual-cash-in-messages/regenerate/${id}`,
        method: "put",
      });

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/admin/manual-cash-in-messages`,
          {
            params: {
              manual_cash_in_robotic_device_id: viewDeviceSms,
              per_page: ItemsPerPage,
              page: currentPage,
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
        setSmdViewRobot(data || []);
      } catch (error) {
        // console.log(error);
      }
      toast.success("Manual sms re-generate successfully!");
    } catch (error) {
      toast.error("Failed to re-generate manual sms. Please try again.");

    } finally {

      setSmsRoboticReGenerate("");
      setLoading(false);

    }
  };

  return (
    <>
      {
        smsRoboticReGenerate && (
          <div
            id="popup-modal"
            className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
          >
            <div className="relative w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
              <div
                className={`flex flex-col items-center p-6 text-white ${smsRoboticReGenerate?.bgColor}`}
              >
                <div
                  className={`w-16 h-16 bg-white ${smsRoboticReGenerate?.iconColor} flex items-center justify-center rounded-full mb-4`}
                >
                  {smsRoboticReGenerate?.icon}
                </div>
                <h2 className="text-lg font-semibold text-center">
                  {smsRoboticReGenerate?.title}
                </h2>
              </div>
              <div className="p-6 text-center">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => handleRoboticReGenerate(smsRoboticReGenerate?.id)}
                    type="button"
                    className={`w-full px-4 py-2 text-white ${smsRoboticReGenerate?.btnColor} rounded-lg flex items-center justify-center gap-2`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      smsRoboticReGenerate?.btnText
                    )}
                  </button>
                  <button
                    onClick={() => setSmsRoboticReGenerate("")}
                    type="button"
                    className={`w-full px-4 py-2  ${smsRoboticReGenerate?.cancelBgColor} rounded-lg`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

        )
      }
    </>
  );
}

export default RoboticSmsStatusChange;

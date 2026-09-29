import { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

function WithdrawApprove({
  payoutApproveModalOpen,
  setPayoutApproveModalOpen,
  setArray,
}) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const token = Cookies.get("token");

  const handleCashInApprove = async () => {
    setLoading(true);
    const formData = {
      note: note,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/merchant/${payoutApproveModalOpen?.title === "approve"
          ? "approve_withdraw"
          : "reject_withdraw"
        }/${payoutApproveModalOpen.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === 403) {
        toast.warn(response.data.message);
        setPayoutApproveModalOpen(null);
        setLoading(false);
        return;
      }
      toast.success(`Successfully ${payoutApproveModalOpen.title} withdraw`);
      setArray((prev) =>
        prev.map((item) =>
          item.id === payoutApproveModalOpen.id
            ? {
              ...item,
              status: payoutApproveModalOpen.title === "approve" ? 'Success' : payoutApproveModalOpen.title,
              note: note,
            }
            : item
        )
      );

      setNote("");
    } catch (error) {
      toast.error(
        `Filed to ${payoutApproveModalOpen.title} withdraw. Please try again`
      );
    }
    setLoading(false);
    setPayoutApproveModalOpen(null);
  };

  useEffect(() => {
    if (payoutApproveModalOpen?.note) setNote(payoutApproveModalOpen?.note);
  }, [payoutApproveModalOpen]);

  return (
    <>
      {payoutApproveModalOpen && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/40"
        >
          <div className="relative w-full max-w-xl max-h-full p-4">
            <div className="relative bg-white p-10 rounded-[4px] shadow dark:bg-gray-700">
              <div className="space-y-5">
                <InputField
                  label="Note"
                  value={note}
                  onChange={setNote}
                  id="Note"
                  type={"textarea"}
                />

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
                      payoutApproveModalOpen.title
                        ?.charAt(0)
                        .toUpperCase()
                        .concat(payoutApproveModalOpen.title.slice(1))
                    )}
                  </button>
                  <button
                    onClick={() => setPayoutApproveModalOpen(false)}
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

export default WithdrawApprove;

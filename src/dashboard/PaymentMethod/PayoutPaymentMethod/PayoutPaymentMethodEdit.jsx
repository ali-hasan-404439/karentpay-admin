import { useEffect, useState } from "react";
import Auth from "../../../utils/Auth";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import InputField from "../../../components/InputField";

function PayoutPaymentMethodEdit({
  setPayoutPaymentMethodEdit,
  payoutPaymentMethodEdit,
  setAllData,
}) {
  const { ApiRequest } = Auth();

  const [deviceName, setDeviceName] = useState('');
  const [deviceID, setdeviceID] = useState('');
  const [deviceImEI, setdeviceImEI] = useState('');
  const [bkashPhoneNo, setbkashPhoneNo] = useState('');
  const [nagadPhoneNo, setnagadPhoneNo] = useState('');
  const [secretKay, setSecretKay] = useState('');
  const [maxBkashLimit, setMaxBkashLimit] = useState("");
  const [minBkashLimit, setMinBkashLimit] = useState("");
  const [maxNagadLimit, setMaxNagadLimit] = useState("");
  const [minNagadLimit, setMinNagadLimit] = useState("");
  const [dailyNagadLimit, setDailyNagadLimit] = useState("");
  const [dailyBkashLimit, setDailyBkashLimit] = useState("");
  const [monthlyNagadLimit, setMonthlyNagadLimit] = useState("");
  const [monthlyBkashLimit, setMonthlyBkashLimit] = useState("");
  const [ispending, setispending] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (payoutPaymentMethodEdit) {
      setDeviceName(payoutPaymentMethodEdit.name);
      setdeviceID(payoutPaymentMethodEdit.device_id);
      setdeviceImEI(payoutPaymentMethodEdit.device_imei_no);
      setbkashPhoneNo(payoutPaymentMethodEdit.bkash_mobile_no);
      setnagadPhoneNo(payoutPaymentMethodEdit.nagad_mobile_no);
      setSecretKay(payoutPaymentMethodEdit.secret);
      setMaxBkashLimit(payoutPaymentMethodEdit.trx_max_limit_bkash);
      setMinBkashLimit(payoutPaymentMethodEdit.trx_min_limit_bkash);
      setMaxNagadLimit(payoutPaymentMethodEdit.trx_max_limit_nagad);
      setMinNagadLimit(payoutPaymentMethodEdit.trx_min_limit_nagad);
      setDailyBkashLimit(payoutPaymentMethodEdit.daily_trx_limit_bkash);
      setDailyNagadLimit(payoutPaymentMethodEdit.daily_trx_limit_nagad);
      setMonthlyBkashLimit(payoutPaymentMethodEdit.monthly_trx_limit_bkash);
      setMonthlyNagadLimit(payoutPaymentMethodEdit.monthly_trx_limit_nagad);
    }
  }, [payoutPaymentMethodEdit]);
  const validate = () => {
    const newErrors = {};

    if (!deviceName.trim()) {
      newErrors.deviceName = "Device Name is required.";
    }
    if (!secretKay.trim()) {
      newErrors.secretKay = "Secret key is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAccept = async () => {
    if (!validate()) return;

    setispending(true);
    const response = await ApiRequest({
      url: "/admin/update_secret_key",
      formdata: {
        device_id: deviceID,
        id: payoutPaymentMethodEdit.id,
        name: deviceName,
        secret: secretKay,
        device_imei_no: deviceImEI,
        bkash_mobile_no: bkashPhoneNo,
        nagad_mobile_no: nagadPhoneNo,
        trx_max_limit_bkash: maxBkashLimit,
        trx_max_limit_nagad: maxNagadLimit,
        trx_min_limit_bkash: minBkashLimit,
        trx_min_limit_nagad: minNagadLimit,
        daily_trx_limit_bkash: dailyBkashLimit,
        daily_trx_limit_nagad: dailyNagadLimit,
        monthly_trx_limit_bkash: monthlyBkashLimit,
        monthly_trx_limit_nagad: monthlyNagadLimit
      },
    });
    if (response) {
      setAllData((prev) =>
        prev.map((item) => {
          if (item.id === payoutPaymentMethodEdit.id) {
            return {
              ...item,
              device_id: deviceID,
              name: deviceName,
              secret: secretKay,
              device_imei_no: deviceImEI,
              bkash_mobile_no: bkashPhoneNo,
              nagad_mobile_no: nagadPhoneNo,
              trx_max_limit_bkash: maxBkashLimit,
              trx_max_limit_nagad: maxNagadLimit,
              trx_min_limit_bkash: minBkashLimit,
              trx_min_limit_nagad: minNagadLimit,
              daily_trx_limit_bkash: dailyBkashLimit,
              daily_trx_limit_nagad: dailyNagadLimit,
              monthly_trx_limit_bkash: monthlyBkashLimit,
              monthly_trx_limit_nagad: monthlyNagadLimit
            };
          }
          return item;
        })
      );
      toast.success("Payment method update Successfully");

    } else {
      toast.error(response?.message);
    }
    setPayoutPaymentMethodEdit(null);
    setPayoutPaymentMethodEdit(false);
    setispending(false);
  };

  return (
    <div>
      {payoutPaymentMethodEdit && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/20 bg-opacity-50"
        >
          <div className="relative w-full max-w-3xl h-[90vh] overflow-y-auto bg-white rounded-[4px] shadow dark:bg-gray-700 p-4 mx-auto my-0">
            <div className="relative text-black dark:text-white ">
              <div className="px-10 pt-10 space-y-5">
                {[
                  {
                    label: "Create Your Secret key", value: secretKay, onChange: setSecretKay, id: "payment-method",
                    error: errors.secretKay,
                    required: true,
                  },
                  {
                    label: "Device Name", value: deviceName, onChange: setDeviceName, id: "DeviceName", error: errors.deviceName,
                    required: true,
                  },
                  { label: "Device ID", value: deviceID, onChange: setdeviceID, id: "DeviceId" },
                  { label: "Device IMEI", value: deviceImEI, onChange: setdeviceImEI, id: "DeviceIMEI" },
                  { label: "Bkash Phone Number", value: bkashPhoneNo, onChange: setbkashPhoneNo, id: "bkashphone" },
                  { label: "Nagad Phone Number", value: nagadPhoneNo, onChange: setnagadPhoneNo, id: "nagadphone" },
                  { label: "Daily Bkash Limit", value: dailyBkashLimit, onChange: setDailyBkashLimit, id: "dailyBkashLimit" },
                  { label: "Monthly Bkash Limit", value: monthlyBkashLimit, onChange: setMonthlyBkashLimit, id: "monthlyBkashLimit" },
                  { label: "Min Bkash Limit", value: minBkashLimit, onChange: setMinBkashLimit, id: "minBkashLimit" },
                  { label: "Max Bkash Limit", value: maxBkashLimit, onChange: setMaxBkashLimit, id: "maxBkashLimit" },
                  { label: "Daily Nagad Limit", value: dailyNagadLimit, onChange: setDailyNagadLimit, id: "dailyNagadLimit" },
                  { label: "Monthly Nagad Limit", value: monthlyNagadLimit, onChange: setMonthlyNagadLimit, id: "monthlyNagadLimit" },
                  { label: "Min Nagad Limit", value: minNagadLimit, onChange: setMinNagadLimit, id: "minNagadLimit" },
                  { label: "Max Nagad Limit", value: maxNagadLimit, onChange: setMaxNagadLimit, id: "maxNagadLimit" },
                ].map((field, index) => (
                  <InputField
                    key={index}
                    label={field.label}
                    value={field.value}
                    onChange={field.onChange}
                    id={field.id}
                    error={field.error || ""}
                    required={field.required || false}
                  />
                ))}
              </div>


              <div className="flex items-center px-10 py-5 mt-5 border-t gap-2 border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleAccept}
                  type="submit"
                  className="button_gradient"
                  disabled={ispending}
                >
                  {ispending ? (
                    <>
                      <FaSpinner className="animate-spin" /> Loading...
                    </>
                  ) : (
                    "Update"
                  )}
                </button>

                <button
                  onClick={() => setPayoutPaymentMethodEdit(null)}
                  type="submit"
                  className="button_cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayoutPaymentMethodEdit;

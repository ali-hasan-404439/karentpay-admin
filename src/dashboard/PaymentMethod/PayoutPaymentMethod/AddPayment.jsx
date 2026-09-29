import { useState } from "react";
import { toast } from "react-toastify";
import Auth from "../../../utils/Auth";
import { FaSpinner } from "react-icons/fa";
import InputField from "../../../components/InputField";

function AddPayment({ dropdownModel, setDropdownModel, setAllData, setTotal, ItemsPerPage, currentPage }) {
  const { ApiRequest } = Auth();
  const [ispending, setispending] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceID, setdeviceID] = useState("");
  const [deviceImEI, setdeviceImEI] = useState("");
  const [bkashPhoneNo, setbkashPhoneNo] = useState("");
  const [nagadPhoneNo, setnagadPhoneNo] = useState("");
  const [secretKay, setSecretKay] = useState("");
  const [maxBkashLimit, setMaxBkashLimit] = useState("");
  const [minBkashLimit, setMinBkashLimit] = useState("");
  const [maxNagadLimit, setMaxNagadLimit] = useState("");
  const [minNagadLimit, setMinNagadLimit] = useState("");
  const [dailyNagadLimit, setDailyNagadLimit] = useState("");
  const [dailyBkashLimit, setDailyBkashLimit] = useState("");
  const [monthlyNagadLimit, setMonthlyNagadLimit] = useState("");
  const [monthlyBkashLimit, setMonthlyBkashLimit] = useState("");

  const [error, setError] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!deviceName.trim()) newErrors.deviceName = "Device Name is required.";
    if (!secretKay.trim()) newErrors.secretKay = "Secret Key is required.";
    // Validation for Bkash and Nagad Limits
    if (minBkashLimit) {
      if (isNaN(minBkashLimit) || Number(minBkashLimit) <= 0)
        newErrors.minBkashLimit = "Minimum Bkash Limit must be a positive number.";
    }

    if (maxBkashLimit) {
      if (isNaN(maxBkashLimit) || Number(maxBkashLimit) <= 0)
        newErrors.maxBkashLimit = "Maximum Bkash Limit must be greater than Minimum Bkash Limit.";
    }
    if (minNagadLimit) {
      if (isNaN(minNagadLimit) || Number(minNagadLimit) <= 0)
        newErrors.minNagadLimit = "Minimum Nagad Limit must be a positive number.";
    }

    if (maxNagadLimit) {
      if (isNaN(maxNagadLimit) || Number(maxNagadLimit) <= 0)
        newErrors.maxNagadLimit = "Maximum Nagad Limit must be a positive number.";

    }
    if (dailyBkashLimit) {
      if (isNaN(dailyBkashLimit) || Number(dailyBkashLimit) <= 0)
        newErrors.dailyBkashLimit = "Daily Bkash Limit must be a positive number.";

    }
    if (dailyNagadLimit) {
      if (isNaN(dailyNagadLimit) || Number(dailyNagadLimit) <= 0)
        newErrors.dailyNagadLimit = "Daily Nagad Limit must be a positive number.";
    }
    if (monthlyBkashLimit) {
      if (isNaN(monthlyBkashLimit) || Number(monthlyBkashLimit) <= 0)
        newErrors.monthlyBkashLimit = "Monthly Bkash Limit must be a positive number.";
    }
    if (monthlyNagadLimit) {
      if (isNaN(monthlyNagadLimit) || Number(monthlyNagadLimit) <= 0)
        newErrors.monthlyNagadLimit = "Monthly Nagad Limit must be a positive number.";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPayment = async () => {
    if (!validate()) return;
    try {
      setispending(true);

      const response = await ApiRequest({
        url: "/admin/add_secret_key",
        formdata: {
          device_id: deviceID,
          name: deviceName,
          secret_key: secretKay,
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
      const res = await ApiRequest({
        url: `/admin/get_all_secret_key?per_page=${ItemsPerPage}&page=${currentPage}`,
        method: "get",
      });
      setAllData(res.data.data);
      setTotal({
        totalItems: res?.data?.total,
        totalPage: res?.data?.last_page,
      });
      toast.success("Payment method add success!");
      setDeviceName("");
      setdeviceID("");
      setdeviceImEI("");
      setbkashPhoneNo("");
      setnagadPhoneNo("");
      setSecretKay("");
    }
    catch (error) {
      toast.error('Failed to add payment method. Please try again.');
    }
    setispending(false);
    setDropdownModel(false);
  };
  return (
    <>
      {dropdownModel && (
        <div
          id="popup-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-3xl">
            <div className="relative bg-white rounded-[4px] shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto">
              {/* Modal content */}
              <div className="p-10 w-full">
                <div className="relative space-y-5">
                  {[
                    {
                      label: "Create Your Secret Key",
                      value: secretKay,
                      onChange: setSecretKay,
                      id: "payment-method",
                      error: error.secretKay,
                      required: true,
                    },
                    {
                      label: "Device Name",
                      value: deviceName,
                      onChange: setDeviceName,
                      id: "DeviceName",
                      error: error.deviceName,
                      required: true,
                    },
                    {
                      label: "Device ID",
                      value: deviceID,
                      onChange: setdeviceID,
                      id: "DeviceId",
                      error: error.deviceID,
                    },
                    {
                      label: "Device IMEI",
                      value: deviceImEI,
                      onChange: setdeviceImEI,
                      id: "DeviceIMEI",
                      error: error.deviceImEI,
                    },
                    {
                      label: "Bkash Phone Number",
                      value: bkashPhoneNo,
                      onChange: setbkashPhoneNo,
                      id: "bkashphone",
                      error: error.bkashPhoneNo,
                    },
                    {
                      label: "Nagad Phone Number",
                      value: nagadPhoneNo,
                      onChange: setnagadPhoneNo,
                      id: "nagadphone",
                      error: error.nagadPhoneNo,
                    },
                    {
                      label: "Daily Bkash Limit",
                      value: dailyBkashLimit,
                      onChange: setDailyBkashLimit,
                      id: "dailyBkashLimit",
                      error: error.dailyBkashLimit,
                    },
                    {
                      label: "Monthly Bkash Limit",
                      value: monthlyBkashLimit,
                      onChange: setMonthlyBkashLimit,
                      id: "monthlyBkashLimit",
                      error: error.monthlyBkashLimit,
                    },
                    {
                      label: "Min Bkash Limit",
                      value: minBkashLimit,
                      onChange: setMinBkashLimit,
                      id: "minBkashLimit",
                      error: error.minBkashLimit,
                    },
                    {
                      label: "Max Bkash Limit",
                      value: maxBkashLimit,
                      onChange: setMaxBkashLimit,
                      id: "maxBkashLimit",
                      error: error.maxBkashLimit,
                    },
                    {
                      label: "Daily Nagad Limit",
                      value: dailyNagadLimit,
                      onChange: setDailyNagadLimit,
                      id: "dailyNagadLimit",
                      error: error.dailyNagadLimit,
                    },
                    {
                      label: "Monthly Nagad Limit",
                      value: monthlyNagadLimit,
                      onChange: setMonthlyNagadLimit,
                      id: "monthlyNagadLimit",
                      error: error.monthlyNagadLimit,
                    },
                    {
                      label: "Min Nagad Limit",
                      value: minNagadLimit,
                      onChange: setMinNagadLimit,
                      id: "minNagadLimit",
                      error: error.minNagadLimit,
                    },
                    {
                      label: "Max Nagad Limit",
                      value: maxNagadLimit,
                      onChange: setMaxNagadLimit,
                      id: "maxNagadLimit",
                      error: error.maxNagadLimit,
                    },
                  ].map((field, index) => (
                    <InputField
                      key={index}
                      label={field.label}
                      value={field.value}
                      onChange={field.onChange}
                      id={field.id}
                      error={field.error}
                      required={field.required || false}
                    />
                  ))}
                </div>


                <div className="flex items-center gap-2 mt-5">
                  <button
                    disabled={ispending}
                    onClick={() => handleAddPayment()}
                    className="button_gradient"
                  >
                    {ispending ? (
                      <>
                        <FaSpinner className="animate-spin" /> Loading...
                      </>
                    ) : (
                      "Add Payment"
                    )}
                  </button>
                  <button
                    onClick={() => setDropdownModel(false)}
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

export default AddPayment;

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaSpinner, FaTimes } from "react-icons/fa";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import InputField from "../../components/InputField";

function AddPayment({ addPayment, setAddPayment, setRender }) {
  const dropdownRef = useRef(null);
  const newsImageRef = useRef(null);

  const [paymentName, setPaymentName] = useState("");
  const [paymentImage, setPaymentImage] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [showCountryList, setShowCountryList] = useState(false);

  const token = Cookies.get("token");

  const validateForm = () => {
    const validationErrors = {};
    if (!paymentName.trim()) {
      validationErrors.paymentName = "Payment Name is required.";
    }
    if (!selectedCountry.trim()) {
      validationErrors.selectedCountry = "Country is required.";
    }
    if (!paymentImage.trim()) {
      validationErrors.paymentImage = "Payment Icon is required.";
    }
    return validationErrors;
  };
  useEffect(() => {
    if (addPayment) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [addPayment]);

  useEffect(() => {
    countryGet();
  }, []);

  const countryGet = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/country`
      );

      setCountryList(response.data?.data);
    } catch (error) {
      // console.log(error);
    }
  };

  const filteredCountries = countryList.filter((country) =>
    country.name.toLowerCase().includes(selectedCountry.toLowerCase())
  );

  const handleFileChange = async (e) => {
    const { files } = e.target;
    const file = files[0] || "";
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/media-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setPaymentImage(response.data.file_url);
      }
    }
  };
  const clearNewsImage = () => {
    setPaymentImage("");
    if (newsImageRef.current) {
      newsImageRef.current.value = "";
    }
  };

  const handlePaymentSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }
    if (!token) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("gateway_name", paymentName);
    formData.append("logo", paymentImage);
    formData.append("country_name", selectedCountry);
    formData.append("is_active", 0);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/payment-gateways`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddPayment(false);
      setRender(true);
      toast.success("Payment support created successfully.");
    } catch (error) {
      toast.error("Failed to create payment support. Please try again later.");
    }
    setLoading(false);
  };
  // outlet click close the toggle function
  useEffect(() => {
    const handleClickOutsideUsersFilter = (event) => {
      if (!event.target.closest("#showMerchantList")) {
        setShowCountryList(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideUsersFilter);

    return () => {
      window.document.removeEventListener(
        "click",
        handleClickOutsideUsersFilter
      );
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <div
          id="popup-modal"
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            addPayment ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`relative w-full max-w-3xl max-h-full overflow-y-auto bg-white rounded-[4px] shadow dark:bg-gray-700 transition-transform duration-300 transform ${
              addPayment ? "translate-y-0" : "-translate-y-20"
            }`}
          >
            <div className="p-10 space-y-5">
              <InputField
                label="Name"
                value={paymentName}
                onChange={setPaymentName}
                id="name"
                error={errors.name}
                required={true}
              />
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
                >
                  Country <span className="text-red-600">*</span>
                </label>
                <div
                  id="showMerchantList"
                  ref={dropdownRef}
                  className="relative rounded-[4px] my-2 md:my-0 cursor-pointer"
                >
                  <div
                    id="country"
                    className="flex items-center"
                    onClick={() => setShowCountryList(!showCountryList)}
                  >
                    <h2 className="w-full px-3 py-3 h-12 bg-white border border-gray-300 text-gray-900 text-sm rounded flex items-center dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                      {selectedCountry?.length > 0
                        ? selectedCountry
                        : "Select Country"}
                    </h2>
                    {selectedCountry ? (
                      <div className="absolute top-3 right-2">
                        <FaTimes
                          className="w-6 h-6 rounded-full cursor-pointer text-lg text-white bg-[#2F65EC] p-1"
                          onClick={() => {
                            setSelectedCountry("");
                          }}
                        />
                      </div>
                    ) : (
                      <div className="absolute top-4 right-2">
                        <FaChevronDown
                          className={`transition-transform duration-300 ${
                            showCountryList ? "rotate-180" : ""
                          } text-lg text-gray-500`}
                        />
                      </div>
                    )}
                  </div>
                  {showCountryList && (
                    <div
                      id="country-list"
                      className="absolute top-full left-0 right-0 bg-white rounded-b-md z-10 max-h-[200px] overflow-y-auto dark:bg-[#374151] shadow-lg"
                    >
                      <input
                        type="text"
                        id="country"
                        placeholder="Search countries..."
                        className="w-full p-3 border-t border-gray-300 bg-gray-50 focus:outline-none placeholder:text-black/80 dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          setShowCountryList(true);
                        }}
                        name="random-country"
                        autoComplete="random-country"
                      />
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country, index) => (
                          <div
                            key={index}
                            className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white text-sm cursor-pointer hover:bg-gradient-to-r from-blue-500 to-purple-600 hover:text-white w-full flex items-center justify-between"
                            onClick={() => setSelectedCountry(country?.name)}
                          >
                            {country.name}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm">
                          No countries available
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {errors.country && (
                  <span className="text-red-500 text-sm">{errors.country}</span>
                )}
              </div>
              <InputField
                label="Payment Icon"
                value={paymentName}
                onChange={handleFileChange}
                id="image"
                type="file"
                error={errors.icon}
                image={paymentImage}
                close={clearNewsImage}
                refState={newsImageRef}
                required={true}
              />
              {/* Submit Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaymentSubmit}
                  className="button_gradient"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Add Payment</>
                  )}
                </button>
                <button
                  onClick={() => setAddPayment(false)}
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

export default AddPayment;

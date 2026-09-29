import React, { useState, useEffect } from 'react';

import { MdClose } from 'react-icons/md';

import SaneEditor from '../../../SaneEditor';
import './AddManualPayment.css';

import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaChevronDown, FaSpinner } from 'react-icons/fa';
import InputField from '../../../components/InputField';
import { IoMdClose } from 'react-icons/io';

function ManualPaymentEdit({
  editManualPayment,
  setEditManualPayment,
  setGetManualPayment,
}) {
  const [paymentMethodName, setPaymentMethodName] = useState("");
  const [methodWalletAddress, setMethodWalletAddress] = useState("");
  const [paymentDirection, setPaymentDirection] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [dailyAmount, setDailyAmount] = useState("");
  const [currencySelect, setCurrencySelect] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [paymentImage, setPaymentImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState([]);
  const [device_id, setDevice_id] = useState("");
  const [showDeviceID, setShowDeviceID] = useState(false);
  const [allDeviceId, setAllDeviceId] = useState([]);

  useEffect(() => {
    if (editManualPayment) {
      setPaymentMethodName(editManualPayment.payment_method_name);
      setMethodWalletAddress(editManualPayment.wallet_address);
      setPaymentDirection(editManualPayment.payment_direction);
      setMonthlyAmount(editManualPayment.monthly_trx_limit);
      setDailyAmount(editManualPayment.daily_trx_limit);
      setCurrencySelect(editManualPayment.default_currency);
      setMinAmount(editManualPayment.min_trx_amount);
      setMaxAmount(editManualPayment.max_trx_amount);
      setImagePreviewUrl(editManualPayment.image);
      setTags(editManualPayment.fields || []);
      setSelected(editManualPayment.fields || []);
      setSecretKey(editManualPayment.secret_key);
      setDevice_id(editManualPayment.manual_cash_in_robotic_device);
    }
  }, [editManualPayment]);


  const [errorMessage, setErrorMessage] = useState({});

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData('draggedIndex', index);
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData('draggedIndex');
    if (draggedIndex === null) return;

    const newSelected = [...selected];
    const draggedItem = newSelected.splice(draggedIndex, 1)[0];
    newSelected.splice(index, 0, draggedItem);

    setSelected(newSelected);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleTagRemove = (indexToRemove) => {
    if (selected[indexToRemove].info_keys !== 'TrxId') {
      setSelected(selected.filter((_, index) => index !== indexToRemove));
    }
  };
  const handleAddTag = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      setSelected([...selected, { info_keys: event.target.value }]);
      event.target.value = '';
    }
  };

  const editorContent = (content) => {
    // console.log(content);
    setPaymentDirection(content);
  };

  const validateForm = () => {
    const errors = {};
    if (!paymentMethodName)
      errors.paymentMethodName = "Payment method name is required.";
    if (!paymentDirection)
      errors.paymentDirection = "Payment direction is required.";
    if (!methodWalletAddress)
      errors.methodWalletAddress = "Wallet address is required.";
    if (selected.length === 0)
      errors.fields = "At least one field is required.";
    if (!device_id) {
      errors.device_id = "Device is required.";
    }
    return errors;
  };

  const token = Cookies.get('token');
  const handleEditPayment = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('payment_method_name', paymentMethodName);
    formData.append('payment_direction', paymentDirection);
    formData.append('wallet_address', methodWalletAddress);
    formData.append('fields', JSON.stringify(selected));
    if (paymentImage) {
      formData.append('image', paymentImage);
    }
    formData.append('default_currency', currencySelect);
    formData.append('daily_trx_limit', dailyAmount);
    formData.append('monthly_trx_limit', monthlyAmount);
    formData.append('min_trx_amount', minAmount);
    formData.append('max_trx_amount', maxAmount);
    formData.append("manual_cash_in_robotic_devices_id", device_id?.id);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/update-manual-payment-gateway/${editManualPayment?.id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setGetManualPayment((prev) => ({
        ...prev,
        data: prev.data?.map((item) =>
          item.id === editManualPayment?.id
            ? {
              ...item,
              payment_method_name: paymentMethodName,
              payment_direction: paymentDirection,
              wallet_address: methodWalletAddress,
              fields: selected,
              image: imagePreviewUrl,
              default_currency: currencySelect,
              daily_trx_limit: dailyAmount,
              monthly_trx_limit: monthlyAmount,
              min_trx_amount: minAmount,
              max_trx_amount: maxAmount,
              manual_cash_in_robotic_device: {
                id: device_id?.id,
                device_name: device_id?.device_name,
                owner_name: device_id?.owner_name,
                owner_phone: device_id?.owner_phone,
              }
            }
            : item
        ),
      }));
      toast.success('Successfully updated manual payment.');
    } catch (error) {
      toast.error('Failed to update manual payment. Please Try Again.');
    } finally {
      setLoading(false);
      setEditManualPayment();
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      setPaymentImage(file);

      // Update the image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload a valid image file.');
      setPaymentImage(null);
      setImagePreviewUrl(null);
    }
  };
  useEffect(() => {
    const deviceID = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/dropdown/manual-cash-in-robotic-devices`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllDeviceId(response?.data);
      } catch (error) {
        // console.error("Error fetching manual payment gateways:", error);
      }
    };
    deviceID();
  }, []);

  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest("#device_id")) {
        setShowDeviceID(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideOperator);

    return () => {
      window.document.removeEventListener("click", handleClickOutsideOperator);
    };
  }, []);
  return (
    <div>
      {editManualPayment && (
        <div
          id="popup-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className='relative w-full rounded bg-white dark:bg-gray-700 max-w-7xl max-h-[90vh] overflow-y-auto'>
            <div className='relative '>
              <div className="w-full grid grid-cols-1 lg:grid-cols-3">
                <div className="relative mt-3 p-8 col-span-2 space-y-5">
                  <InputField
                    label="Payment Method Name"
                    value={paymentMethodName}
                    onChange={setPaymentMethodName}
                    id="payment-method"
                    error={errorMessage?.paymentMethodName}
                    required={true}
                  />
                  <div>
                    <label
                      htmlFor="currency_select"
                      className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
                    >
                      Currency
                    </label>
                    <select id="currency_select" value={currencySelect} onChange={(e) => setCurrencySelect(e.target.value)} name="currency_select" className={`border text-gray-900 rounded-[4px] block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:outline-none outline-none dark:text-white ${currencySelect
                      ? "focus:ring-green-500 border-green-500"
                      : "border-gray-300"
                      }`}>
                      <option value="" disabled selected>Currency</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="BDT">BDT</option>
                    </select>
                  </div>
                  <InputField
                    label=" Wallet Address"
                    value={methodWalletAddress}
                    onChange={setMethodWalletAddress}
                    id="payment-Address"
                    error={errorMessage?.methodWalletAddress}
                    required={true}
                  />
                  <div>
                    <label
                      htmlFor="device_id"
                      className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
                    >
                      Select Device
                    </label>

                    <div
                      id="device_id"
                      onClick={() => setShowDeviceID(!showDeviceID)}
                      className="relative rounded-[4px] w-full cursor-pointer"
                    >
                      <h2
                        className={` border border-gray-300 ${showDeviceID
                          ? 'rounded-t-[4px] text-gray-900'
                          : 'text-gray-600 rounded-[4px]'
                          } focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500`}
                      >
                        {device_id
                          ? device_id?.device_name
                          : 'Select Device'}
                      </h2>
                      {!device_id && (
                        <div
                          className={`absolute top-[19px] right-[.5rem] w-[14px] h-[14px] rounded-full text-gray-600 dark:text-gray-400 flex items-center justify-center transition-transform duration-300 transform ${showDeviceID ? 'rotate-180' : 'rotate-0'
                            }`}
                        >
                          <FaChevronDown />
                        </div>
                      )}
                      {device_id && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setDevice_id('');
                          }}
                          className="absolute top-[16px] right-[.5rem] w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center cursor-pointer"
                        >
                          <IoMdClose />
                        </div>
                      )}
                      {showDeviceID && (
                        <div
                          id="device-dropdown-menu"
                          className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 rounded-b-[4px] shadow-md z-10 max-h-[300px] overflow-y-auto"
                        >
                          {allDeviceId?.map((item, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setDevice_id(item);
                                setShowDeviceID(false);
                              }}
                              className="p-3 py-1 hover:text-white hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] cursor-pointer"
                            >
                              {item?.device_name}<br />
                              {item?.owner_phone}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {
                      errorMessage?.device_id && (
                        <p className="text-red-500 pt-[1px]">
                          {errorMessage?.device_id}
                        </p>
                      )
                    }
                  </div>

                  <div>
                    <label
                      htmlFor="payment-direction"
                      className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
                    >
                      Payment Direction
                      <span className="text-red-600"> *</span>
                    </label>
                    <SaneEditor editorContent={editorContent} height={250} initialContent={paymentDirection} />
                    {errorMessage?.paymentDirection && (
                      <p className="text-red-600">{errorMessage.paymentDirection}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-8 space-y-5 mt-3">

                  <InputField
                    label="Daily Transaction Limit"
                    value={dailyAmount}
                    onChange={setDailyAmount}
                    id="daily-transaction"
                    error={errorMessage?.dailyAmount}
                  />

                  <InputField
                    label="Monthly Transaction Limit"
                    value={monthlyAmount}
                    onChange={setMonthlyAmount}
                    id="Total"
                    error={errorMessage?.monthlyAmount}

                  />
                  <InputField
                    label="Min Transaction Limit"
                    value={minAmount}
                    onChange={setMinAmount}
                    id="Limit"
                    error={errorMessage?.minAmount}

                  />
                  <InputField
                    label="Max Transaction Limit"
                    value={maxAmount}
                    onChange={setMaxAmount}
                    id="Limit"
                    error={errorMessage?.maxAmount}

                  />
                  <div>
                    <label
                      htmlFor="tags"
                      className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
                    >
                      Fields
                      <span className="text-red-600"> *</span>
                    </label>
                    <div className="tags-input-container dark:border-gray-500">
                      {selected.map((tag, index) => (
                        <div
                          key={index}
                          className="tag-item dark:border-gray-500"
                          draggable={index !== 0}
                          onDragStart={(event) => handleDragStart(event, index)}
                          onDrop={(event) => handleDrop(event, index)}
                          onDragOver={handleDragOver}
                        >
                          {tag.info_keys}
                          {tag.info_keys !== "TrxId" && (
                            <span
                              className="remove-tag"
                              onClick={() => handleTagRemove(index)}
                            >
                              &times;
                            </span>
                          )}
                        </div>
                      ))}
                      <input
                        type="text"
                        placeholder="Add a new payment field..."
                        onKeyDown={handleAddTag}
                        className="input-tag"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="payment-image"
                      className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
                    >
                      Image
                    </label>
                    <input
                      onChange={handleImageChange}
                      type="file"
                      id="payment-image"
                      className="block w-full text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />

                    {imagePreviewUrl && (
                      <div className="mt-4">
                        <img
                          src={imagePreviewUrl}
                          alt="Payment"
                          className="h-40 w-40 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="button_gradient w-full"
                    disabled={loading}
                    onClick={handleEditPayment}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Loading...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>

                  <div className="absolute -top-7 right-0 w-12 h-12 flex items-center justify-center">
                    <button
                      onClick={() => setEditManualPayment('')}
                      type="button"
                      className="text-xl text-white cursor-pointer w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center "
                    >
                      <MdClose />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManualPaymentEdit;

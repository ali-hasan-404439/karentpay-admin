import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaSpinner } from 'react-icons/fa';
import InputField from '../../../../components/InputField';
import Auth from '../../../../utils/Auth';

function NagadPaymentAdd({ nagadAddNewModal, setNagadAddNewModal, setNagadlive, setTotal, ItemsPerPage, currentPage }) {
  const { ApiRequest } = Auth();
  const [name, setName] = useState('');
  const [nagadMerchantId, setNagadMerchantId] = useState('');
  const [nagadMerchantNumber, setNagadMerchantNumber] = useState('');
  const [nagadPrivateKey, setNagadPrivateKey] = useState('');
  const [nagadPublicKey, setNagadPublicKey] = useState('');
  const [dailyTransaction, setDailyTransaction] = useState('');
  const [nagadAmountLimit, setNagadAmountLimit] = useState('');
  const [nagadCallBackUrl, setNagadCallBackUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const token = Cookies.get('token');

  // Validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (nagadAddNewModal?.id) {
      setName(nagadAddNewModal.name);
      setNagadMerchantId(nagadAddNewModal.NAGAD_MERCHANT_ID);
      setNagadMerchantNumber(nagadAddNewModal.NAGAD_MERCHANT_NUMBER);
      setNagadPrivateKey(nagadAddNewModal.NAGAD_PRIVATE_KEY);
      setNagadPublicKey(nagadAddNewModal.NAGAD_PUBLIC_KEY);
      setNagadCallBackUrl(nagadAddNewModal.CALLBACK_URL);
      setDailyTransaction(nagadAddNewModal.daily_trx_limit);
      setNagadAmountLimit(nagadAddNewModal.limit_amount);
    }
  }, [nagadAddNewModal])

  const validateInputs = () => {
    const newErrors = {};

    if (!nagadMerchantId)
      newErrors.nagadMerchantId = 'Merchant ID is required.';
    if (!nagadMerchantNumber)
      newErrors.nagadMerchantNumber = 'Merchant Number is required.';
    if (!nagadPrivateKey)
      newErrors.nagadPrivateKey = 'Private Key is required.';
    if (!nagadPublicKey) newErrors.nagadPublicKey = 'Public Key is required.';
    if (!nagadCallBackUrl)
      newErrors.nagadCallBackUrl = 'Call Back Url is required.';
    if (!Number.isInteger(Number(dailyTransaction)))
      newErrors.dailyTransaction = 'Daily Transaction Limit must be an integer.';
    if (!nagadAmountLimit)
      newErrors.nagadAmountLimit = 'Amount Limit is required.';
    else if (isNaN(Number(nagadAmountLimit)))
      newErrors.nagadAmountLimit = 'Amount Limit must be a valid number.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNagad = async () => {
    if (!validateInputs()) return;

    if (!token) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('NAGAD_MERCHANT_ID', nagadMerchantId);
    formData.append('NAGAD_MERCHANT_NUMBER', nagadMerchantNumber);
    formData.append('NAGAD_PRIVATE_KEY', nagadPrivateKey);
    formData.append('NAGAD_PUBLIC_KEY', nagadPublicKey);
    formData.append('CALLBACK_URL', nagadCallBackUrl);
    formData.append('limit_amount', nagadAmountLimit);
    formData.append('daily_trx_limit', dailyTransaction);
    formData.append('action', 'add');
    formData.append('type', 1);
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/nagad_setting_add_update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response?.data?.status === 400) {
        setLoading(false);
        return toast.error(response?.data?.message)
      };
      try {
        const res = await ApiRequest({
          url: `/admin/nagad_setting_live_list?page=${currentPage}&per_page=${ItemsPerPage}`,
          method: 'get'
        });
        setNagadlive(res?.data?.data);
        setTotal({
          totalItems: res?.data?.total,
          totalPage: res?.data?.last_page
        });
      }
      catch (error) {
        // console.log(error);
      }
      toast.success('Nagad cash in method added successfully');
      setName('');
      setNagadMerchantId('');
      setNagadMerchantNumber('');
      setNagadPrivateKey('');
      setNagadPublicKey('');
      setNagadAmountLimit('');
      setDailyTransaction('');
      setNagadCallBackUrl('');

    } catch (e) {
      toast.error('Failed to add nagad cash in method. Please try again.');
    }
    setNagadAddNewModal(false);
    setLoading(false);
  };

  const closeModal = () => {
    setName('');
    setNagadMerchantId('');
    setNagadMerchantNumber('');
    setNagadPrivateKey('');
    setNagadPublicKey('');
    setNagadAmountLimit('');
    setDailyTransaction('');
    setNagadCallBackUrl('');
    setErrors({}); // Clear validation errors
    setNagadAddNewModal(false);
  };
  return (
    <>
      {nagadAddNewModal && (
        <div
          id='popup-modal'
          className='fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50 bg-black/30'
        >
          <div className='relative p-4 w-full max-w-3xl'>
            <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700 max-h-[85vh] overflow-y-auto'>
              <div className='w-full p-10 space-y-5'>
                {/* Repeated Fields */}
                {[
                  {
                    label: 'Name',
                    value: name,
                    onChange: setName,
                    id: 'Name',
                  },
                  {
                    label: 'Nagad Merchant ID',
                    value: nagadMerchantId,
                    onChange: setNagadMerchantId,
                    id: 'nagadMerchantId',
                    error: errors.nagadMerchantId,
                    required: true
                  },
                  {
                    label: 'Nagad Merchant Number',
                    value: nagadMerchantNumber,
                    onChange: setNagadMerchantNumber,
                    id: 'nagadMerchantNumber',
                    error: errors.nagadMerchantNumber,
                    required: true
                  },
                  {
                    label: 'Nagad Public Key',
                    value: nagadPublicKey,
                    onChange: setNagadPublicKey,
                    id: 'nagadPublicKey',
                    error: errors.nagadPublicKey,
                    required: true
                  },
                  {
                    label: 'Nagad Private Key',
                    value: nagadPrivateKey,
                    onChange: setNagadPrivateKey,
                    id: 'nagadPrivateKey',
                    error: errors.nagadPrivateKey,
                    required: true
                  },
                  {
                    label: 'Nagad CallBack Url',
                    value: nagadCallBackUrl,
                    onChange: setNagadCallBackUrl,
                    id: 'nagadCallBackUrl',
                    error: errors.nagadCallBackUrl,
                    required: true
                  },
                  {
                    label: 'Daily Transaction Limit',
                    value: dailyTransaction,
                    onChange: setDailyTransaction,
                    id: 'dailyTransaction',
                    error: errors.dailyTransaction,
                  },
                  {
                    label: 'Nagad Amount Limit',
                    value: nagadAmountLimit,
                    onChange: setNagadAmountLimit,
                    id: 'nagadAmountLimit',
                    error: errors.nagadAmountLimit,
                    required: true
                  }
                ].map(({ label, value, onChange, id, error, required }, index) => (
                  <div key={index}>
                    <InputField
                      label={label}
                      value={value}
                      onChange={onChange}
                      id={id}
                      error={error}
                      required={required}
                    />
                  </div>
                ))}

                {/* Buttons */}
                <div className='gap-3 flex items-center mt-5'>
                  <button
                    onClick={handleAddNagad}
                    className='button_gradient'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className='animate-spin' /> Loading...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                  <button
                    onClick={() => closeModal(false)}
                    type='button'
                    className='button_cancel'
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

export default NagadPaymentAdd;

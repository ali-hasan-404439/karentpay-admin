import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import InputField from '../../../../components/InputField';

function NagadPaymentEdit({
  nagadAddNewModalEdit,
  setNagadAddNewModalEdit,
  setNagadlive
}) {
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
    if (nagadAmountLimit) {
      if (isNaN(parseInt(nagadAmountLimit, 10))) {
        newErrors.nagadAmountLimit = 'Amount Limit must be an integer.';
      }
    }
    if (dailyTransaction) {
      if (isNaN(parseInt(dailyTransaction, 10))) {
        newErrors.dailyTransaction = 'Daily Transaction must be an integer.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNagad = async () => {
    if (!validateInputs()) return;

    if (!token) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('id', nagadAddNewModalEdit.id);
    formData.append('NAGAD_MERCHANT_ID', nagadMerchantId);
    formData.append('NAGAD_MERCHANT_NUMBER', nagadMerchantNumber);
    formData.append('NAGAD_PRIVATE_KEY', nagadPrivateKey);
    formData.append('NAGAD_PUBLIC_KEY', nagadPublicKey);
    formData.append('CALLBACK_URL', nagadCallBackUrl);
    formData.append('daily_trx_limit', dailyTransaction);
    formData.append('limit_amount', nagadAmountLimit);
    formData.append('status', nagadAddNewModalEdit.status);
    formData.append('action', 'update');
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
      setNagadlive((prev) => prev.map((item) => {
        if (item.id === nagadAddNewModalEdit.id) {
          return {
            ...item,
            name: name,
            NAGAD_MERCHANT_ID: nagadMerchantId,
            NAGAD_MERCHANT_NUMBER: nagadMerchantNumber,
            NAGAD_PRIVATE_KEY: nagadPrivateKey,
            NAGAD_PUBLIC_KEY: nagadPublicKey,
            CALLBACK_URL: nagadCallBackUrl,
            limit_amount: nagadAmountLimit,
            daily_trx_limit: dailyTransaction,
          };
        }
        return item;
      }));
      toast.success('Successfully nagad updated');
      setName('');
      setNagadMerchantId('');
      setNagadMerchantNumber('');
      setNagadPrivateKey('');
      setNagadPublicKey('');
      setNagadAmountLimit('');
      setNagadCallBackUrl('');
    } catch (e) {
      toast.error('Failed to update nagad');
    }
    setNagadAddNewModalEdit(null);
    setLoading(false);
  };

  useEffect(() => {
    if (nagadAddNewModalEdit) {
      setName(nagadAddNewModalEdit.name);
      setNagadMerchantId(nagadAddNewModalEdit.NAGAD_MERCHANT_ID);
      setNagadMerchantNumber(nagadAddNewModalEdit.NAGAD_MERCHANT_NUMBER);
      setNagadPrivateKey(nagadAddNewModalEdit.NAGAD_PRIVATE_KEY);
      setNagadPublicKey(nagadAddNewModalEdit.NAGAD_PUBLIC_KEY);
      setNagadCallBackUrl(nagadAddNewModalEdit.CALLBACK_URL);
      setDailyTransaction(nagadAddNewModalEdit.daily_trx_limit);
      setNagadAmountLimit(nagadAddNewModalEdit.limit_amount);
    }
  }, [nagadAddNewModalEdit]);

  return (
    <>
      {nagadAddNewModalEdit && (
        <div
          id='popup-modal'
          className='fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50 bg-black/30'
        >
          <div className='relative p-4 w-full max-w-3xl'>
            <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto'>
              <div className='w-full p-10 space-y-5'>
                {/* Repeated Fields */}
                {[
                  {
                    label: 'Name',
                    value: name,
                    onChange: setName,
                    id: 'name',
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
                    label: 'Nagad Call Back Url',
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
                ].map((item, index) => (
                  <div key={index}>
                    <InputField
                      label={item.label}
                      value={item.value}
                      onChange={item.onChange}
                      id={item.id}
                      error={item.error}
                      required={item.required}
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
                      'Update'
                    )}
                  </button>
                  <button
                    onClick={() => setNagadAddNewModalEdit(null)}
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

export default NagadPaymentEdit;

import { useState, useEffect } from 'react';

import { LuCheck } from 'react-icons/lu';
import { GrUpdate } from 'react-icons/gr';
import { FaSpinner } from 'react-icons/fa';

import TitleDynamic from '../../TitleDynamic';
import Auth from '../../utils/Auth';

import { toast } from 'react-toastify';

function PaymentSetting() {
  const { ApiRequest } = Auth();

  const [cashIn, setCashIn] = useState('');
  const [payout, setPayout] = useState('');
  const [depositPercent, setDepositPercent] = useState('');
  const [loading, setLoading] = useState(false);

  const handelSubmitPercent = async () => {
    if (depositPercent > 100 || cashIn > 100 || payout > 100) {
      return toast.error(' Please Give small numbers from 100');
    } else {
      setLoading(true);
      const response = await ApiRequest({
        url: '/admin/payment_fees',
        method: 'post',
        formdata: {
          cash_in_fee: cashIn,
          auto_withdraw_fee: payout,
          withdraw_fee: depositPercent
        }
      });
      if (response?.status === 200) {
        toast.success(response.data);
      } else {
        toast.error(response?.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  const getSetting = async () => {
    const response = await ApiRequest({
      url: '/admin/payment_fees',
      method: 'get'
    });
    if (response?.status === 200) {
      setCashIn(response.data.payment_deposit_percent);
      setPayout(response.data.payment_withdraw_percent);
      setDepositPercent(response.data.withdraw_percent);
    } else {
      toast.error(response?.message);
    }
  };

  return (
    <div className='space-y-5'>
      <TitleDynamic title='Application || Color Setting' />

      <div className='relative'>
        <label
          htmlFor='CashIn'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Cash In Fee ( % )
        </label>
        <input
          value={cashIn}
          onChange={(e) => setCashIn(e.target.value)}
          type='number'
          id='CashIn'
          name='cashIn'
          className={`border text-gray-900 rounded-[4px] ${
            cashIn
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
          } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='00'
          required
        />
        {cashIn && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <div className='relative'>
        <label
          htmlFor='Payout'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Robotic Fee ( % )
        </label>
        <input
          value={payout}
          onChange={(e) => setPayout(e.target.value)}
          type='number'
          id='Payout'
          name='payout'
          className={`border text-gray-900 rounded-[4px] ${
            payout
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
          } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='00'
          required
        />
        {payout && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <div className='relative'>
        <label
          htmlFor='DepositPercent'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Merchant Withdraw Fee ( % )
        </label>
        <input
          value={depositPercent}
          onChange={(e) => setDepositPercent(e.target.value)}
          type='number'
          id='DepositPercent'
          name='depositPercent'
          className={`border text-gray-900 rounded-[4px] ${
            depositPercent
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
          } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='00'
          required
        />
        {depositPercent && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <button
        onClick={handelSubmitPercent}
        className='button_gradient'
        disabled={loading}
      >
        {loading ? (
          <>
            <FaSpinner className='animate-spin' />
            Loading...
          </>
        ) : (
          <>
            Updated <GrUpdate />
          </>
        )}
      </button>
    </div>
  );
}

export default PaymentSetting;

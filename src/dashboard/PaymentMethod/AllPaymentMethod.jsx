import React, { useEffect, useState } from 'react';

import OkWalletPaymentMethod from './AllPaymentMethod/OkWalletPayment/OkWalletPaymentMethod';
import MyCashPaymentMethod from './AllPaymentMethod/MyCashPayment/MyCashPaymentMethod';
import UpayPaymentMethod from './AllPaymentMethod/UpayPayment/UpayPaymentMethod';
import RocketPaymentMethod from './AllPaymentMethod/RocketPayment/RocketPaymentMethod';
import NagadPaymentMethod from './AllPaymentMethod/NagadPayment/NagadPaymentMethod';

import './AllPaymentMethod.css';
import TitleDynamic from '../../TitleDynamic';
import BkashPaymentMethod from './AllPaymentMethod/BkashPayment/BkashPaymentMethod';
import SearchInputField from '../../components/SearchInputField';

function AllPaymentMethod() {
  const [searchPaymentMethod, setSearchPaymentMethod] = useState('');

  // close on click outside
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addDropdownText, setAddDropdownText] = useState('Bkash');
  const [showPaymentList, setShowPaymentList] = useState(false);

  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest('#handleClickOutsideOperator')) {
        setIsDropdownOpen(false);
      }
    };

    const handleClickOutsideSearch = (event) => {
      if (!event.target.closest('#showPaymentList')) {
        setShowPaymentList(false);
      }
    };

    window.document.addEventListener('click', handleClickOutsideOperator);
    window.document.addEventListener('click', handleClickOutsideSearch);

    return () => {
      window.document.removeEventListener('click', handleClickOutsideOperator);
      window.document.removeEventListener('click', handleClickOutsideSearch);
    };
  }, []);
  return (
    <section className='relative w-full bg-white dark:bg-[#1F2836]  rounded-[4px] mr-3 boxShadow-table mb-5'>
      <div className='bg-gray-50 dark:bg-gray-900'>
        <TitleDynamic title='All Payment Method' />

        <div className=' bg-white dark:bg-gray-800'>
          <div className='flex gap-2 mb-1  flex-wrap pt-6 px-5 relative'>
            <button
              onClick={() => {
                setAddDropdownText('Bkash')
              }}
              className={`${addDropdownText === 'Bkash' ? 'button_gradient' : 'button_active'} w-full md:w-fit`}
            >
              Bkash
            </button>
            <button
              onClick={() => {
                setAddDropdownText('Nagad')
              }}
              className={`${addDropdownText === 'Nagad' ? 'button_gradient' : 'button_active'} w-full md:w-fit`}
            >
              Nagad
            </button>
            <button
              onClick={() => {
                setAddDropdownText('Rocket')
              }}
              className={`${addDropdownText === 'Rocket' ? 'button_gradient' : 'button_active'} w-full md:w-fit`}
            >
              Rocket
            </button>
            <button
              onClick={() => {
                setAddDropdownText('Upay')
              }}
              className={`${addDropdownText === 'Upay' ? 'button_gradient' : 'button_active'} w-full md:w-fit`}
            >
              Upay
            </button>
            <button
              onClick={() => {
                setAddDropdownText('MyCash')
              }}
              className={`${addDropdownText === 'MyCash' ? 'button_gradient' : 'button_active'} w-full md:w-fit`}
            >
              My Cash
            </button>
            <button
              onClick={() => {
                setAddDropdownText('OkWallet')
              }}
              className={`${addDropdownText === 'OkWallet' ? 'button_gradient' : 'button_active'} w-full md:w-fit`}
            >
              Ok Wallet
            </button>
          </div>

          <div className='w-full'>
            {addDropdownText === 'Bkash' && (
              <div className='active'>
                <BkashPaymentMethod />
              </div>
            )}
            {addDropdownText === 'Nagad' && (
              <div className='active'>
                <NagadPaymentMethod />
              </div>
            )}
            {addDropdownText === 'Rocket' && (
              <div className='active'>
                <RocketPaymentMethod />
              </div>
            )}
            {addDropdownText === 'Upay' && (
              <div className='active'>
                <UpayPaymentMethod />
              </div>
            )}
            {addDropdownText === 'MyCash' && (
              <div className='active'>
                <MyCashPaymentMethod />
              </div>
            )}
            {addDropdownText === 'OkWallet' && (
              <div className='active'>
                <OkWalletPaymentMethod />
              </div>
            )}
          </div>
        </div>
      </div>
    </section >
  );
}

export default AllPaymentMethod;

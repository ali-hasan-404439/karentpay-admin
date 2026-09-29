import React, { useState } from 'react';
import InputField from '../../../../components/InputField';

function OkWalletAdd({ setDropdownModel }) {
  const [okWalletKeyLive, setOkWalletKeyLive] = useState('');
  const [userNameLive, setUserNameLive] = useState('');
  const [okWalletSecretLive, setOkWalletSecretLive] = useState('');
  const [okWalletPasswordLive, setOkWalletPasswordLive] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!userNameLive) newErrors.userNameLive = 'User Name is required';
    if (!okWalletKeyLive)
      newErrors.okWalletKeyLive = 'Ok Wallet Key is required';
    if (!okWalletSecretLive)
      newErrors.okWalletSecretLive = 'Ok Wallet Secret is required';
    if (!okWalletPasswordLive)
      newErrors.okWalletPasswordLive = 'Ok Wallet Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // console.log('Form submitted with values:');

    // Reset form and close modal
    setUserNameLive('');
    setOkWalletKeyLive('');
    setOkWalletSecretLive('');
    setOkWalletPasswordLive('');
    setErrors({});
    setDropdownModel(false);
  };

  return (
    <div
      id='popup-modal'
      className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50'
    >
      <div className='relative p-4 w-full max-w-3xl'>
        <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto'>
          <form onSubmit={handleSubmit} className='p-10 space-y-5'>
            <InputField
              label='User Name'
              value={userNameLive}
              onChange={setUserNameLive}
              id='userNameLive'
              error={errors.userNameLive}
            />
            <InputField
              label='Ok Wallet  Public Key'
              value={okWalletKeyLive}
              onChange={setOkWalletKeyLive}
              id='okWalletKeyLive'
              error={errors.okWalletKeyLive}
            />
            <InputField
              label='Ok Wallet Private Key'
              value={okWalletSecretLive}
              onChange={setOkWalletSecretLive}
              id='okWalletSecretLive'
              error={errors.okWalletSecretLive}
            />
            <InputField
              label='Ok Wallet Password'
              value={okWalletPasswordLive}
              onChange={setOkWalletPasswordLive}
              id='okWalletPasswordLive'
              error={errors.okWalletPasswordLive}
            />

            <div className='flex items-center gap-2'>
              <button type='submit' className='button_gradient'>
                Add
              </button>
              <button
                onClick={() => setDropdownModel(false)}
                type='button'
                className='button_cancel'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OkWalletAdd;

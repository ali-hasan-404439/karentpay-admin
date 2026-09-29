import React, { useState } from 'react';
import InputField from '../../../../components/InputField';

function MyCashAdd({ setDropdownModel }) {
  const [myCashKeyLive, setMyCashKeyLive] = useState('');
  const [userNameLive, setUserNameLive] = useState('');
  const [myCashSecretLive, setMyCashSecretLive] = useState('');
  const [myCashPasswordLive, setMyCashPasswordLive] = useState('');

  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    if (!userNameLive.trim()) {
      newErrors.userNameLive = 'User Name is required.';
    }

    if (!myCashKeyLive.trim()) {
      newErrors.myCashKeyLive = 'My Cash Key is required.';
    }

    if (!myCashSecretLive.trim()) {
      newErrors.myCashSecretLive = 'My Cash Secret is required.';
    }

    if (!myCashPasswordLive.trim()) {
      newErrors.myCashPasswordLive = 'My Cash Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      // Perform further actions (e.g., API call, close modal, etc.)
      setDropdownModel(false);
    } else {
      // console.error('Validation errors:', errors);
    }
  };

  return (
    <div
      id='popup-modal'
      className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50'
    >
      <div className='relative p-4 w-full max-w-3xl'>
        <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto'>
          <div className='p-10 space-y-5'>
            {/* User Name */}
            <InputField
              label='User Name'
              value={userNameLive}
              onChange={setUserNameLive}
              id='userNameLive'
              error={errors.userNameLive}
            />

            {/* My Cash Key */}
            <InputField
              label='My Cash Public key'
              value={myCashKeyLive}
              onChange={setMyCashKeyLive}
              id='MyCashKey'
              error={errors.myCashKeyLive}
            />

            {/* My Cash Secret */}
            <InputField
              label='My Cash Private key'
              value={myCashSecretLive}
              onChange={setMyCashSecretLive}
              id='MyCashSecret'
              error={errors.myCashSecretLive}
            />

            {/* My Cash Password */}
            <InputField
              label='My Cash Password'
              value={myCashPasswordLive}
              onChange={setMyCashPasswordLive}
              id='MyCashPassword'
              error={errors.myCashPasswordLive}
            />

            {/* Buttons */}
            <div className='flex gap-2 mt-5'>
              <button onClick={handleSubmit} className='button_gradient'>
                Added Payment
              </button>
              <button
                onClick={() => setDropdownModel(false)}
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
  );
}

export default MyCashAdd;

import React, { useState } from 'react';
import InputField from '../../../../components/InputField';

function RocketPaymentAdd({ setDropdownModel }) {
  const [rocketkeyLive, setRocketkeyLive] = useState('');
  const [userNameLive, setUserNameLive] = useState('');
  const [rocketSecretLive, setRocketSecretLive] = useState('');
  const [rocketPasswordLive, setRocketPasswordLive] = useState('');
  const [errors, setErrors] = useState({});

  function validateFields() {
    const newErrors = {};

    if (!userNameLive.trim()) newErrors.userNameLive = 'User Name is required.';
    if (!rocketkeyLive.trim())
      newErrors.rocketkeyLive = 'Rocket Key is required.';
    if (!rocketSecretLive.trim())
      newErrors.rocketSecretLive = 'Rocket Secret is required.';
    if (!rocketPasswordLive.trim())
      newErrors.rocketPasswordLive = 'Rocket Password is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleRocketPayment() {
    if (validateFields()) {
      const formData = {
        userName: userNameLive,
        rocketKey: rocketkeyLive,
        rocketSecret: rocketSecretLive,
        rocketPassword: rocketPasswordLive
      };
      // console.log('Form Data:', formData);
      // Add further logic, such as API calls here
    }
  }

  return (
    <div
      id='popup-modal'
      className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50'
    >
      <div className='relative p-4 w-full max-w-3xl'>
        <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto'>
          {/* Modal content */}
          <div className='p-10 space-y-5'>
            <InputField
              label='User Name'
              value={userNameLive}
              onChange={setUserNameLive}
              id='userNameLive'
              error={errors.userNameLive}
            />

            <InputField
              label='Rocket Key'
              value={rocketkeyLive}
              onChange={setRocketkeyLive}
              id='rocketKeyLive'
              error={errors.rocketkeyLive}
            />

            <InputField
              label='Rocket Secret'
              value={rocketSecretLive}
              onChange={setRocketSecretLive}
              id='rocketSecretLive'
              error={errors.rocketSecretLive}
            />

            <InputField
              label='Rocket Password'
              value={rocketPasswordLive}
              onChange={setRocketPasswordLive}
              id='rocketPasswordLive'
              error={errors.rocketPasswordLive}
            />

            <div className='flex items-center gap-2'>
              <button onClick={handleRocketPayment} className='button_gradient'>
                Submit
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

export default RocketPaymentAdd;

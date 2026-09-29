import React, { useState } from 'react';
import InputField from '../../../../components/InputField';

function UpayPaymentAdd({ setDropdownModel }) {
  const [upaykeyLive, setUpaykeyLive] = useState('');
  const [userNameLive, setUserNameLive] = useState('');
  const [upaySecretLive, setUpaySecretLive] = useState('');
  const [upayPasswordLive, setUpayPasswordLive] = useState('');
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    if (!userNameLive) newErrors.userNameLive = 'User Name is required';
    if (!upaykeyLive) newErrors.upaykeyLive = 'Upay Key is required';
    if (!upaySecretLive) newErrors.upaySecretLive = 'Upay Secret is required';
    if (!upayPasswordLive)
      newErrors.upayPasswordLive = 'Upay Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateInputs()) {

      setDropdownModel(false);
    }
  };

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
              label='Upay Public Key'
              value={upaykeyLive}
              onChange={setUpaykeyLive}
              id='upaykeyLive'
              error={errors.upaykeyLive}
            />

            <InputField
              label='Upay Private Key'
              value={upaySecretLive}
              onChange={setUpaySecretLive}
              id='upaySecretLive'
              error={errors.upaySecretLive}
            />

            <InputField
              label='Upay Password'
              value={upayPasswordLive}
              onChange={setUpayPasswordLive}
              id='upayPasswordLive'
              error={errors.upayPasswordLive}
            />

            <div className='flex items-center gap-2'>
              <button onClick={handleSubmit} className='button_gradient'>
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

export default UpayPaymentAdd;

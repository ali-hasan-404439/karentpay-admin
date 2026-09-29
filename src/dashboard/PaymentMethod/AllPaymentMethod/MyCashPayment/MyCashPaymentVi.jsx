import { useState } from 'react';
import InputField from '../../../../components/InputField';

function MyCashPaymentView({ myCashPaymentView, setMyCashPaymentView, id }) {
  const [userName, setUserName] = useState('');
  const [myCashPassword, setMyCashPassword] = useState('');
  const [myCashkey, setMyCashkey] = useState('');
  const [myCashSecret, setMyCashSecret] = useState('');
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    if (!userName.trim()) {
      newErrors.userName = 'User Name is required.';
    }

    if (!myCashkey.trim()) {
      newErrors.myCashkey = 'My Cash Key is required.';
    }

    if (!myCashSecret.trim()) {
      newErrors.myCashSecret = 'My Cash Secret is required.';
    }

    if (!myCashPassword.trim()) {
      newErrors.myCashPassword = 'My Cash Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const isValid = validateInputs();
    if (isValid) {
      setIsModalOpen(true);
    }
  };
  return (
    <div>
      {myCashPaymentView && (
        <div
          id='popup-modal'
          className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50'
        >
          <div className='relative p-4 w-full max-w-3xl'>
            <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto'>
              {/* Modal content */}
              <div className='p-4 pr-10 md:p-5 w-full'>
                <InputField
                  label='User Name'
                  value={userName}
                  onChange={setUserName}
                  errors={errors.userName}
                />

                <InputField
                  label='MyCash Key'
                  value={myCashkey}
                  onChange={setMyCashkey}
                  errors={errors.myCashkey}
                />

                <InputField
                  label='MyCash Secret'
                  value={myCashSecret}
                  onChange={setMyCashSecret}
                  errors={errors.myCashSecret}
                />

                <InputField
                  label='MyCash Password'
                  value={myCashPassword}
                  onChange={setMyCashPassword}
                  errors={errors.myCashPassword}
                />

                <div className='flax gap-1'>
                  <button
                    onClick={handleSubmit}
                    className='text-white bg-gradient-to-r from-[#395BEF] to-[#5C28D5] rounded-[4px] px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 mt-5'
                  >
                    {' '}
                    Updated New
                  </button>
                  <button
                    onClick={() => setMyCashPaymentView(false)}
                    type='button'
                    className='py-2.5 px-5 ms-3 dark:text-white bg-gray-200 rounded-[4px] hover:bg-red-500 dark:hover:bg-red-500 hover:text-white cursor-pointer dark:bg-gray-600  '
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCashPaymentView;

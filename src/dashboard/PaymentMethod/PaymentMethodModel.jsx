import { useState } from 'react';

function PaymentMethodModel({ dropdownModel, setDropdownModel }) {
  const [nagadkey, setNagadkey] = useState('');
  const [userName, setUserName] = useState('');
  const [nagadSecret, setNagadSecret] = useState('');
  const [nagadPassword, setNagadPassword] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');

  function handlNagadhPayment() {
    if (
      userName === '' ||
      nagadkey === '' ||
      nagadSecret === '' ||
      nagadPassword === '' ||
      callbackUrl === ''
    ) {
      return alert('Please fill all input fields');
    }
    constnagadPayment = {
      userName,
      nagadkey,
      nagadSecret,
      nagadPassword,
      callbackUrl
    };
    alert(userName);
  }
  return (
    <>
      {dropdownModel && (
        <div
          id='popup-modal'
          className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50'
        >
          <div className='relative p-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
            <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700'>
              {/* Modal content */}
              <div className='p-4 pr-10 md:p-5 w-full'>
                <div className='relative mt-5'>
                  <label
                    htmlFor='User Name'
                    className='block mb-1  text-black dark:text-white'
                  >
                    User Name
                  </label>

                  <input
                    onChange={(e) => setUserName(e.target.value)}
                    type='text'
                    id='User Name'
                    name='siteUrl'
                    className={`border  text-gray-900  rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      userName
                        ? 'focus:ring-green-500  border-green-500'
                        : 'border-gray-300 '
                    }`}
                    placeholder='User Name'
                    required
                  />

                  {userName && (
                    <span className='absolute top-[2.7rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                      <LuCheck />
                    </span>
                  )}
                </div>

                <div className='relative mt-3'>
                  <label
                    htmlFor='Nagad key'
                    className='block mb-1  text-black dark:text-white'
                  >
                    Nagad key
                  </label>

                  <input
                    onChange={(e) => setNagadkey(e.target.value)}
                    type='text'
                    id='Nagad key'
                    name='siteUrl'
                    className={`border  text-gray-900  rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      nagadkey
                        ? 'focus:ring-green-500  border-green-500'
                        : 'border-gray-300 '
                    }`}
                    placeholder='Nagad key'
                    required
                  />

                  {nagadkey && (
                    <span className='absolute top-[2.7rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                      <LuCheck />
                    </span>
                  )}
                </div>

                <div className='relative mt-3'>
                  <label
                    htmlFor='Nagad Secret'
                    className='block mb-1  text-black dark:text-white'
                  >
                    Nagad Secret
                  </label>

                  <input
                    onChange={(e) => setNagadSecret(e.target.value)}
                    type='text'
                    id='Nagad Secret'
                    name='siteUrl'
                    className={`border  text-gray-900  rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      nagadSecret
                        ? 'focus:ring-green-500  border-green-500'
                        : 'border-gray-300 '
                    }`}
                    placeholder='Nagad Secret'
                    required
                  />

                  {nagadSecret && (
                    <span className='absolute top-[2.7rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                      <LuCheck />
                    </span>
                  )}
                </div>

                <div className='relative mt-3'>
                  <label
                    htmlFor='Nagad Password'
                    className='block mb-1  text-black dark:text-white'
                  >
                    Nagad Password
                  </label>

                  <input
                    onChange={(e) => setNagadPassword(e.target.value)}
                    type='text'
                    id='Nagad Password'
                    name='siteUrl'
                    className={`border  text-gray-900  rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      nagadPassword
                        ? 'focus:ring-green-500  border-green-500'
                        : 'border-gray-300 '
                    }`}
                    placeholder='Nagad Password'
                    required
                  />

                  {nagadPassword && (
                    <span className='absolute top-[2.7rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                      <LuCheck />
                    </span>
                  )}
                </div>

                <div className='relative mt-3'>
                  <label
                    htmlFor='Callback URL'
                    className='block mb-1  text-black dark:text-white'
                  >
                    Callback URL
                  </label>

                  <input
                    onChange={(e) => setCallbackUrl(e.target.value)}
                    type='url'
                    id='Callback URL'
                    name='siteUrl'
                    className={`border  text-gray-900  rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      callbackUrl
                        ? 'focus:ring-green-500  border-green-500'
                        : 'border-gray-300 '
                    }`}
                    placeholder='Callback URL'
                    required
                  />

                  {callbackUrl && (
                    <span className='absolute top-[2.7rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                      <LuCheck />
                    </span>
                  )}
                </div>

                <div className='flax gap-1'>
                  <button
                    className='text-white bg-gradient-to-r from-[#395BEF] to-[#5C28D5]rounded-[4px]  px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 mt-5'
                    onClick={handlNagadhPayment}
                  >
                    {' '}
                    Update Now
                  </button>
                  <button
                    onClick={() => setDropdownModel(false)}
                    type='button'
                    className='py-2.5 px-5 ms-3  bg-gray-200 rounded-[4px] hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer dark:bg-gray-600  '
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

export default PaymentMethodModel;

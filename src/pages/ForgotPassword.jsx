import { useState } from 'react';

import { LuCheck } from 'react-icons/lu';

import forgot from '../images/forgot-password.png';
import { toast } from 'react-toastify';
import TitleDynamic from '../TitleDynamic';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [yourOpt, setYourOpt] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  function handelLogIn() {
    toast.success(email);
  }

  const otp = true;

  return (
    <section className=' dark:bg-gray-900'>
      <TitleDynamic title='Forgot Password' />

      <div className='flex items-center justify-between  flex-col-reverse lg:flex-row px-6 py-8 mx-auto max-w-7xl lg:h-screen lg:py-0'>
        <div
          className='w-full bg-white rounded-[4px] dark:border md:mt-0 max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700'
          style={{
            boxShadow:
              '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
          }}
        >
          <div className='p-6 space-y-4 md:space-y-3 sm:p-8 '>
            <h2 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
              Forgot <span className='text-blue-600'>Your Password</span>
            </h2>

            <div className='space-y-4'>
              {otp ? (
                <>
                  <div className='relative'>
                    <label
                      htmlFor='otp'
                      className='block mb-1  font-medium text-gray-900 dark:text-white'
                    >
                      Your Otp
                    </label>

                    <input
                      onChange={(e) => setYourOpt(e.target.value)}
                      type='text'
                      id='otp'
                      name='siteUrl'
                      className={`border  text-gray-900  rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                        yourOpt
                          ? 'focus:ring-green-500  border-green-500'
                          : 'border-gray-300 '
                      }`}
                      placeholder='Your Otp'
                      required
                    />

                    {yourOpt && (
                      <span className='absolute top-[2.3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                        <LuCheck />
                      </span>
                    )}
                  </div>

                  <div className='relative'>
                    <label
                      htmlFor='password'
                      className='block mb-1  font-medium text-gray-900 dark:text-white'
                    >
                      New Password
                    </label>

                    <input
                      onChange={(e) => setNewPassword(e.target.value)}
                      type='text'
                      id='Whatsapp'
                      name='siteUrl'
                      className={`border  text-gray-900  rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                        newpassword
                          ? 'focus:ring-green-500  border-green-500'
                          : 'border-gray-300 '
                      }`}
                      placeholder='New Password'
                      required
                    />

                    {newpassword && (
                      <span className='absolute top-[2.3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                        <LuCheck />
                      </span>
                    )}
                  </div>

                  <div className='relative'>
                    <label
                      htmlFor='Confirm'
                      className='block mb-1  font-medium text-gray-900 dark:text-white'
                    >
                      {' '}
                      Confirm Password
                    </label>

                    <input
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type='text'
                      id='Confirm'
                      name='siteUrl'
                      className={`border  text-gray-900  rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                        confirmpassword
                          ? 'focus:ring-green-500  border-green-500'
                          : 'border-gray-300 '
                      }`}
                      placeholder='Confirm Password'
                      required
                    />

                    {confirmpassword && (
                      <span className='absolute top-[2.3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                        <LuCheck />
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className='relative'>
                  <label
                    htmlFor='email'
                    className='block mb-1  font-medium text-gray-900 dark:text-white'
                  >
                    Your email
                  </label>

                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    id='email'
                    name='siteUrl'
                    className={`border  text-gray-900  rounded-[4px]  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                      email
                        ? 'focus:ring-green-500  border-green-500'
                        : 'border-gray-300 '
                    }`}
                    placeholder='Your Email'
                    required
                  />

                  {email && (
                    <span className='absolute top-[2.3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                      <LuCheck />
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={handelLogIn}
                className='w-full text-white bg-gradient-to-t from-[#395BEF] to-[#5C28D5] focus:outline-none font-medium rounded-[4px]  px-5 py-2.5 text-center'
              >
                {otp ? 'Update New' : 'Continue'}
              </button>
            </div>
          </div>
        </div>

        <img src={forgot} alt='log in' />
      </div>
    </section>
  );
}

export default ForgotPassword;

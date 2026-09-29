import { useEffect, useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { FaEye, FaSpinner } from 'react-icons/fa';
import { IoMdEyeOff } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import loginSvg from '../images/login.svg';
import { toast } from 'react-toastify';
import Auth from './../utils/Auth';

import axios from 'axios';
import TitleDynamic from '../TitleDynamic';

function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { isLogin, setLogin, ApiRequest } = Auth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin()) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handelLogIn = async (event) => {
    event.preventDefault();

    if (!email) return toast.error('Please enter email');
    if (!password) return toast.error('Please enter password');

    setLoading(true);
    try {
      const response = await ApiRequest({
        url: '/admin/login',
        formdata: { email, password }
      });
      if (response && response?.status === 200) {
        toast.success('You have successfully logged In.');
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        setLogin(response.data.token);
        navigate('/');
      } else {
        toast.error(
          response?.message || 'An error occurred. Please try again.'
        );
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  // data fetch from api in setting
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/front/setting/logo-identity`
        );
        setData(response?.data?.settings);
      } catch (error) {
        // console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <section className='dark:bg-gray-900'>
      <TitleDynamic title='Login' />
      <div className='flex items-center justify-between flex-col-reverse lg:flex-row px-6 py-8 mx-auto max-w-7xl md:h-screen lg:py-0'>
        <div
          className='w-full bg-white rounded-[4px] dark:border md:mt-0 max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700'
          style={{
            boxShadow:
              '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
          }}
        >
          <div className='p-6 space-y-4 md:space-y-3 sm:p-8'>
            <img
              src={data?.logoImage}
              alt='logo'
              className={data?.logoImage ? 'block' : 'hidden'}
            />

            <form onSubmit={handelLogIn}>
              <div className='space-y-4 md:space-y-6'>
                <div className='relative'>
                  <label
                    htmlFor='email'
                    className='mb-2 inline-block text-sm  sm:text-base'
                  >
                    Your email
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type='email'
                    id='email'
                    autoComplete='email'
                    name='email'
                    className={`w-full rounded border bg-gray-50 px-3 py-2  outline-none ring-blue-500 transition duration-100 focus:ring-[2px] ${
                      email ? 'border-green-500' : 'border-gray-500'
                    }`}
                    placeholder='Your Email'
                    required
                  />
                  {email && (
                    <span className='absolute top-[2.7rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                      <LuCheck />
                    </span>
                  )}
                </div>

                <div className='relative'>
                  <label
                    htmlFor='password'
                    className='mb-2 inline-block text-sm  sm:text-base'
                  >
                    Password
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    autoComplete='current-password'
                    className={`w-full rounded border bg-gray-50 px-3 py-2  outline-none ring-blue-500 transition duration-100 focus:ring-[2px] ${
                      password ? 'border-green-500' : 'border-gray-500'
                    }`}
                    placeholder='Your Password'
                    required
                  />
                  <div className='absolute top-11 right-2 text-xl text-blue-600 cursor-pointer'>
                    <div onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <IoMdEyeOff /> : <FaEye />}
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-start'>
                    <div className='flex items-center h-5'>
                      <input
                        id='remember'
                        aria-describedby='remember'
                        type='checkbox'
                        className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300  '
                      />
                    </div>
                    <div className='ml-3 text-size'>
                      <label
                        htmlFor='remember'
                        className='text-gray-500 dark:text-gray-300'
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <Link
                    to='/forgot/password'
                    className='font-medium black dark:text-white hover:underline dark:text-primary-500'
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type='submit'
                  className='button_gradient w-full'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className='animate-spin' />
                      Loading...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <img src={loginSvg} alt='log in' />
      </div>
    </section>
  );
}

export default LogIn;

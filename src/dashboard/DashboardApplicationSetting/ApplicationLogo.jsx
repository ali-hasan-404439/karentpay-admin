import { useContext, useEffect, useState } from 'react';

import { LuCheck } from 'react-icons/lu';
import { RiDeleteBin6Line } from 'react-icons/ri';

import axios from 'axios';

import TitleDynamic from '../../TitleDynamic';

import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { FaSpinner } from 'react-icons/fa';
import { contextAuth } from '../../pages/ContextProvider';

function ApplicationLogo() {

  const { logoAndIdentityData } = useContext(contextAuth);

  const [logoChangeSrc, setLogoChangeSrc] = useState(null);
  const [faviconChangeSrc, setFaviconChangeSrc] = useState(null);
  const [siteTitle, setSiteTitle] = useState('');
  const [siteURL, setSiteURL] = useState('');
  const [description, setDescription] = useState('');
  const [keyword, setKeyword] = useState('');
  const [updatedLoading, setUpdatedLoading] = useState(false);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setLogoChangeSrc(file);
  };

  const handleFaviconChange = (event) => {
    const file = event.target.files[0];
    setFaviconChangeSrc(file);
  };

  function handleSubmitFormData(e) {
    e.preventDefault();
    const target = e.target;
    const siteTitle = target.siteTitle.value;
    const siteUrl = target.siteUrl.value;
    const description = target.description.value;
    const keyword = target.keyword.value;
    setUpdatedLoading(true);
    const formData = new FormData();
    formData.append('siteName', siteTitle);
    formData.append('siteUrl', siteUrl);
    formData.append('siteDescription', description);
    formData.append('siteKeyword', keyword);
    if (logoChangeSrc) {
      formData.append('logoImage', logoChangeSrc);
    }
    if (faviconChangeSrc) {
      formData.append('faviconImage', faviconChangeSrc);
    }

    const token = Cookies.get('token');
    axios
      .post(
        import.meta.env.VITE_API_HOST + '/admin/setting/logo-identity',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      .then((response) => {
        toast.success('Logo & identity updated successfully');
        setUpdatedLoading(false);
      })
      .catch((error) => {
        toast.error('Failed to update logo & identity');
        setUpdatedLoading(false);
      });
  }

  useEffect(() => {
    if (logoAndIdentityData) {
      setSiteTitle(logoAndIdentityData?.siteName);
      setSiteURL(logoAndIdentityData?.siteUrl);
      setDescription(logoAndIdentityData?.siteDescription);
      setKeyword(logoAndIdentityData?.siteKeyword);
    }
  }, [logoAndIdentityData]);

  return (
    <form onSubmit={(e) => handleSubmitFormData(e)} className='space-y-5'>
      <TitleDynamic title='Logo Setting' />
      <div className='relative'>
        <label
          htmlFor='steatite'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Site Title
        </label>
        <input
          defaultValue={logoAndIdentityData?.siteName}
          onChange={(e) => setSiteTitle(e.target.value)}
          type='text'
          id='steatite'
          name='siteTitle'
          className={`border  text-gray-900 rounded-[4px]  block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${siteTitle
            ? 'focus:ring-green-500  border-green-500'
            : 'border-gray-300 '
            }`}
          placeholder='Site Title'
          required
        />
        {siteTitle && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <div className='relative'>
        <label
          htmlFor='Site URL'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Site URL
        </label>
        <input
          defaultValue={logoAndIdentityData?.siteUrl}
          onChange={(e) => setSiteURL(e.target.value)}
          type='text'
          id='Site URL'
          name='siteUrl'
          className={`border  text-gray-900 rounded-[4px]  block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${siteURL
            ? 'focus:ring-green-500  border-green-500'
            : 'border-gray-300 '
            }`}
          placeholder='Site URL'
          required
        />
        {siteURL && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <div className='relative'>
        <label
          htmlFor='message'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Description
        </label>
        <textarea
          defaultValue={logoAndIdentityData?.siteDescription}
          onChange={(e) => setDescription(e.target.value)}
          id='message'
          rows='4'
          name='description'
          className={`block p-3 w-full text-gray-900 rounded-[4px] border   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${description
            ? 'focus:ring-green-500 focus:border-green-500'
            : 'border-gray-300'
            }`}
          placeholder='Write your description...'
        ></textarea>
      </div>

      <div className=''>
        <label
          htmlFor='message'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Keyword
        </label>
        <textarea
          defaultValue={logoAndIdentityData?.siteKeyword}
          onChange={(e) => setKeyword(e.target.value)}
          id='message'
          rows='4'
          name='keyword'
          className={`block p-3 w-full text-gray-900  rounded-[4px] border   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${keyword
            ? 'focus:ring-green-500 focus:border-green-500'
            : 'border-gray-300'
            }`}
          placeholder='Write your keyword...'
        ></textarea>
      </div>
      <div>
        <h2 className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '>
          Logo Image
        </h2>
        <input
          onChange={handleLogoChange}
          className='block w-full text-gray-900 border border-gray-300 rounded-[4px] cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 '
          id='file_input'
          type='file'
        />
        {logoAndIdentityData?.logoImage ? (
          <div className='relative'>
            <img
              src={
                logoChangeSrc
                  ? URL.createObjectURL(logoChangeSrc)
                  : logoAndIdentityData?.logoImage
              }
              alt='background'
              className='relative mt-2 max-w-[300px] max-h-[300px]'
            />
            {logoChangeSrc && (
              <span
                onClick={() => setLogoChangeSrc('')}
                className='absolute top-1 left-[260px] flex justify-center items-center  w-7 h-7 rounded-[50%] text-center bg-red-600 text-white dark:bg-gray-500 '
              >
                <RiDeleteBin6Line />
              </span>
            )}
          </div>
        ) : (
          <div className='relative mt-2 max-w-[300px] max-h-[300px] flex items-center justify-center'>
            {/* Skeleton Loader */}
            <div className='w-full h-[200px] bg-gray-300 animate-pulse rounded-md'>
              <div className='w-full h-full flex items-center justify-center'>
                <span className='text-gray-500 text-xl'></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '>
          Favicon Image
        </h2>
        <input
          onChange={handleFaviconChange}
          className='block w-full text-gray-900 border border-gray-300 rounded-[4px] cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 '
          id='file_input'
          type='file'
        />
        {logoAndIdentityData?.faviconImage ? (

          <div className='relative'>
            <img
              src={
                faviconChangeSrc
                  ? URL.createObjectURL(faviconChangeSrc)
                  : logoAndIdentityData?.faviconImage
              }
              alt='background'
              className='relative mt-2 max-w-[300px] max-h-[300px]'
            />
            {faviconChangeSrc && (
              <span
                onClick={() => setFaviconChangeSrc('')}
                className='absolute top-1 left-[260px] flex justify-center items-center  w-7 h-7 rounded-[50%] text-center bg-red-600 text-white dark:bg-gray-500'
              >
                <RiDeleteBin6Line />
              </span>
            )}
          </div>
        ) : (
          <div className='relative mt-2 max-w-[300px] max-h-[300px] flex items-center justify-center'>
            {/* Skeleton Loader */}
            <div className='w-full h-[200px] bg-gray-300 animate-pulse rounded-md'>
              <div className='w-full h-full flex items-center justify-center'>
                <span className='text-gray-500 text-xl'></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type='submit'
        className='button_gradient'
        disabled={updatedLoading}
      >
        {updatedLoading ? (
          <>
            <FaSpinner className='animate-spin' />
            Loading...
          </>
        ) : (
          'Save'
        )}
      </button>
    </form>
  );
}

export default ApplicationLogo;

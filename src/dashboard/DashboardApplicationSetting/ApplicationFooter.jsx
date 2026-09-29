import React, { useEffect, useRef, useState } from 'react';
import { LuCheck } from 'react-icons/lu';

import axios from 'axios';
import { toast } from 'react-toastify';
import useFetchData from '../../utils/useFetchData';
import TitleDynamic from '../../TitleDynamic';
import Cookies from 'js-cookie';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';

function ApplicationFooter() {
  const footerLogoRef = useRef(null);

  const [postLoading, setPostLoading] = useState(false);
  const [footerLogo, setFooterLogo] = useState(undefined);

  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [copyright, setCopyRight] = useState('');

  const handleFooterLogo = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFooterLogo(file);
    }
  };

  const clearFooterLogo = () => {
    setFooterLogo('');
    if (footerLogoRef.current) {
      footerLogoRef.current.value = '';
    }
  };

  const { data, loading } = useFetchData('/admin/setting/footer-setting');
  const settings = data?.settings;

  useEffect(() => {
    if (settings && !loading) {
      setFacebook(settings?.FacebookUrl);
      setYoutube(settings?.YoutubeUrl);
      setWhatsapp(settings?.WhatsAppUrl);
      setPhone(settings?.Phone);
      setDescription(settings?.Description);
      setCopyRight(settings?.Copyright);
    }
  }, [settings]);

  const handleUpdateFooter = async () => {
    setPostLoading(true);

    const formData = new FormData();
    formData.append('FacebookUrl', facebook);
    formData.append('YoutubeUrl', youtube);
    formData.append('WhatsAppUrl', whatsapp);
    formData.append('Phone', phone);
    formData.append('Description', description);
    formData.append('Copyright', copyright);

    if (footerLogo) {
      formData.append('FooterLogo', footerLogo);
    }

    try {
      const token = Cookies.get('token');

      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/setting/footer-setting`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message);
      }
      setPostLoading(false);
    } catch (error) {
      toast.error('Something went wrong');
      setPostLoading(false);
    }
  };

  return (
    <div className='space-y-5'>
      <TitleDynamic title='Footer Setting' />
      <div>
        <h2 className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '>
          Footer Logo
        </h2>

        <input
          ref={footerLogoRef}
          onChange={handleFooterLogo}
          className='block w-full text-gray-900 border border-gray-300 rounded-[4px] cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mt-1'
          id='file_input'
          type='file'
        />
        {loading ? (
          <div className='relative mt-3 max-w-[300px] max-h-[300px] flex items-center justify-center'>
            {/* Skeleton Loader */}
            <div className='w-full h-[300px] bg-gray-300 animate-pulse rounded-md'>
              <div className='w-full h-full flex items-center justify-center'>
                <span className='text-gray-500 text-xl'></span>
              </div>
            </div>
          </div>
        ) : (
          <div className='relative'>
            <img
              src={
                footerLogo
                  ? URL.createObjectURL(footerLogo)
                  : settings?.FooterLogo
              }
              alt='background'
              className='mt-3 max-w-[300px] max-h-[300px]'
            />

            {footerLogo && (
              <span
                onClick={clearFooterLogo}
                className='absolute top-1 left-[260px] flex justify-center items-center  w-7 h-7 rounded-[50%] text-center bg-red-600 text-white dark:bg-gray-500'
              >
                <RiDeleteBin6Line />
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor='message'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Description
        </label>
        <textarea
          defaultValue={description}
          onChange={(e) => setDescription(e.target.value)}
          id='message'
          rows='8'
          name='description'
          className={`block p-3 w-full text-gray-900  rounded-[4px] border   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            description
              ? 'focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300'
          }`}
          placeholder='Write your description...'
        ></textarea>
      </div>

      <div>
        <label
          htmlFor='Copyright'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Copyright
        </label>
        <input
          onChange={(e) => setCopyRight(e.target.value)}
          value={copyright}
          type='text'
          id='Facebook'
          name='siteUrl'
          className={` border   text-gray-900 rounded-[4px] ${
            copyright
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
          } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='Your facebook'
          required
        />
        {copyright && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <div className='relative'>
        <label
          htmlFor='Facebook'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Facebook
        </label>
        <input
          onChange={(e) => setFacebook(e.target.value)}
          value={facebook}
          type='text'
          id='Facebook'
          name='siteUrl'
          className={` border   text-gray-900 rounded-[4px] ${
            facebook
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
          } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='Your facebook'
          required
        />
        {facebook && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      <div className='relative'>
        <label
          htmlFor='Youtube'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Youtube
        </label>
        <input
          onChange={(e) => setYoutube(e.target.value)}
          value={youtube}
          type='text'
          id='Youtube'
          name='siteUrl'
          className={` border   text-gray-900 rounded-[4px] ${
            youtube
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
          } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='Your Youtube'
          required
        />
        {youtube && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      <div className='relative'>
        <label
          htmlFor='Whatsapp'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Whatsapp
        </label>
        <input
          onChange={(e) => setWhatsapp(e.target.value)}
          value={whatsapp}
          type='text'
          id='Whatsapp'
          name='siteUrl'
          className={` border   text-gray-900 rounded-[4px] ${
            whatsapp
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
          } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='Your Whatsapp'
          required
        />
        {whatsapp && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      <div className='relative'>
        <label
          htmlFor='Phone'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Phone
        </label>
        <input
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          type='text'
          id='Phone'
          name='siteUrl'
          className={` border   text-gray-900 rounded-[4px] ${
            phone
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
          } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='Your Phone'
          required
        />
        {phone && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      <button
        onClick={handleUpdateFooter}
        type='submit'
        className='button_gradient'
      >
        {postLoading ? (
          <>
            <FaSpinner className='animate-spin' />
            Loading...
          </>
        ) : (
          'Update'
        )}
      </button>
    </div>
  );
}

export default ApplicationFooter;

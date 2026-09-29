import axios from 'axios';
import { useEffect, useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { toast } from 'react-toastify';

import useFetchData from '../../utils/useFetchData';
import TitleDynamic from '../../TitleDynamic';

import Cookies from 'js-cookie';
import { FaSpinner } from 'react-icons/fa';

function ApplicationColor() {
  const [gradientColor1, setGradientColor1] = useState('');
  const [gradientColor2, setGradientColor2] = useState('');
  const [loading, setLoading] = useState(false);

  const { data } = useFetchData('/admin/setting/color-setting');
  const settings = data?.settings;
  useEffect(() => {
    if (settings) {
      setGradientColor1(settings?.GradientColor1);
      setGradientColor2(settings?.GradientColor2);
    }
  }, [settings]);

  const handleUpdateColor = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('GradientColor1', gradientColor1);
    formData.append('GradientColor2', gradientColor2);

    try {
      const token = Cookies.get('token');
      await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/setting/color-setting`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setLoading(false);
      toast.success('Color updated successfully');
    } catch (error) {
      setLoading(false);
      toast.error('Failed to update color');
    }
  };

  return (
    <div className='space-y-5'>
      <TitleDynamic title='Color Setting' />

      <div className='relative'>
        <label
          htmlFor='color'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Gradient Color 1
        </label>
        <input
          onChange={(e) => setGradientColor1(e.target.value)}
          type='text'
          id='color'
          name='color'
          value={gradientColor1}
          className={` border text-gray-900 rounded-[4px] ${gradientColor1
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='ex: #33FF57'
          required
        />
        {gradientColor1 && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      <div className='relative'>
        <label
          htmlFor='color'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Gradient Color 2
        </label>
        <input
          onChange={(e) => setGradientColor2(e.target.value)}
          type='text'
          id='color'
          name='color'
          value={gradientColor2}
          className={` border text-gray-900 rounded-[4px] ${gradientColor2
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='ex: #33FF57'
          required
        />
        {gradientColor2 && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <button
        onClick={handleUpdateColor}
        type='submit'
        className='button_gradient'
      >
        {loading ? (
          <>
            <FaSpinner className='animate-spin' />
            Loading...
          </>
        ) : (
          'Update Now'
        )}
      </button>
    </div>
  );
}

export default ApplicationColor;

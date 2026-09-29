import { useState } from 'react';

import { LuCheck } from 'react-icons/lu';
import { GrUpdate } from 'react-icons/gr';
import { FaSpinner } from 'react-icons/fa';

import TitleDynamic from '../../TitleDynamic';

import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import useFetchData from '../../utils/useFetchData';

function OthersSetting() {
  const [mapLink, setMaplink] = useState('');
  const [mapLink1, setMaplink1] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data } = useFetchData('/admin/settings/contact-page');
  if (
    data?.settings?.GoogleMapIframeLink &&
    data.settings.GoogleMapIframeLink !== mapLink
  ) {
    setMaplink(data?.settings?.GoogleMapIframeLink);
  }

  const handleSubmitPercent = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('GoogleMapIframeLink', mapLink1 ? mapLink1 : mapLink);
    const token = Cookies.get('token');
    axios
      .post(
        `${import.meta.env.VITE_API_HOST}/admin/settings/contact-page`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        if (response?.status === 200) {
          toast.success('Others settings updated successfully.');
        }
      })
      .catch((error) => {
        toast.error('Failed to update Others settings.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='space-y-5'>
      <TitleDynamic title='Others Setting' />

      <div className='relative'>
        <label
          htmlFor='GoogleMapLink'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Google Map Link
        </label>
        <input
          type='text'
          defaultValue={mapLink}
          onChange={(e) => setMaplink1(e.target.value)}
          id='GoogleMapLink'
          className={`border text-gray-900 rounded-[4px] ${mapLink1
              ? 'border-green-500 dark:border-green-500'
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='Enter Map Link'
          required
        />
        {mapLink1 && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <button
        onClick={handleSubmitPercent}
        className='button_gradient'
        disabled={loading}
      >
        {loading ? (
          <>
            <FaSpinner className='animate-spin' />
            Loading...
          </>
        ) : (
          <>
            Updated <GrUpdate />
          </>
        )}
      </button>
    </div>
  );
}

export default OthersSetting;

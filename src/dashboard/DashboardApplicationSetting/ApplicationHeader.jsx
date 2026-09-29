import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useFetchData from '../../utils/useFetchData';
import TitleDynamic from '../../TitleDynamic';
import { LuCheck } from 'react-icons/lu';
import Cookies from 'js-cookie';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';

function ApplicationHeader() {
  const { data, loading } = useFetchData('/admin/setting/header-setting');

  const [logoChangeSrc, setLogoChangeSrc] = useState(null);
  const [backgroundImages, setBackgroundImages] = useState(null);
  const [bgimglink, setbgimglink] = useState(null);
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');

  const [updatedLoading, setUpdatedLoading] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      setColor1(data?.settings?.Color1);
      setColor2(data?.settings?.Color2);
    }
  }, [data]);

  const handleBackgroundImagesChange = (event) => {
    const file = event.target.files[0];
    setBackgroundImages(file);
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setLogoChangeSrc(file);
  };

  const handlesubmit = () => {
    setUpdatedLoading(true);
    const formData = new FormData();
    if (backgroundImages) {
      formData.append('HeaderBackground', backgroundImages);
    }
    if (logoChangeSrc) {
      formData.append('HeaderBanner', logoChangeSrc);
    }
    formData.append('Color1', color1);
    formData.append('Color2', color2);

    const token = Cookies.get('token');
    axios
      .post(
        import.meta.env.VITE_API_HOST + '/admin/setting/header-setting',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      .then((response) => {
        toast.success('Header setting updated successfully');
        setUpdatedLoading(false);
      })
      .catch((error) => {
        toast.error('Failed to update header setting');
        setUpdatedLoading(false);
      });
  };

  useEffect(() => {
    setbgimglink(
      backgroundImages
        ? URL.createObjectURL(backgroundImages)
        : data?.settings?.HeaderBackground
    );
  }, [backgroundImages, data]);
  const fileInputRef = useRef(null);

  const deselectText = () => {
    fileInputRef.current.value = null;
  };

  return (
    <div className='space-y-5'>
      <TitleDynamic title='Header Setting' />

      <div>
        <h2 className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '>
          Header Logo
        </h2>
        <input
          onChange={handleLogoChange}
          className='block w-full text-gray-900 border border-gray-300 rounded-[4px] cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 '
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
                logoChangeSrc
                  ? URL.createObjectURL(logoChangeSrc)
                  : data?.settings?.HeaderBanner
              }
              alt='background'
              className='relative mt-3 max-w-[300px] max-h-[300px]'
            />
            {logoChangeSrc && (
              <span
                onClick={() => setLogoChangeSrc('')}
                className='absolute top-1 left-[260px] flex justify-center items-center  w-7 h-7 rounded-[50%] text-center bg-red-600 text-white dark:bg-gray-500'
              >
                <RiDeleteBin6Line />
              </span>
            )}
          </div>
        )}
      </div>

      <h1 className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '>
        Header Gradient Color
      </h1>
      <div>
        <label
          htmlFor='color'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Gradient Color 1
        </label>
        <input
          onChange={(e) => setColor1(e.target.value)}
          type='text'
          id='color'
          name='color'
          value={color1}
          className={` border text-gray-900 rounded-[4px] ${color1
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='ex: #33FF57'
          required
        />
        {color1 && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor='color2'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Gradient Color 2
        </label>
        <input
          onChange={(e) => setColor2(e.target.value)}
          type='text'
          id='color'
          name='color'
          value={color2}
          className={` border   text-gray-900 rounded-[4px] ${color2
              ? 'border-green-500 dark:border-green-500 '
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='ex: #33FF57'
          required
        />
        {color2 && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>

      <div>
        <h2 className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '>
          Select Body Background Image
        </h2>
        <input
          ref={fileInputRef}
          onChange={handleBackgroundImagesChange}
          className='block w-full text-gray-900 border border-gray-300 rounded-[4px] cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mt-1'
          id='file_input'
          type='file'
        />

        {bgimglink && (
          <div className='relative '>
            <img
              src={bgimglink}
              alt='background'
              className='relative mt-3 max-w-[300px] max-h-[300px]'
            />

            <span
              onClick={() => {
                deselectText();
                setbgimglink(null);
              }}
              className='absolute top-1 left-[260px] flex justify-center items-center  w-7 h-7 rounded-[50%] text-center bg-red-600 text-white dark:bg-gray-500'
            >
              <RiDeleteBin6Line />
            </span>
          </div>
        )}
      </div>

      <button onClick={handlesubmit} type='submit' className='button_gradient'>
        {updatedLoading ? (
          <>
            <FaSpinner className='animate-spin' />
            Loading...
          </>
        ) : (
          'Save'
        )}
      </button>
    </div>
  );
}

export default ApplicationHeader;

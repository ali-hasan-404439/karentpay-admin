import { useEffect, useState } from 'react';

import useFetchData from '../../../utils/useFetchData';

import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { FaSpinner } from 'react-icons/fa';
import InputField from '../../../components/InputField';

function WhyEdit({ whyEditModalOpen, setWhyEditModalOpen, setWhyUsData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imgLink, setImgLink] = useState('');
  const [inputimage, setinputimage] = useState(null);
  const [isdesible, setisdesible] = useState(false);

  const token = Cookies.get('token');

  const handleFileChange = async (e) => {
    const { files } = e.target;
    const file = files[0] || '';
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/media-upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        setImgLink(response.data.file_url);
      }
    }
  };

  useEffect(() => {
    if (whyEditModalOpen) {
      setTitle(whyEditModalOpen?.title || '');
      setDescription(whyEditModalOpen?.description || '');
      setImgLink(whyEditModalOpen?.image || '');
    }
  }, [whyEditModalOpen]);

  const handleWhyEdit = async (id) => {
    setisdesible(true);

    if (!title || !description) {
      toast.error('Please fill Required fields.');
      setisdesible(false);
      return;
    }
    if (!id) return;

    const formData = new FormData();
    if (imgLink) formData.append('image', imgLink);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('_method', 'PUT');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST
        }/admin/payment-feature-showcases/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setWhyUsData((pre) => {
        return pre.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              title,
              description,
              image: imgLink
            };
          }
          return item;
        });
      })
      toast.success(
        'Why choose our payment system feature updated successfully'
      );
      setWhyEditModalOpen('');
      setImgLink(null);
      setDescription('');
      setTitle('');
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error('Failed to update Feature');
      }
    }
    setisdesible(false);
  };

  return (
    <>
      {whyEditModalOpen && (
        <div
          id='popup-modal'
          className='fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/10 '
        >
          <div className='relative w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
            <div className='relative p-10 space-y-5 bg-white rounded-[4px] shadow dark:bg-gray-700'>
              <InputField
                label='Title'
                value={title}
                onChange={setTitle}
                id='title'
              />
              <InputField
                label='Description'
                value={description}
                onChange={setDescription}
                id='description'
                type='textarea'
              />

              <InputField
                label='Choose Image'
                value={imgLink}
                onChange={handleFileChange}
                id='image'
                type='file'
                image={imgLink}
                close={setImgLink}
              />
              <div className='flex items-center gap-2 mt-5'>
                <button
                  disabled={isdesible}
                  onClick={() => handleWhyEdit(whyEditModalOpen?.id)}
                  type='button'
                  className='button_gradient'
                >
                  {isdesible ? (
                    <>
                      <FaSpinner className='animate-spin' />
                      Loading...
                    </>
                  ) : (
                    <>Update</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setWhyEditModalOpen('');
                    setinputimage(null);
                  }}
                  type='button'
                  className='button_cancel'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WhyEdit;

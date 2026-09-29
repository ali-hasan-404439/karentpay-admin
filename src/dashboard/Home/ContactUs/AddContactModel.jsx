import { useState, useEffect, useRef } from 'react';
import { LuCheck } from 'react-icons/lu';
import { IoIosSend } from 'react-icons/io';

import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { FaSpinner } from 'react-icons/fa';
import InputField from '../../../components/InputField';

function AddContactModel({ addContact, setAddContact, setContactData }) {
  const [name, setName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [imgLink, setImgLink] = useState(null);
  const [isDesible, setIsDesible] = useState(false);

  const [errors, setErrors] = useState({});

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

  const validateFields = () => {
    const validationErrors = {};

    if (!name.trim()) validationErrors.name = 'Name is required.';
    if (!address1.trim()) validationErrors.address1 = 'Address 1 is required.';
    if (!phone1.trim()) {
      validationErrors.phone1 = 'Phone 1 is required.';
    }
    if (!imgLink) validationErrors.imgLink = 'Image is required.';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleContact = async () => {
    if (!validateFields()) return;
    setIsDesible(true);

    const formData = new FormData();
    formData.append('BranchOfficeName', name);
    formData.append('BranchOfficeAddress1', address1);
    formData.append('BranchOfficeAddress2', address2);
    formData.append('BranchOfficePhone1', phone1);
    formData.append('BranchOfficePhone2', phone2);
    formData.append('BranchOfficePhone3', phone3);
    if (imgLink) {
      formData.append('BranchOfficeImage', imgLink);
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/contact-page-locations`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/admin/contact-page-locations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setContactData(response?.data);
      } catch (err) {
        // console.error("Error fetching data:", err);
      }
      toast.success('Contact added successfully');
      cleare();
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error('Failed to add contact');
      }
    }
    setIsDesible(false);
  };

  const cleare = () => {
    setAddContact('');
    setImgLink(null);
    setName('');
    setAddress1('');
    setAddress2('');
    setPhone1('');
    setPhone2('');
    setPhone3('');
    setErrors({});
  };

  return (
    <>
      {addContact && (
        <div
          id='popup-modal'
          className='fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/40 '
        >
          <div className='relative w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
            <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700'>
              <div className='relative p-10 space-y-5 text-black dark:text-white'>
                {/* here */}
                <InputField
                  label='Name'
                  value={name}
                  onChange={setName}
                  id='Name'
                  error={errors.name}
                  required={true}
                />
                <InputField
                  label='Address 1'
                  value={address1}
                  onChange={setAddress1}
                  id='Address1'
                  error={errors.address1}
                  required={true}
                />
                <InputField
                  label='Address 2'
                  value={address2}
                  onChange={setAddress2}
                  id='Address2'
                />
                <InputField
                  label='Phone 1'
                  value={phone1}
                  onChange={setPhone1}
                  id='Phone1'
                  error={errors.phone1}
                  required={true}
                />
                <InputField
                  label='Phone 2'
                  value={phone2}
                  onChange={setPhone2}
                  id='Phone2'
                />
                <InputField
                  label='Phone 3'
                  value={phone3}
                  onChange={setPhone3}
                  id='Phone3'
                />
                <InputField
                  label='Choose Image'
                  value={imgLink}
                  onChange={handleFileChange}
                  id='image'
                  type='file'
                  error={errors.imgLink}
                  image={imgLink}
                  close={setImgLink}
                  required={true}
                />

                <div className='flex items-center gap-1 mb-2 '>
                  <button
                    disabled={isDesible}
                    onClick={handleContact}
                    type='button'
                    className='button_gradient'
                  >
                    {isDesible ? (
                      <>
                        <FaSpinner className='animate-spin' />
                        Loading...
                      </>
                    ) : (
                      <>
                        {' '}
                        Add Contact
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setAddContact(!addContact);
                      deselectFile();
                      setImgLink(null);
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
        </div>
      )}
    </>
  );
}

export default AddContactModel;

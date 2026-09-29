import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProgressUpload from './ProgressUploade';
import { FaSpinner } from 'react-icons/fa';

function EditApplication({ applicationEdit, setApplicationEdit, setData }) {
  const [isVisible, setIsVisible] = useState(false);
  const [appFile, setAppFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState('');

  const token = Cookies.get('token');

  useEffect(() => {
    if (applicationEdit) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [applicationEdit]);

  const [data, setFormData] = useState({
    name: '',
    version: '',
    icon: '',
    details: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Clear errors as a field is changed
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
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
        setIcon(response.data.file_url);
      }
    }

    // Clear errors as a file is selected
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!data.name.trim()) {
      validationErrors.name = 'Application Name is required.';
    }
    if (!data.version.trim()) {
      validationErrors.version = 'Version is required.';
    }
    if (!data.details.trim()) {
      validationErrors.details = 'Details are required.';
    }
    if (!icon) {
      validationErrors.icon = 'Icon is required.';
    }
    return validationErrors;
  };

  const handleSubmit = async () => {
    // error validation check
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    }

    if (!token) return toast.error('You need to login first.');
    setLoading(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('version', data.version);
    formData.append('icon', icon);
    formData.append('details', data.details);
    formData.append('app_file', appFile);
    formData.append('_method', 'PUT');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/applications/${applicationEdit.id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        setData((prv) => {
          return prv.map((item) => {
            if (item.id === applicationEdit.id) {
              return {
                ...item,
                name: data.name,
                version: data.version,
                icon: icon,
                details: data.details,
                app_file: appFile
              }
            }
            return item;
          })
        })
        toast.success('Application updated successfully.');
        setApplicationEdit(null);
        setIsVisible(false);
        setErrors({});
        setFormData({
          name: '',
          version: '',
          details: '',
          app_file: ''
        });
        setIcon('');
      }
    } catch (err) {
      if (err.response.data.message) {
        setLoading(false);
        return toast.error(err.response.data.message);
      }
      setLoading(false);
      return toast.error('Something went wrong.');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (applicationEdit) {
      setFormData({
        name: applicationEdit.name,
        version: applicationEdit.version,
        details: applicationEdit.details
      });
      setAppFile(applicationEdit.app_file);
      setIcon(applicationEdit.icon);
    }
  }, [applicationEdit]);
  return (
    <>
      {isVisible && (
        <div
          id='popup-modal'
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${applicationEdit ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-[4px] shadow dark:bg-gray-700 transition-transform duration-300 transform ${applicationEdit ? 'translate-y-0' : '-translate-y-20'
              }`}
          >
            <div className='p-10 space-y-5'>
              {/* Application Name Field */}
              <div className='relative'>
                <label
                  htmlFor='name'
                  className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white'
                >
                  Application Name
                </label>
                <input
                  id='name'
                  name='name'
                  value={data.name}
                  onChange={handleChange}
                  placeholder='Application Name'
                  className='block w-full p-3 text-gray-900 border border-gray-300 rounded cursor-text bg-gray-50 focus:outline-none dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                  type='text'
                  capture='user'
                />
                {errors.name && (
                  <span className='text-red-500'>{errors.name}</span>
                )}
              </div>

              {/* Version Field */}
              <div className='relative'>
                <label
                  htmlFor='version'
                  className='mb-2 inline-block text-sm  sm:text-base cursor-pointer dark:text-white'
                >
                  Version
                </label>
                <input
                  id='version'
                  name='version'
                  value={data.version}
                  onChange={handleChange}
                  placeholder='Version'
                  className='block w-full p-3 text-gray-900 border border-gray-300 rounded cursor-text bg-gray-50 focus:outline-none dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                  type='text'
                />
                {errors.version && (
                  <span className='text-red-500'>{errors.version}</span>
                )}
              </div>

              {/* Details Field */}
              <div className='relative'>
                <label
                  htmlFor='details'
                  className='mb-2 inline-block text-sm  sm:text-base cursor-pointer dark:text-white'
                >
                  Details
                </label>
                <textarea
                  id='details'
                  name='details'
                  value={data.details}
                  onChange={handleChange}
                  rows='4'
                  placeholder='Details'
                  className='block w-full p-3 text-gray-900 border border-gray-300 rounded cursor-text bg-gray-50 focus:outline-none dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                />
                {errors.details && (
                  <span className='text-red-500'>{errors.details}</span>
                )}
              </div>

              {/* Icon Upload Field */}
              <div className='relative'>
                <label
                  htmlFor='icon'
                  className='mb-2 inline-block text-sm  sm:text-base cursor-pointer dark:text-white'
                >
                  Icon
                </label>
                <input
                  id='icon'
                  name='icon'
                  onChange={handleFileChange}
                  className='block w-full text-gray-900 border border-gray-300 rounded bg-gray-50 focus:outline-none dark:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
                  type='file'
                />
                {errors.icon && (
                  <span className='text-red-500'>{errors.icon}</span>
                )}
                {icon && (
                  <img
                    src={icon}
                    alt='icon'
                    className='w-20 h-20 object-cover rounded mt-2'
                  />
                )}
              </div>
              {/* Application File Upload */}
              <ProgressUpload setAppFile={setAppFile} appFile={appFile} />

              {/* Submit Button */}
              <div className='flex items-center gap-2 pt-5'>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className='button_gradient'
                >
                  {loading ? (
                    <>
                      <FaSpinner className='animate-spin' />
                      Loading...
                    </>
                  ) : (
                    'Updated Application'
                  )}
                </button>
                <button
                  onClick={() => setApplicationEdit(null)}
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
export default EditApplication;

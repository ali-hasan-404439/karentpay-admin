import { useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { FaPlus } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';

import SaneEditor from '../../SaneEditor';

import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa6';
import InputField from '../../components/InputField';

function AddPage({ addPageModal, setAddPageModal, setTotal, setData, ItemsPerPage, currentPage }) {
  const [pageName, setPageName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const errors = {};
    if (!pageName.trim()) errors.pageName = "Page name is required.";
    if (!content.trim()) errors.content = "Content is required.";
    return errors;
  };
  const documentationsData = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('admin_user'));

    const formData = new FormData();
    formData.append('page_name', pageName);
    formData.append('content', content);
    formData.append('status', 'published');
    formData.append('user_id', user.id);

    const token = Cookies.get('token');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/pages`,
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
          import.meta.env.VITE_API_HOST +
          `/admin/pages?age=${currentPage}&per_page=${ItemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalItems: response?.data.total,
          totalPage: response?.data.last_page,
        });
        setData(response.data.data);
      } catch (err) {
        // console.error('Error fetching data:', err);
      }
      toast.success('Page added successfully!');
      setPageName('');
      setContent('');
      // Toggle the modal state
    } catch (error) {
      toast.error('Failed to add page. Please try again.');
    }
    setLoading(false);
    setAddPageModal(false);
  };

  function editorContent(text) {
    setContent(text);
  }

  return (
    <>
      <button
        onClick={() => setAddPageModal(!addPageModal)}
        className='button_gradient whitespace-nowrap w-full md:w-auto'
      >
        <FaPlus /> Add Page
      </button>

      {addPageModal && (
        <div
          id='default-modal'
          className='fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full p-5 bg-black bg-opacity-50'
        >
          <div className='relative w-full max-w-3xl max-h-[90vh] overflow-y-auto m-5 text-black dark:text-white'>
            <div className='relative p-10 space-y-5 bg-white rounded shadow dark:bg-gray-700'>
              <InputField
                type="text"
                name="title"
                value={pageName}
                onChange={setPageName}
                placeholder="Page Name"
                label="Page Name"
                error={errors.pageName}
                id="title"
                required={true}
              />
              <div className="relative ">
                <label
                  htmlFor="Documentation"
                  className="mb-2 inline-block text-sm  sm:text-base"
                >
                  Documentation <span className="text-red-600">*</span>
                </label>
                <SaneEditor
                  editorContent={editorContent}
                />
                {errors.content && (
                  <p className='text-red-500 text-sm'>{errors.content}</p>
                )}
              </div>
              <div className='flex items-center gap-2 mt-5'>
                <button
                  onClick={documentationsData}
                  className='button_gradient'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className='animate-spin' /> Loading...
                    </>
                  ) : (
                    <>
                      Add Page
                    </>
                  )}
                </button>
                <button
                  onClick={() => setAddPageModal(false)}
                  className='button_cancel'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default AddPage;

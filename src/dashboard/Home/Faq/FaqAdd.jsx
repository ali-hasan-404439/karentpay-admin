import { useEffect, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { LuCheck } from 'react-icons/lu';

import Auth from '../../../utils/Auth';

import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { FaSpinner } from 'react-icons/fa';
import InputField from '../../../components/InputField';

function FaqAdd({ faqAddedModalOpen, setFaqAddedModalOpen, setFaqData }) {
  const { isLogin } = Auth();
  const [user_id, setUserId] = useState('');

  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!answer) newErrors.answer = "Answer is required.";
    if (!question) newErrors.question = "Question is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleFaqAdded = () => {
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('answer', answer);
    formData.append('question', question);
    formData.append('user_id', user_id);

    const token = Cookies.get('token');

    axios
      .post(`${import.meta.env.VITE_API_HOST}/admin/faqs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(async (response) => {
        if (response?.status === 201) {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_HOST}/admin/faqs`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setFaqData(response.data);
          } catch (err) {
            // console.error("Error fetching data:", err);
          }
          toast.success('Review added successfully');
          setFaqAddedModalOpen('');
          setAnswer('');
          setQuestion('');
          setErrors({});
          setLoading(false);

        }
      })
      .catch((error) => {
        toast.error('Failed to add review');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem('admin_user')) {
      let user = JSON.parse(localStorage.getItem('admin_user'));
      if (user.id) {
        setUserId(user.id);
      }
    }
  }, [isLogin]);

  return (
    <>
      {faqAddedModalOpen && (
        <div
          id='popup-modal'
          className='fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/30'
        >
          <div className='relative w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
            <div className='relative p-8 bg-white rounded-[4px] shadow dark:bg-gray-700'>
              <div className='relative space-y-5 text-black dark:text-white'>
                <InputField
                  label='Question'
                  value={question}
                  onChange={setQuestion}
                  id='Question'
                  error={errors.question}
                  required={true}
                />
                <InputField
                  label='Answer'
                  value={answer}
                  onChange={setAnswer}
                  id='Answer'
                  type='textarea'
                  error={errors.answer}
                  required={true}
                />
                <div className='flex items-center gap-2'>
                  <button
                    onClick={handleFaqAdded}
                    type='button'
                    className='button_gradient'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className='animate-spin' />
                        Loading...
                      </>
                    ) : (
                      <>Submit</>
                    )}
                  </button>
                  <button
                    onClick={() => setFaqAddedModalOpen(!faqAddedModalOpen)}
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

export default FaqAdd;

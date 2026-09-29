import React, { useEffect, useState } from 'react';

import { LuCheck } from 'react-icons/lu';

import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

import TitleDynamic from '../../TitleDynamic';
import useFetchData from '../../utils/useFetchData';
import { FaSpinner } from 'react-icons/fa';

function ApplicationMail() {
  const [mailDelivery, setMailDelivery] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [contact, setContact] = useState('');
  const [noReplyEmail, setNoReplyEmail] = useState('');

  const [loading, setLoading] = useState(false);

  // Fetch mailing settings data
  const { data, setRender } = useFetchData('/admin/setting/mailing-setting');

  function handleSubmitFormData() {
    if (!isValidEmail(contact)) {
      toast.error('Contact email must be a valid email address.');
      return;
    }

    if (!isValidEmail(noReplyEmail)) {
      toast.error('No-reply email must be a valid email address.');
      return;
    }

    if (!isValidPort(smtpPort)) {
      toast.error('SMTP port must be a valid integer.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('MailDeliveryMethod', mailDelivery);
    formData.append('SMTPHost', smtpHost);
    formData.append('SMTPPort', smtpPort);
    formData.append('SMTPUsername', smtpUsername);
    formData.append('SMTPPassword', smtpPassword);
    formData.append('ContactEmail', contact);
    formData.append('NoReplyEmail', noReplyEmail);

    const token = Cookies.get('token');

    axios
      .post(
        `${import.meta.env.VITE_API_HOST}/admin/setting/mailing-setting`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => {
        if (response?.status === 200) {
          setRender(true);
          toast.success('Mailing settings updated successfully.');
        }
      })
      .catch((error) => {
        toast.error('Failed to update mailing settings.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate if the port is an integer
  const isValidPort = (port) => {
    return Number.isInteger(Number(port)) && Number(port) > 0;
  };

  useEffect(() => {
    if (data?.settings) {
      const fetchData = data.settings;
      setMailDelivery(fetchData.MailDeliveryMethod);
      setSmtpHost(fetchData.SMTPHost);
      setSmtpPort(fetchData.SMTPPort);
      setSmtpUsername(fetchData.SMTPUsername);
      setSmtpPassword(fetchData.SMTPPassword);
      setContact(fetchData.ContactEmail);
      setNoReplyEmail(fetchData.NoReplyEmail);
    }
  }, [data]);

  return (
    <div className='space-y-5'>
      <TitleDynamic title='Application || Mail Setting' />

      {/* Mail Delivery Method code start  */}
      <div className='relative'>
        <label
          htmlFor='MailDelivery'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Mail delivery method
        </label>
        <select
          onChange={(e) => setMailDelivery(e.target.value)}
          id='MailDelivery'
          name='MailDelivery'
          className={`border text-gray-900 rounded-[4px] ${mailDelivery
              ? 'border-green-500 dark:border-green-500'
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          value={mailDelivery}
          required
        >
          <option value='PHP'>PHP</option>
          <option value='SMTP'>SMTP</option>
        </select>
        {mailDelivery && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      {/* Mail Delivery Method code end  */}

      {/* SMTP Host code start  */}
      <div className='relative'>
        <label
          htmlFor='Host'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          SMTP Host
        </label>
        <input
          onChange={(e) => setSmtpHost(e.target.value)}
          type='text'
          id='Host'
          name='Host'
          className={`border text-gray-900 rounded-[4px] ${smtpHost
              ? 'border-green-500 dark:border-green-500'
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='SMTP Host'
          value={smtpHost}
          required
        />
        {smtpHost && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      {/* SMTP Host code end  */}

      {/* SMTP Port code start  */}
      <div className='relative'>
        <label
          htmlFor='Port'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          SMTP Port
        </label>
        <input
          onChange={(e) => setSmtpPort(e.target.value)}
          type='text'
          id='Port'
          name='Port'
          className={`border text-gray-900 rounded-[4px] ${smtpPort
              ? 'border-green-500 dark:border-green-500'
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='SMTP Port'
          value={smtpPort}
          required
        />
        {smtpPort && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      {/* SMTP Port code end  */}

      {/* SMTP Username code start  */}
      <div className='relative'>
        <label
          htmlFor='Username'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          SMTP Username
        </label>
        <input
          onChange={(e) => setSmtpUsername(e.target.value)}
          type='text'
          id='Username'
          name='Username'
          className={`border text-gray-900 rounded-[4px] ${smtpUsername
              ? 'border-green-500 dark:border-green-500'
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='SMTP Username'
          value={smtpUsername}
          required
        />
        {smtpUsername && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      {/* SMTP Username code end  */}

      {/* SMTP Password code start  */}
      <div className='relative'>
        <label
          htmlFor='Password'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          SMTP Password
        </label>
        <input
          onChange={(e) => setSmtpPassword(e.target.value)}
          type='password'
          id='Password'
          name='Password'
          className={`border text-gray-900 rounded-[4px] ${smtpPassword
              ? 'border-green-500 dark:border-green-500'
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='SMTP Password'
          value={smtpPassword}
          required
        />
        {smtpPassword && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      {/* SMTP Password code end  */}

      {/* Contact Email code start  */}
      <div className='relative'>
        <label
          htmlFor='Contact'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          Contact Email
        </label>
        <input
          onChange={(e) => setContact(e.target.value)}
          type='text'
          id='Contact'
          name='Contact'
          className={`border text-gray-900 rounded-[4px] ${contact
              ? 'border-green-500 dark:border-green-500'
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='Contact Email'
          value={contact}
          required
        />
        {contact && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      {/* Contact Email code end  */}

      {/* No Reply Email code start  */}
      <div className='relative'>
        <label
          htmlFor='NoReply'
          className='mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white '
        >
          No Reply Email
        </label>
        <input
          onChange={(e) => setNoReplyEmail(e.target.value)}
          type='text'
          id='NoReply'
          name='NoReply'
          className={`border text-gray-900 rounded-[4px] ${noReplyEmail
              ? 'border-green-500 dark:border-green-500'
              : 'border-gray-300'
            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
          placeholder='NoReply Email'
          value={noReplyEmail}
          required
        />
        {noReplyEmail && (
          <span className='absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
            <LuCheck />
          </span>
        )}
      </div>
      {/* No Reply Email code end  */}

      <button
        onClick={handleSubmitFormData}
        className='button_gradient'
        disabled={loading}
      >
        {loading ? (
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

export default ApplicationMail;

import { useState } from 'react';

import { LuCheck } from 'react-icons/lu';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';

import { Link } from 'react-router-dom';
import SaneEditor from '../../SaneEditor';

function DashboardEmailAdd() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState(null);

  function editorContent(text) {
    setDescription(text);
  }

  return (
    <div className='text-black dark:text-white p-4 bg-white dark:bg-gray-800 rounded-[4px] boxShadow-table'>
      <div className='block items-center justify-between bg-gray-50 p-4 dark:bg-gray-800 sm:flex'>
        <div className='flex items-center divide-x divide-gray-100 dark:divide-gray-700'>
          <div className='pr-3'>
            <Link
              to='/email'
              className='inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              <FaArrowLeftLong className='text-2xl' />
            </Link>
          </div>
          <div className='flex space-x-2 pl-4 text-gray-500'>New Message</div>
        </div>
      </div>

      <div className=' w-full pt-7 mx-auto my-0'>
        <div className='relative text-black dark:text-white '>
          <form>
            <div className=' relative'>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                id='email'
                name='siteUrl'
                className={` bg-gray-50 border border-gray-300 rounded-[4px] ${
                  email
                    ? 'border-green-500 dark:border-green-500 '
                    : 'border-gray-300'
                } block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                placeholder='To'
                required
              />
              {email && (
                <span className='absolute top-[0.8rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                  <LuCheck />
                </span>
              )}
            </div>
            <div className='my-2 relative'>
              <input
                onChange={(e) => setSubject(e.target.value)}
                type='text'
                id='subject'
                name='siteUrl'
                className={` bg-gray-50 border border-gray-300 rounded-[4px] ${
                  subject
                    ? 'border-green-500 dark:border-green-500 '
                    : 'border-gray-300'
                } block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
                placeholder='Subject'
                required
              />
              {subject && (
                <span className='absolute top-[0.8rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                  <LuCheck />
                </span>
              )}
            </div>
            <SaneEditor editorContent={editorContent} height={'380'} />
          </form>

          <div className='flex items-center pt-3 gap-2'>
            <button
              type='submit'
              className='flex items-center gap-2 px-4 py-2 text-white rounded-[4px] bg-gradient-to-r from-[#395BEF] to-[#5C28D5]'
            >
              Send{' '}
              <span>
                <FaLongArrowAltRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardEmailAdd;

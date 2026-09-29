import { useEffect, useRef, useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { LuCheck } from 'react-icons/lu';
import { IoMdClose } from 'react-icons/io';

import TitleDynamic from '../../TitleDynamic';
import DashboardWithdrawMethodDelete from './DashboardWithdrawMethodDelete';

function DashboardWithdrawMethod() {
  const [checkedState, setCheckedState] = useState([false]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [searchWithdraw, setSearchWithdraw] = useState('');
  const [filterMerchant, setFilterMerchant] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(null);

  const array = [
    {
      id: 1,
      name: 'johan ',
      method: 'Bkash',
      number: '-',
      trx: 'Payment',
      date: '21 Nov 2022',
      time: '05:00 AM',
      status: 'Pending',
      amount: '445',
      reference: 'Ali Hasan'
    },
    {
      id: 2,
      name: 'Liton Islam',
      method: 'Nagad',
      trx: 'Payment',
      number: '017832343340',
      date: '21 Nov 2022',
      time: '10:00 AM',
      status: 'Pending',
      amount: '554',
      reference: 'Ali Hasan'
    },
    {
      id: 3,
      name: 'Saddem Islam',
      method: 'Nagad',
      trx: 'Payment',
      number: '01583228340',
      date: '21 Nov 2022',
      time: '08:00 AM',
      status: 'Success',
      amount: '662',
      reference: 'Ali Hasan'
    }
  ];

  const handleCheckboxChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);
    setIsAllChecked(updatedCheckedState.every((item) => item));
  };

  const handleSelectAllChange = () => {
    const newState = !isAllChecked;
    setCheckedState(new Array(array.length).fill(newState));
    setIsAllChecked(newState);
  };

  function handleSearchAndFilterMerchant(
    array,
    searchMerchant,
    filterMerchant
  ) {
    let searchAndFilterMerchant = array;

    if (searchMerchant) {
      searchAndFilterMerchant = array.filter(
        ({ name, number, amount, reference }) =>
          (name && name.toLowerCase().includes(searchMerchant.toLowerCase())) ||
          (number &&
            number.toLowerCase().includes(searchMerchant.toLowerCase())) ||
          (amount &&
            amount.toLowerCase().includes(searchMerchant.toLowerCase())) ||
          (reference &&
            reference.toLowerCase().includes(searchMerchant.toLowerCase()))
      );
      return searchAndFilterMerchant;
    }

    if (filterMerchant && filterMerchant !== 'All Merchant') {
      searchAndFilterMerchant = searchAndFilterMerchant.filter(
        (merchant) => merchant.method === filterMerchant
      );
    } else {
      searchAndFilterMerchant = array;
    }
    return searchAndFilterMerchant;
  }

  const searchAndFilterMerchant = handleSearchAndFilterMerchant(
    array,
    searchWithdraw,
    filterMerchant
  );

  // handle delete withdraw function
  const handleDeleteWithdraw = (id) => {
    const deleteWithdrawFind = array.find(
      (deleteWithdrawFind) => deleteWithdrawFind.id === id
    );
    if (deleteWithdrawFind) {
      return setIsModalOpen(deleteWithdrawFind.id);
    }
  };

  //  filter merchant method function start
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside

  const [searchWithdrawMethod, setSearchWithdrawMethod] = useState('');
  const [showWithdrawList, setShowWithdrawList] = useState(false);

  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest('#searchWithdrawOperation')) {
        setIsDropdownOpen(false);
      }
    };

    const handleClickOutsideSearch = (event) => {
      if (!event.target.closest('#showWithdrawList')) {
        setShowWithdrawList(false);
      }
    };

    window.document.addEventListener('click', handleClickOutsideOperator);

    window.document.addEventListener('click', handleClickOutsideSearch);

    return () => {
      window.document.removeEventListener('click', handleClickOutsideOperator);

      window.document.removeEventListener('click', handleClickOutsideSearch);
    };
  }, []);
  //  filter merchant method function end

  return (
    <section className='bg-gray-50 dark:bg-gray-900 '>
      <TitleDynamic title='Merchant Request' />
      <div>
        <div className='boxShadow-table  bg-white dark:bg-gray-800 rounded-[4px] mb-4'>
          <div className='lg:flex items-center justify-between pt-[26px] px-5'>
            <div className='md:flex items-center gap-2 text-black dark:text-white'>
              {/* search input felt  */}
              <form className='flex flex-col w-full md:w-[300px] '>
                <div className='relative w-full'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none dark:text-gray-400 '>
                    <svg
                      aria-hidden='true'
                      className='w-5 h-5 '
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>

                  <input
                    onChange={(e) => setSearchWithdraw(e.target.value)}
                    type='text'
                    id='Whatsapp'
                    name='siteUrl'
                    className={`border  pl-10  rounded-[4px]  block w-full p-2.5 bg-gray-50  dark:bg-gray-700  dark:border-gray-600 dark:placeholder-gray-400  ${searchWithdraw
                        ? ' focus:border-green-500 border-green-500'
                        : 'border-gray-300 '
                      }`}
                    placeholder='Search Name, Number Amount And Reference'
                    required
                  />

                  {searchWithdraw && (
                    <span className='absolute top-[.9rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'>
                      <LuCheck />
                    </span>
                  )}
                </div>
              </form>
              {/* search input felt  */}

              <div className='w-full md:w-[250px] relative mt-2 md:mt-0'>
                <button
                  id='searchWithdrawOperation'
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`bg-gray-50 border border-gray-300 ${isDropdownOpen ? 'rounded-t-[4px]' : 'rounded-[4px]'
                    }  w-full  p-[.4rem] h-[47px] dark:bg-gray-700 dark:border-gray-600 flex items-center dark:text-gray-400  justify-between opacity-80`}
                  ref={trigger}
                >
                  {filterMerchant
                    ? filterMerchant
                    : ' Choose a Withdraw Operator'}

                  <svg
                    className={`w-2.5 h-2.5 ms-3 transition-transform transform ${isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 10 6'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m1 1 4 4 4-4'
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div
                    id='searchWithdrawOperation'
                    className='z-10 absolute button-0 left-0 bg-white rounded-b-[4px] shadow w-full md:w-[250px]  dark:bg-gray-700 boxShadow-table'
                    ref={dropdown}
                  >
                    <ul className='' aria-labelledby='searchWithdrawOperation'>
                      <li onClick={() => setFilterMerchant('All Merchant')}>
                        <a className='block px-2 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer rounded-t-[4px]'>
                          All Merchant
                        </a>
                      </li>

                      <li onClick={() => setFilterMerchant('Bkash')}>
                        <a className='block  px-2 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer rounded-t-[4px]'>
                          Bkash
                        </a>
                      </li>

                      <li onClick={() => setFilterMerchant('Nagad')}>
                        <a className='block  px-2 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer'>
                          Nagad
                        </a>
                      </li>

                      <li onClick={() => setFilterMerchant('Rocket')}>
                        <a className='block  px-2 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer '>
                          Rocket
                        </a>
                      </li>

                      <li onClick={() => setFilterMerchant('Upay')}>
                        <a className='block  px-2 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer '>
                          Upay
                        </a>
                      </li>

                      <li onClick={() => setFilterMerchant('MyCash')}>
                        <a className='block  px-2 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer'>
                          My Cash
                        </a>
                      </li>

                      <li onClick={() => setFilterMerchant('OkWallet')}>
                        <a className='block  px-2 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer rounded-b-[4px]'>
                          Ok Wallet
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div
                id='showWithdrawList'
                onClick={() => setShowWithdrawList(!showWithdrawList)}
                className='relative rounded-[4px] w-full md:w-[250px]'
                ref={trigger}
              >
                <input
                  onChange={(e) => setSearchWithdrawMethod(e.target.value)}
                  className='bg-gray-50 border border-gray-300  rounded-[4px] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 '
                  placeholder='Search Withdraw...'
                  value={searchWithdrawMethod}
                />

                {searchWithdrawMethod && (
                  <div
                    onClick={() => setSearchWithdrawMethod('')}
                    className='absolute top-[14px] right-[.5rem] w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center'
                  >
                    {' '}
                    <IoMdClose />
                  </div>
                )}
                {showWithdrawList && (
                  <div
                    id='showWithdrawList'
                    className='absolute top-full left-0 right-0 bg-white rounded-b-[4px] w-full md:w-[250px]  dark:bg-gray-700 boxShadow-table'
                    ref={dropdown}
                  >
                    {searchAndFilterMerchant.map((merchant) => (
                      <div
                        key={merchant.id}
                        className='px-2 py-1 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between'
                        onClick={() => setSearchWithdrawMethod(merchant.name)}
                      >
                        <span>
                          {merchant.name} (
                          {merchant.number ? merchant.number : ''})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='overflow-x-auto mt-9'>
            <table className='w-full text-left text-black dark:text-white'>
              <thead className='text-xs uppercase bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='pr-2 pl-6 py-3 text-left'>
                    <input
                      id='checkbox-all'
                      type='checkbox'
                      checked={isAllChecked}
                      onChange={handleSelectAllChange}
                      className='w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                    />
                  </th>

                  <th scope='col' className='px-4 py-3'>
                    SL
                  </th>

                  <th scope='col' className='px-4 py-3'>
                    Date
                  </th>

                  <th scope='col' className='px-4 py-3'>
                    Merchant
                  </th>
                  <th scope='col' className='px-4 py-3'>
                    Operator Name
                  </th>

                  <th scope='col' className='px-4 py-3'>
                    Type
                  </th>

                  <th scope='col' className='px-4 py-3'>
                    PHONE
                  </th>

                  <th scope='col' className='px-4 py-3'>
                    BALANCE
                  </th>

                  <th scope='col' className='px-4 py-3'>
                    Reference
                  </th>

                  <th scope='col' className='px-4 py-3'>
                    Status
                  </th>

                  <th scope='col' className='px-4 py-3 flex-1'>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {searchAndFilterMerchant?.map((item) => (
                  <tr
                    key={item.id}
                    className='border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  >
                    <td className='pr-2 pl-6 py-3'>
                      <input
                        id={`checkbox-table-search-${item.id}`}
                        type='checkbox'
                        checked={checkedState[item.id - 1]}
                        onChange={() => handleCheckboxChange(item.id - 1)}
                        className='w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                    </td>
                    <td className='w-4 px-4 py-3'>{item.id}</td>

                    <td className='px-4 py-2 whitespace-nowrap'>
                      {item.date && <>{item.date} <br /></>}
                      {item.time}
                    </td>

                    <td className='px-4 py-2'>
                      <h2 style={{ width: '150px' }}>{item.name}</h2>
                    </td>

                    <td className='px-4 py-2 whitespace-nowrap'>
                      <h2 style={{ width: '150px' }}>{item.method}</h2>
                    </td>

                    <td className='px-4 py-2 whitespace-nowrap'>{item.trx}</td>

                    <td className='px-4 py-2 whitespace-nowrap'>
                      {item.number}
                    </td>

                    <td className='px-4 py-2 whitespace-nowrap flex items-center gap-1'>
                      <FaDollarSign /> {item.amount}
                    </td>

                    <td className='px-4 py-2 whitespace-nowrap'>
                      <h2 style={{ width: '150px' }}>{item.reference}</h2>
                    </td>

                    <td className='px-4 py-2'>
                      <span
                        className='text-xs px-2 py-0.5 rounded flex items-center gap-2 w-fit'
                        style={{
                          background:
                            item.status === 'Pending' ? '#FFC107' : '#31c48d'
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className='px-4 py-2  flex-1'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => handleDeleteWithdraw(item.id)}
                          className='text-white w-fit bg-red-500 hover:bg-red-700  rounded-[4px] text-xl px-4 py-1 dark:bg-red-600 dark:hover:bg-red-500 focus:outline-none dark:focus:ring-red-800 flex items-center gap-1'
                        >
                          <IoClose />
                        </button>
                        {/* Modal */}
                        <DashboardWithdrawMethodDelete
                          isModalOpen={isModalOpen}
                          setIsModalOpen={setIsModalOpen}
                          id={item.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav
            className='flex flex-col items-start justify-between p-5 space-y-3 md:flex-row md:items-center md:space-y-0'
            aria-label='Table navigation'
          >
            <span className=' px-2 py-1 rounded-[4px] text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700'>
              Showing
              <span className=' text-gray-900 dark:text-white'>
                1-10
              </span>
              of
              <span className=' text-gray-900 dark:text-white'>
                1000
              </span>
            </span>

            <ul className='inline-flex items-stretch -space-x-px'>
              <li>
                <a
                  href='#'
                  className='flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  <span className='sr-only'>Previous</span>

                  <svg
                    className='w-5 h-5'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href='#'
                  className='flex items-center justify-center px-3 py-2  leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  1
                </a>
              </li>

              <li>
                <a
                  href='#'
                  className='flex items-center justify-center px-3 py-2  leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  2
                </a>
              </li>

              <li>
                <a
                  href='#'
                  aria-current='page'
                  className='z-10 flex items-center justify-center px-3 py-2  leading-tight border text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                >
                  3
                </a>
              </li>

              <li>
                <a
                  href='#'
                  className='flex items-center justify-center px-3 py-2  leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  ...
                </a>
              </li>

              <li>
                <a
                  href='#'
                  className='flex items-center justify-center px-3 py-2  leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  100
                </a>
              </li>

              <li>
                <a
                  href='#'
                  className='flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  <span className='sr-only'>Next</span>

                  <svg
                    className='w-5 h-5'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}

export default DashboardWithdrawMethod;

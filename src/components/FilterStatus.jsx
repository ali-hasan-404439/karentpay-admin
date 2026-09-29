import { FaChevronDown } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

function FilterStatus({
  showMerchantStatus,
  setShowMerchantStatus,
  setSearchMerchantStatus,
  searchMerchantStatus,
  placeholderText,
  children,
  id
}) {
  return (
    <div
      id={id}
      onClick={() => setShowMerchantStatus(!showMerchantStatus)}
      className='relative rounded-[4px] w-full md:w-[220px] mt-2 md:mt-0 cursor-pointer'
    >
      <h2
        className={`bg-gray-50 border border-gray-300 ${showMerchantStatus
            ? 'rounded-t-[4px] text-gray-900'
            : 'text-gray-600 rounded-[4px]'
          } focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:border-blue-500`}
      >
        {searchMerchantStatus ? searchMerchantStatus : placeholderText}
      </h2>
      {!searchMerchantStatus && (
        <div
          className={`absolute top-[19px] right-[.5rem] w-[14px] h-[14px] rounded-full text-gray-600 dark:text-gray-400 flex items-center justify-center transition-transform duration-300 transform ${showMerchantStatus ? 'rotate-180' : 'rotate-0'
            }`}
        >
          <FaChevronDown />
        </div>
      )}
      {searchMerchantStatus && (
        <div
          onClick={() => setSearchMerchantStatus('')}
          className='absolute top-[16px] right-[.5rem] w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center cursor-pointer'
        >
          {' '}
          <IoMdClose />
        </div>
      )}
      {showMerchantStatus && (
        <div
          id={id}
          className='absolute top-full left-0 right-0 bg-white dark:bg-gray-700 rounded-b-[4px] shadow-md z-10 max-h-[300px] overflow-y-auto'
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default FilterStatus;

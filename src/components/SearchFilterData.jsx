import { FaChevronDown } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

function SearchFilterData({
  dropdownManu,
  setDropdownManu,
  showData,
  setShowData,
  placeholderText,
  children,
  id
}) {
  return (
    <div
      id={id}
      onClick={() => setDropdownManu(!dropdownManu)}
      className='relative rounded-[4px] w-full md:w-[220px] mt-3 md:mt-0 bg-gray-50 border border-gray-300 p-3 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:border-blue-500'
    >
      {/* Display selected country name or placeholder */}
      <div
        className={`${
          showData
            ? 'text-black dark:text-white'
            : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {showData ? showData : placeholderText}
      </div>
      {/* Toggle Icon */}
      <div
        className={`absolute top-[13px] right-[.5rem] w-[20px] h-[20px] flex items-center justify-center rounded-full transition-transform duration-300 transform ${
          dropdownManu ? 'rotate-180' : 'rotate-0'
        } cursor-pointer`}
      >
        {showData ? (
          <IoMdClose
            onClick={() => setShowData(null)}
            className='text-white bg-green-500 p-[2px] rounded-full'
            size={20}
          />
        ) : (
          <FaChevronDown className='text-gray-600 dark:text-gray-400' />
        )}
      </div>

      {/* Country Dropdown */}
      {dropdownManu && (
        <div
          id={id}
          className='absolute z-10 left-0 top-9 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 w-full max-h-[300px] overflow-y-auto rounded-b-[4px] shadow-lg mt-2'
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default SearchFilterData;

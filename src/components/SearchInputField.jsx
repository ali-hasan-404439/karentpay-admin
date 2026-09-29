import { IoMdClose } from 'react-icons/io';
import { LuCheck } from 'react-icons/lu';

function SearchInputField({ searchText, setSearchText, placeholderText }) {
  return (
    <form className='flex items-center w-full md:w-[300px] '>
      <div className='relative w-full'>
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <svg
            aria-hidden='true'
            className='w-5 h-5 text-gray-500 dark:text-gray-400'
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
          onChange={(e) => setSearchText(e.target.value)}
          type='text'
          id='Whatsapp'
          name='siteUrl'
          value={searchText}
          className={`border  text-gray-900 pl-10  rounded-[4px]  block w-full p-3 bg-gray-50  dark:bg-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  ${
            searchText
              ? ' focus:border-green-500 border-green-500'
              : 'border-gray-300 '
          }`}
          placeholder={placeholderText}
          required
        />
        {searchText && (
          <span
            onClick={() => setSearchText('')}
            className='absolute top-[.9rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center cursor-pointer'
          >
            <IoMdClose />
          </span>
        )}
      </div>
    </form>
  );
}

export default SearchInputField;

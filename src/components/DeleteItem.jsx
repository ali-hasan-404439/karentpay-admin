import { FaExclamationCircle, FaSpinner } from 'react-icons/fa';

function DeleteItem({
  deleteItem,
  setDeleteItem,
  handleDeleteItem,
  text,
  loading
}) {
  if (!deleteItem) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white dark:bg-gray-700  rounded-lg shadow-lg w-96 p-6'>
        {/* Icon */}
        <div className='flex justify-center mb-4'>
          <FaExclamationCircle className='text-red-500 text-4xl' />
        </div>
        {/* Title */}
        <h2 className='text-lg font-bold text-center mb-2 dark:text-white'>
          Are you sure?
        </h2>
        {/* Description */}
        <p className='text-sm text-gray-600 dark:text-white text-center mb-6'>
          This action cannot be undone. <br /> Do you really want to delete this{' '}
          {text}?
        </p>
        {/* Buttons */}
        <div className='flex justify-center space-x-2'>
          <button
            onClick={() => handleDeleteItem(deleteItem)}
            disabled={loading}
            className='button_cancel flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <FaSpinner className='animate-spin text-xl' />
                <span>Loading...</span>
              </>
            ) : (
              "Yes, I'm sure"
            )}
          </button>
          <button
            onClick={() => setDeleteItem(false)}
            className='px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-900 dark:text-white rounded '
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteItem;

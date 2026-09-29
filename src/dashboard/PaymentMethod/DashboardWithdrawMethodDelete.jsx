import { MdDeleteForever } from 'react-icons/md';
import Auth from '../../../utils/Auth';
import { toast } from 'react-toastify';

function DashboardWithdrawMethodDelete({
  setIsModalOpen,
  isModalOpen,
  item,
  setRender
}) {
  const { ApiRequest } = Auth();

  const handleDeleteWithdraw = async (id) => {
    const response = await ApiRequest({
      url: '/admin/secret_delete/' + id,
      method: 'delete'
    });
    if (response) {
      // console.log(response)
      toast.success('Payment method deleted successfully!');
      setIsModalOpen(false);
      setRender(true);
    } else {
      toast.error(response?.message);
    }
  };
  return (
    <>
      {isModalOpen === item.id && (
        <div
          id='popup-modal'
          className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/20 bg-opacity-20'
        >
          <div className='relative p-4 w-full max-w-md max-h-full'>
            <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700'>
              {/* Modal content */}
              <div className='p-4 pr-10 md:p-5 text-center'>
                <div className='flex justify-center items-center text-[60px] text-red-600'>
                  <MdDeleteForever />
                </div>
                <h3 className='mb-5 text-black dark:text-white'>
                  Are you sure you want to delete this item
                </h3>
                {/* Add your modal content here */}
                <button
                  onClick={() => handleDeleteWithdraw(item.id)}
                  type='button'
                  className='text-white bg-red-500 hover:bg-red-600 focus:outline-none rounded-[4px] inline-flex items-center px-5 py-2.5 text-center'
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  type='button'
                  className='py-2.5 px-5 ms-3 text-gray-900 focus:outline-none  rounded-[4px] border border-gray-200 bg-gray-100 hover:bg-green-500 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardWithdrawMethodDelete;

import { IoMdClose } from 'react-icons/io';

function ReviewView({ reviewVieModalOpen, setReviewViewModalOpen }) {
  return (
    <>
      {reviewVieModalOpen && (
        <div
          id='popup-modal'
          className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50'
        >
          <div className='relative w-full max-w-xl max-h-full bg-white dark:bg-gray-700  rounded-md'>
            {' '}
            <div className='flex flex-col gap-3 rounded-lg border dark:border-gray-700 p-4 md:p-6'>
              <div
                onClick={() => setReviewViewModalOpen(null)}
                className='absolute top-0 right-0 w-8 h-8 bg-red-50 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-100 text-2xl text-black'
              >
                <IoMdClose />
              </div>
              <div className='flex gap-3'>
                <img
                  src={reviewVieModalOpen.user_image}
                  alt={reviewVieModalOpen.user_name}
                  className='w-14 h-14 rounded-full object-cover'
                />
                <div>
                  <span className='block'>
                    {reviewVieModalOpen.user_name}
                  </span>
                  <span className='block'>
                    {reviewVieModalOpen.user_email}
                  </span>
                  <span className='block text-gray-500 dark:text-white'>
                    {reviewVieModalOpen.position}
                  </span>
                </div>
              </div>
              <div className='relative rounded-[4px]'>
                <p className='text-gray-600 dark:text-white'>
                  {reviewVieModalOpen.review_details}
                </p>
              </div>
              {/* Modal content */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewView;

import { MdOutlineCancel } from 'react-icons/md';

function ViewPrice({ viewPriceModalOpen, setViewPriceModalOpen }) {
  return (
    <>
      {viewPriceModalOpen && (
        <div
          id='view-modal'
          className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 p-5'
        >
          <div className='relative m-5 w-full max-w-3xl max-h-full text-black dark:text-white'>
            <div className='relative p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl'>View Price Details</h2>
                <button
                  onClick={() => setViewPriceModalOpen(false)}
                  className='text-red-500 hover:text-red-700'
                >
                  <MdOutlineCancel className='w-6 h-6' />
                </button>
              </div>
              <div className='mb-4 border-b pb-4'>
                <h3 className='text-lg'>Name:</h3>
                <p className='text-gray-700 dark:text-gray-300'>{viewPriceModalOpen.name}</p>
              </div>
              <div className='mb-4 border-b pb-4'>
                <h3 className='text-lg'>Charge Percentage:</h3>
                <p className='text-gray-700 dark:text-gray-300'>
                  {viewPriceModalOpen.charge_percentage}%
                </p>
              </div>
              <div className='mb-4 border-b pb-4'>
                <h3 className='text-lg'>Description:</h3>
                <p className='text-gray-700 dark:text-gray-300'>
                  {viewPriceModalOpen.description}
                </p>
              </div>
              <div className='mb-4'>
                <h3 className=' text-lg'>Features:</h3>
                <ul className='list-disc list-inside text-gray-700 dark:text-gray-300'>
                  {viewPriceModalOpen.features.map((feature, index) => (
                    <li key={index}>{feature.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewPrice;

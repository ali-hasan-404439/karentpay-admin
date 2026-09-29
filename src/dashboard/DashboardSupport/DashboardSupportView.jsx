function DashboardSupportView({
  setSupportViewModalOpen,
  supportViewModalOpen,
  item
}) {
  const [showMoreMessage, setShowMoreMessage] = useState(false);

  return (
    <>
      {supportViewModalOpen === item.id && (
        <div
          id='popup-modal'
          className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50'
        >
          <div className='relative w-full max-w-xl max-h-full'>
            <div className='relative bg-white rounded-[4px] shadow dark:bg-gray-700'>
              {/* Modal content */}
              <div className='flex items-center md:items-start justify-center h-[150px] bg-blue-100 dark:bg-gray-800 rounded-t-[4px] relative'>
                <div className='absolute -bottom-10 '>
                  <img
                    src={import.meta.env.VITE_PUBLIC_IMAFES_PATH + item.image}
                    alt=''
                    className='w-28 h-28 rounded-full'
                  />
                </div>
              </div>
              <div className=' px-5 pt-10 pb-5 text-black dark:text-white'>
                <div className='relative'>
                  <h3 className='   text-center'>{item.name}</h3>
                  <h3 className=' text-center'>{item.email}</h3>
                  <h3 className=' mb-3  mt-2 '>
                    {showMoreMessage
                      ? item.message
                      : item.message.slice(0, 150)}
                    ..{' '}
                    <span
                      onClick={() => setShowMoreMessage(!showMoreMessage)}
                      className='cursor-pointer hover:border-b-2 pb-[2px] hover:text-blue-500 border-blue-500 dark:text-white'
                    >
                      {showMoreMessage ? 'Short Message' : 'Show More'}
                    </span>
                  </h3>

                  <p>
                    Type : <span className=''>{item.type} </span>,
                  </p>
                  <p>
                    Subject :{' '}
                    <span className=''>{item.subject} </span>,
                  </p>
                  <p>
                    Status : <span className=''>{item.status} </span>
                  </p>

                  <h3 className=' my-2 '>{item.date}</h3>
                  <div className='absolute bottom-0 right-0'>
                    <button
                      onClick={() => setSupportViewModalOpen(false)}
                      type='button'
                      className='py-2.5 px-5 ms-3   bg-gray-200 rounded-[4px] hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer dark:bg-gray-600  '
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardSupportView;

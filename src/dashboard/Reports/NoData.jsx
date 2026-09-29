import no_data from '../../images/no-data.avif';

function NoData({ title }) {
  return (
    <div className='px-6 pb-6'>
      <div className='flex flex-col items-center justify-center p-6  border rounded dark:border-[#374151] space-y-5'>
        <div>
          <img src={no_data} alt='no data' className='w-[400px]' />
        </div>

        <h2 className='text-center text-2xl text-[#728dee] tracking-wider'>
          No data available.
        </h2>
        {
          title && (
            <h2 className='text-center text-2xl text-[#728dee] tracking-wider'>
              {title}
            </h2>
          )
        }
      </div>
    </div>
  );
}

export default NoData;

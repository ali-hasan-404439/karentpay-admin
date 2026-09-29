import { useEffect, useState } from 'react';

// import components from other components
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// import moment
import moment from 'moment';

function DatePickers({ setStartEndDate, startEndDate }) {
  const [temporaryRange, setTemporaryRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  const [selectionRange, setSelectionRange] = useState(temporaryRange);
  const [dateOpenRiskUser, setDateOpenRiskUser] = useState(false);

  // Automatically sync temporaryRange with startEndDate when component loads
  useEffect(() => {
    if (startEndDate?.startDate) {
      setTemporaryRange({
        startDate: new Date(startEndDate.startDate), // Use the startEndDate's startDate
        endDate: new Date(startEndDate.endDate),
        key: 'selection'
      });
      setSelectionRange({
        startDate: new Date(startEndDate.startDate),
        endDate: new Date(startEndDate.endDate),
        key: 'selection'
      });
    }
  }, [startEndDate]);

  const handleSelect = (ranges) => {
    setTemporaryRange(ranges.selection);
  };

  const handleDateRangeChange = (range) => {
    const now = new Date();
    let startDate, endDate;

    switch (range) {
      case 'Today':
        startDate = new Date();
        endDate = new Date();
        break;
      case 'Yesterday':
        startDate = new Date(now.setDate(now.getDate() - 1));
        endDate = new Date(now.setDate(now.getDate()));
        break;
      case 'This Month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date();
        break;
      case 'Last 7 Days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case 'Last Month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      default:
        startDate = new Date();
        endDate = new Date();
    }

    setTemporaryRange({
      startDate,
      endDate,
      key: 'selection'
    });
  };

  const handleSubmit = () => {
    setSelectionRange(temporaryRange);
    setStartEndDate({
      startDate: temporaryRange.startDate,
      endDate: temporaryRange.endDate
    });
    setDateOpenRiskUser(false);
  };

  const isSameDay = moment(selectionRange.startDate).isSame(
    moment(selectionRange.endDate),
    'day'
  );

  return (
    <div className={`relative w-full md:w-fit whitespace-nowrap`}>
      <div
        onClick={() => setDateOpenRiskUser(!dateOpenRiskUser)}
        className={`flex gap-2 items-center border p-3 rounded cursor-pointer `}
      >
        <svg
          stroke='currentColor'
          fill='currentColor'
          strokeWidth='0'
          viewBox='0 0 24 24'
          className='page-content-wrapper-menu-filter-date-icon dark:text-white'
          height='1.3em'
          width='1.3em'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z'></path>
        </svg>
        <p className='page-content-wrapper-menu-filter-date-text dark:text-white'>
          {moment(selectionRange.startDate).format('DD, MMM YYYY')}
          {!isSameDay &&
            ` - ${moment(selectionRange.endDate).format('DD, MMM YYYY')}`}
        </p>
      </div>

      {dateOpenRiskUser && ( // Check if the date picker should be open
        <div
          className={`absolute top-12 right-0 shadow-lg rounded-md bg-white px-5 pb-5 w-[300px] md:w-[550px] border z-30`}
        >
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2 items-center z-30'>
            <div className='col-span-1'>
              <div className='rdrCalendarWrapper rdrDateRangeWrapper w-full dark:bg-gray-900 dark:text-white'>
                <DateRange
                  ranges={[temporaryRange]}
                  onChange={(ranges) => {
                    setTemporaryRange(ranges.selection);
                    handleSelect(ranges);
                  }}
                  showMonthAndYearPickers={true}
                  rangeColors={['#3d91ff']}
                />
              </div>
            </div>

            <div className='col-span-1 space-y-3'>
              <h2 className='text-[16px] tracking-wider'>Filter by Period</h2>
              <div className='grid grid-cols-2 gap-2'>
                {[
                  'Today',
                  'Yesterday',
                  'This Month',
                  'Last 7 Days',
                  'Last Month'
                ].map((range) => (
                  <button
                    key={range}
                    type='button'
                    className='w-full text-xs text-center py-2 border border-blue-500 text-blue-600 rounded-[15px]'
                    onClick={() => handleDateRangeChange(range)}
                  >
                    <span>{range}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='flex items-center justify-end gap-2 mt-4'>
            <div className='flex gap-3'>
              <button
                onClick={() => setDateOpenRiskUser(false)} // Close the date picker
                className='button_cancel'
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit} // Handle submit action
                className='button_gradient'
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePickers;

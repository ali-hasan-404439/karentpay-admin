const Table = ({ headers, children }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full dark:text-white border-gray-200 bg-white'>
        <thead className='bg-gray-100 dark:bg-gray-700'>
          <tr className='border-y dark:border-gray-800 text-[#374151] dark:text-white/80'>
            {headers?.map((header, index) => (
              <th
                key={index}
                className={`${
                  index === 0 ? 'px-6' : 'p-4'
                } text-left font-semibold whitespace-nowrap`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;

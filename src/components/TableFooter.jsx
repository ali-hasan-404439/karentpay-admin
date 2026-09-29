import React, { useEffect, useState } from 'react';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import { useLocation } from 'react-router-dom';

function TableFooter({
  currentPage,
  setCurrentPage,
  totalPage,
  perPage,
  setPerPage
}) {
  const pathName = useLocation().pathname;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('perPage')) || {};
    if (storedData[pathName]) {
      setPerPage(storedData[pathName]);
    }
  }, [pathName]);
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('perPage')) || {};
    storedData[pathName] = perPage;
    localStorage.setItem('perPage', JSON.stringify(storedData));
  }, [perPage, pathName]);

  if (totalPage === 0) return null;

  return (
    <nav
      className='flex items-start justify-between p-4 pl-5 space-y-3 flex-wrap md:items-center md:space-y-0'
      aria-label='Table navigation'
    >
      {
        perPage &&
        <div className='flex items-center gap-2 p-2 rounded'>
          <div className='flex items-center gap-2 cursor-pointer'>
            <select
              id='rowsPerPage'
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className='block w-20 border border-gray-300 rounded py-1 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer dark:bg-gray-800 dark:border-gray-600 dark:text-white'
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

      }
      <ResponsivePagination
        current={currentPage}
        total={totalPage}
        onPageChange={setCurrentPage}
        maxWidth={400}
        previousLabel=''
        nextLabel=''
        pageItemClassName='page-item'
        pageLinkClassName='page-link'
        previousClassName='previous-item'
        nextClassName='next-item'
        activeClassName='active'
      />
    </nav>
  );
}

export default TableFooter;

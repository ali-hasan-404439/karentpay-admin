import React, { useEffect, useState } from 'react';

import Sidebar from '../Sidebar';
import Header from '../Header';
import { Outlet, useNavigate } from 'react-router-dom';
import '../css/style.css';
import 'react-loading-skeleton/dist/skeleton.css';
import Cookies from 'js-cookie';

function Dashboard() {
  let navigate = useNavigate();
  const token = Cookies.get('token');
  useEffect(() => {
    if (!token) return navigate('/login');
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50 dark:bg-[#182235]'>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className='pt-4 px-4 w-full mx-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

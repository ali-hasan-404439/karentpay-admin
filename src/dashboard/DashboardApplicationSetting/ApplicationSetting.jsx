import { Outlet } from 'react-router-dom';
import ApplicationMenubar from './ApplicationMenubar';

function ApplicationSetting() {
  return (
    <div className='md:flex justify-between gap-5'>
      <ApplicationMenubar />
      <div className='w-full p-6 bg-white dark:bg-[#1F2836]  rounded-[4px] mr-3 boxShadow-table mb-5'>
        <Outlet />
      </div>
    </div>
  );
}

export default ApplicationSetting;

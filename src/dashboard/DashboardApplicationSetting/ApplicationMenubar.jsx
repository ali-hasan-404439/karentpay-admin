import { Link, useLocation } from 'react-router-dom';

import { FaFlorinSign, FaC } from 'react-icons/fa6';
import { FaHeading } from 'react-icons/fa';
import { MdMarkEmailRead, MdPercent } from 'react-icons/md';
import { RiProfileFill } from 'react-icons/ri';
import { PiWindowsLogoFill } from 'react-icons/pi';
import { IoSettings } from 'react-icons/io5';

function DashboardApplicationMenubar() {
  const location = useLocation();
  const { pathname } = location;

  const menuItems = [
    { path: '/application', icon: <PiWindowsLogoFill />, label: 'Logo & Identity' },
    { path: '/application/header', icon: <FaHeading />, label: 'Header Setting' },
    { path: '/application/footer', icon: <FaFlorinSign />, label: 'Footer Setting' },
    { path: '/application/color', icon: <FaC />, label: 'Color Setting' },
    { path: '/application/mail', icon: <MdMarkEmailRead />, label: 'Mailing Setting' },
    { path: '/application/profile', icon: <RiProfileFill />, label: 'Profile Setting' },
    { path: '/application/setting', icon: <MdPercent />, label: 'Payment Setting' },
    { path: '/application/others-setting', icon: <IoSettings />, label: 'Others Setting' },
  ];

  return (
    <div className='w-full md:w-[250px]'>
      <div className='boxShadow-table md:h-[calc(100vh-80px)] sticky top-[80px] left-0 w-full px-3 py-4 bg-white dark:bg-[#1F2836] rounded-t-[4px]'>
        <ul className='flex flex-wrap gap-2 flex-row md:flex-col'>
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={` text-black transition duration-300 rounded-[4px] dark:text-white hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white border ${pathname === item.path ? 'text-white bg-gradient-to-r from-[#395BEF] to-[#5C28D5]' : ''}`}
            >
              <Link to={item.path} className='flex items-center py-1 px-2'>
                <span className='border-black hover:border-white dark:border-white text-[14px]'>
                  {item.icon}
                </span>
                <span className='ms-3'>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardApplicationMenubar;

import React, { useEffect, useRef, useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// react icon import
import { IoMdHome } from 'react-icons/io';
import { FaAngleDown, FaCcAmazonPay, FaCloudDownloadAlt, FaNewspaper, FaQuora, FaRobot, FaUsers } from 'react-icons/fa';
import { PiCode, PiHandDepositFill, PiSlideshowFill } from 'react-icons/pi';
import {
  MdOutlinePublishedWithChanges,
  MdAlternateEmail,
  MdOutlineSupervisedUserCircle,
  MdRateReview,
  MdOutlinePhonelinkSetup,
  MdContactEmergency,
  MdPayments,
  MdOutlineMenuOpen,
  MdContactPage,
  MdPercent,
  MdOutlineAdminPanelSettings,
  MdOutlineHistory
} from 'react-icons/md';
import { SiCashapp, SiPagerduty } from 'react-icons/si';

import { TbHomeEdit, TbReportMoney, TbWorldDown } from 'react-icons/tb';
import { contextAuth } from './pages/ContextProvider';
import { FaCodeMerge, FaCodePullRequest, FaHandHoldingDollar } from 'react-icons/fa6';
import { AiOutlinePayCircle } from 'react-icons/ai';
import { GrDocumentStore } from 'react-icons/gr';
import { TfiMenuAlt } from 'react-icons/tfi';
import { RiContactsBook2Fill, RiSecurePaymentFill, RiSecurePaymentLine } from 'react-icons/ri';
import { IoPricetags } from 'react-icons/io5';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { logoAndIdentityData } = useContext(contextAuth)
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  const handleDropdownClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const DashboardMenuBar = [
    {
      category: "Dashboard",
      link: "/",
      icon: <IoMdHome />,
    },
    {
      category: "Merchant Cash In",
      link: "/deposit",
      icon: <PiHandDepositFill />,
    },
    {
      category: "Merchant Payout",
      link: "/payout",
      icon: <FaCcAmazonPay />,
    },
    {
      category: "Merchant Withdraw",
      link: "/withdraw",
      icon: <MdOutlinePublishedWithChanges />,
    },
    {
      category: "Merchant Reports",
      link: "/reports",
      router: 'reports',
      icon: <TbReportMoney />,
    },
    {
      category: "All User",
      icon: <MdContactEmergency />,
      router: 'merchant',
      subMenu: [
        { manu: "Merchant Request", link: "/merchant/request", icon: <FaCodePullRequest /> },
        { manu: "IP Request", link: "/merchant/ip-request", icon: <TbWorldDown /> },
        { manu: "All Merchant", link: "/all/merchant", icon: <FaCodeMerge /> },
        { manu: "All User", link: "/merchant/all/user", icon: <FaUsers /> },
      ]
    },
    {
      category: "Payment Method",
      icon: <MdPayments />,
      router: 'payment',
      subMenu: [
        { manu: "Cashin Auto", link: "/payment/method", icon: <SiCashapp /> },
        { manu: "Cashin Manual", link: "/payment/manual", icon: <FaHandHoldingDollar /> },
        { manu: "Robotic Manual", link: "/payment/robotic", icon: <FaRobot />, },
        { manu: "Payout Method", link: "/payment/payout", icon: <AiOutlinePayCircle /> }
      ]
    },
    {
      category: "Email",
      link: "/email",
      router: 'email',
      icon: <MdAlternateEmail />,
    },
    {
      category: "Support",
      link: "/support",
      router: 'support',
      icon: <MdOutlineSupervisedUserCircle />,
    },
    {
      category: "News",
      icon: <FaNewspaper />,
      router: 'news',
      subMenu: [
        { manu: "Post categories", link: "/news/post/categories", icon: <MdOutlineMenuOpen /> },
        { manu: "All Post", link: "/news/all/post", icon: <MdContactPage /> },
        { manu: "Documentation", link: "/news/documentation", icon: <GrDocumentStore /> }
      ]
    },
    {
      category: "Pages",
      link: "/pages",
      icon: <SiPagerduty />,
    },
    {
      category: "Review",
      link: "/review",
      icon: <MdRateReview />,
    },
    {
      category: "Management",
      icon: <TfiMenuAlt />,
      router: 'management',
      subMenu: [
        { manu: "Withdraw Currency", link: "/management/currency", icon: <MdPercent /> },
        { manu: "Download Section", link: "/management/download-app", icon: <PiCode /> },
        { manu: "Upload Application", link: "/management/upload-app", icon: <FaCloudDownloadAlt /> },
      ]
    },
    {
      category: "Home Pages",
      router: 'home',
      icon: <TbHomeEdit />,
      subMenu: [
        { manu: "Banner", link: "/home/banner", icon: <PiSlideshowFill /> },
        { manu: "Payment Support", link: "/home/gateway", icon: <RiSecurePaymentFill /> },
        { manu: "Pricing", link: "/home/pricing", icon: <IoPricetags /> },
        { manu: "Why Us", link: "/home/whyus", icon: <RiSecurePaymentLine /> },
        { manu: "FAQ", link: "/home/faq", icon: <FaQuora /> },
        { manu: "Contact Us", link: "/home/contact", icon: <RiContactsBook2Fill /> },
      ]
    },
    {
      category: "Role Assignment",
      link: "/role-assignment",
      icon: <MdOutlineAdminPanelSettings />,
    },
    {
      category: "Activity Log",
      link: "/activity-log",
      icon: <MdOutlineHistory />,
    },
    {
      category: "Application Setting",
      link: "/application",
      router: 'application',
      icon: <MdOutlinePhonelinkSetup />,
    }
  ];

  useEffect(() => {
    if (activeMenu) localStorage.setItem('activeMenu', activeMenu);
  }, [activeMenu]);
  useEffect(() => {
    const savedActiveMenu = localStorage.getItem('activeMenu');
    if (savedActiveMenu) setActiveMenu(savedActiveMenu);
  }, []);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden='true'
      ></div>

      {/* Sidebar */}
      <div
        id='sidebar'
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:sidebar-expanded:!w-72 2xl:!w-64 shrink-0 bg-white p-4 transition-all duration-200 ease-in-out dark:bg-[#1F2836] ${sidebarOpen ? 'translate-x-0' : '-translate-x-64 '
          }`}
      >
        {/* Sidebar header */}
        <div className='flex justify-between pr-3 mb-2 sm:px-2'>
          {/* Close button */}
          <button
            ref={trigger}
            className='lg:hidden text-slate-500 hover:text-slate-400'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls='sidebar'
            aria-expanded={sidebarOpen}
          >
            <svg
              className='w-6 h-6 fill-current dark:text-white'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z' />
            </svg>
          </button>
          {/* Logo */}
          {logoAndIdentityData?.logoImage ? (
            <Link
              to='/'
              end='true' // Pass as a string
              className='block text-2xl text-black dark:text-white text-shadow-md'
            >
              <img
                src={logoAndIdentityData?.logoImage}
                alt='logo'
                className='h-[45px] rounded'
              />
            </Link>
          ) : (
            <div className='block h-[50px] w-[150px] animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md'></div>
          )}
        </div>

        {/* Links */}
        <div className='space-y-8 overflow-x-auto'>
          <ul className='mt-3'>
            {DashboardMenuBar?.map((menu, index) => (
              <li key={index} className="relative">
                <div
                  onClick={() => handleDropdownClick(menu.category)}
                  className={`block text-black rounded-[4px] truncate transition duration-150  hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white dark:text-white mb-[1px] ${pathname === menu.link || pathname.includes(menu?.router)
                    ? 'text-white bg-gradient-to-r from-[#395BEF] to-[#5C28D5]'
                    : ''
                    }`}
                >
                  <Link to={menu.link ? menu.link : "#"} className=' py-2 px-3 flex items-center justify-between w-full'>
                    <span className="flex items-center gap-2">
                      {menu.icon}
                      {menu.category}
                    </span>
                    {menu.subMenu && (
                      <FaAngleDown
                        className={`transition-transform duration-300 ${activeMenu === menu.category ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </Link>
                </div>
                {menu.subMenu && (
                  <ul
                    className={`space-y-[1px] ml-4 mb-[1px] font-medium transition-all duration-300 ease-in-out overflow-hidden ${activeMenu === menu.category
                      ? "max-h-60 opacity-100"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    {menu.subMenu.map((item, idx) => (
                      <li
                        key={idx}
                        className={`block text-black rounded-[4px] truncate transition duration-150  hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white dark:text-white ${pathname === item.link
                          ? 'text-white bg-gradient-to-r from-[#395BEF] to-[#5C28D5]'
                          : ''
                          }`}
                      >
                        <Link to={item.link} className='flex items-center gap-2 py-2 px-3 w-full'>{item.icon}{item.manu}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

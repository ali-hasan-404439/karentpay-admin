import { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/Auth';

import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { contextAuth } from '../pages/ContextProvider';

function DropdownProfile({ align }) {
  const { logoAndIdentityData } = useContext(contextAuth)

  const { isLogin, ApiRequest } = Auth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const [userData, setUserData] = useState({});

  const updateFavicon = (faviconUrl) => {
    const link = document.getElementById('favicon');
    if (link) {
      link.href = faviconUrl;
    } else {
      const newLink = document.createElement('link');
      newLink.id = 'favicon';
      newLink.rel = 'icon';
      newLink.href = faviconUrl;
      document.head.appendChild(newLink);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const response = await ApiRequest({
      url: "/admin/profile",
      method: "get",
    });

    if (response?.status === 200) {
      setUserData(response.data);

    } else {
      // toast.error(response?.message);
    }
  };
  useEffect(() => {
    if (logoAndIdentityData && logoAndIdentityData?.faviconImage) {
      updateFavicon(logoAndIdentityData.faviconImage);
    }
  }, [logoAndIdentityData]);
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);
  // outlet click close the toggle function
  useEffect(() => {
    const handleClickOutsideRightEdit = (event) => {
      if (!event.target.closest('#setDropdownOpen')) {
        setDropdownOpen(false);
      }
    };
    window.document.addEventListener('click', handleClickOutsideRightEdit);

    return () => {
      window.document.removeEventListener('click', handleClickOutsideRightEdit);
    };
  }, []);

  return (
    <div className='relative inline-flex'>
      <button
        ref={trigger}
        className='inline-flex justify-center items-center group bg-gradient-to-r from-[#395BEF] to-[#5C28D5] px-3 gap-3 md:gap-5 text-white rounded-[4px]'
        aria-haspopup='true'
        aria-expanded={dropdownOpen}
      >
        <Link target='blank' to={logoAndIdentityData?.siteUrl}>
          <FaEye />
        </Link>
        {logoAndIdentityData?.siteUrl ? (
          <div
            id='setDropdownOpen'
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='flex py-[6px] items-center gap-2 md:gap-3 '
          >
            <h2>
              {userData?.name}
            </h2>
            {
              userData?.avatar && (
                <img
                  className='w-8 h-8 rounded-full'
                  src={userData?.avatar}
                  width='32'
                  height='32'
                  alt='User'
                />
              )
            }
          </div>
        ) : (
          <div className='flex py-[6px] items-center gap-2 md:gap-3'>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse'></div>
            <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full'></div>
          </div>
        )}
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-[150px] bg-white dark:bg-slate-800 mt-1.5 rounded shadow-lg overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'
          }`}
        show={dropdownOpen}
        enter='transition ease-out duration-200 transform'
        enterStart='opacity-0 -translate-y-2'
        enterEnd='opacity-100 translate-y-0'
        leave='transition ease-out duration-200'
        leaveStart='opacity-100'
        leaveEnd='opacity-0'
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <ul>
            <li>
              <Link
                className='text-black dark:text-white flex items-center py-1.5 px-3 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white'
                to='/application/profile'
                onClick={() => setDropdownOpen(false)}
              >
                Settings
              </Link>
            </li>
            {isLogin() ? (
              <li>
                <div
                  onClick={() => {
                    Cookies.remove('token');
                    setDropdownOpen(false);
                    navigate('/');
                    toast.success('You have successfully logged Out.');
                    window.location.reload();
                  }}
                  className='text-black dark:text-white flex items-center py-1.5 px-3 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer'
                >
                  Sign Out
                </div>
              </li>
            ) : (
              <Link to='/login'>
                <div className='text-black dark:text-white flex items-center py-1.5 px-3 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer'>
                  Log In
                </div>
              </Link>
            )}
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;

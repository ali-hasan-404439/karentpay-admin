import ThemeToggle from './components/ThemeToggle';
import DropdownProfile from './components/DropdownProfile';
import { useContext, useEffect } from 'react';
import { contextAuth } from './pages/ContextProvider';
import useFetchData from './utils/useFetchData';
import Auth from './utils/Auth';

function Header({ sidebarOpen, setSidebarOpen }) {
  const { ApiRequest } = Auth();
  const { setLogoAndIdentityData, setFrontendData, setMerchantAll, setCountries, setManualMethodList } = useContext(contextAuth);

  const { data, loading } = useFetchData('/admin/setting/logo-identity');
  const { data: frontendData } = useFetchData('/front/setting/logo-identity');

  useEffect(() => {
    if (!loading) {
      setLogoAndIdentityData(data?.settings);
    }
    if (frontendData) {
      setFrontendData(data?.settings);
    }
  }, [loading, data, frontendData, setLogoAndIdentityData]);

  useEffect(() => {
    const LoadMerchant = async () => {
      try {
        const response = await ApiRequest({
          url: `/admin/merchant/dropdown`,
          method: "get",


        });
        setMerchantAll(response.data);
      }
      catch (error) {
        // console.log(error);
      }
    };
    const Countries = async () => {
      try {
        const response = await ApiRequest({
          url: "/country",
          method: "get",
        });
        setCountries(response.data);
      } catch (error) {
        // toast.error(error);
      }
    };
    const CashInManualMethodList = async () => {
      try {
        const response = await ApiRequest({
          url: "/admin/dropdown/manual-payment-systems",
          method: "get",
        });
        setManualMethodList(response);
      } catch (error) {
        // toast.error(error);
      }
    };
    Countries();
    LoadMerchant();
    CashInManualMethodList();
  }, [])

  return (
    <header className='shadow sticky top-0 bg-white dark:bg-[#1f2836] dark:border-slate-700 z-30'>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 -mb-px'>
          {/* Header: Left side */}
          <div className='flex'>
            {/* Hamburger button */}
            <button
              className='text-slate-500 hover:text-slate-600 lg:hidden'
              aria-controls='sidebar'
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <svg
                className='w-6 h-6 fill-current dark:text-white'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect x='4' y='5' width='16' height='2' />
                <rect x='4' y='11' width='16' height='2' />
                <rect x='4' y='17' width='16' height='2' />
              </svg>
            </button>
          </div>

          {/* Header: Right side */}
          <div className='flex items-center space-x-2 md:space-x-3'>
            <ThemeToggle />
            <DropdownProfile align='right' />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

import { useState, useEffect, use } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';
import axios from 'axios';
import Cookies from 'js-cookie';
import NagadPaymentAdd from './NagadPaymentAdd';
import NagadPaymentEdit from './NagadPaymentEdit';
import Auth from '../../../../utils/Auth';
import InputField from '../../../../components/InputField';
import Table from '../../../../components/Table';
import DeleteItem from '../../../../components/DeleteItem';
import ActionButton from '../../../../components/ActionButton';
import { MdDelete } from 'react-icons/md';
import FilterStatus from '../../../../components/FilterStatus';
import SearchInputField from '../../../../components/SearchInputField';
import TableFooter from '../../../../components/TableFooter';

function NagadPaymentMethod() {
  const headers = [
    'Sl',
    'Name',
    'Merchant ID',
    'Merchant Number',
    'Public / Private Key',
    'Total Amount',
    'Daily Amount',
    'Limit Amount',
    'Message',
    'Active',
    'Action'
  ];
  const { ApiRequest } = Auth();

  // Nagad Payment Method Test
  const [userName_test, setUserName_test] = useState('');
  const [nagadPassword_test, setNagadPassword_test] = useState('');
  const [nagadKey_test, setNagadKey_test] = useState('');
  const [nagadSecret_test, setNagadSecret_test] = useState('');
  const [nagadCallBackUrl, setNagadCallBackUrl] = useState('');

  const [errors, setErrors] = useState({
    userName: '',
    password: '',
    appKey: '',
    appSecret: '',
    callBackUrl: ''
  });

  // Nagad Payment Method  Live
  const [nagadAddNewModal, setNagadAddNewModal] = useState(false);
  const [nagadAddNewModalEdit, setNagadAddNewModalEdit] = useState(null);

  const [nagad, setNagad] = useState('');

  const [nagadlive, setNagadlive] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(null);

  const [textDataNagad, setTextDataNagad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [searchNagadName, setSearchNagadName] = useState('');
  const [searchMerchantStatus, setSearchMerchantStatus] = useState('');
  const [showMerchantStatus, setShowMerchantStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(null);

  const token = Cookies.get('token');

  // Form validation nagad text
  const validateForm = () => {
    const newErrors = {};

    if (!userName_test.trim()) {
      newErrors.userName = 'Merchant ID is required.';
    }
    if (!nagadPassword_test.trim()) {
      newErrors.password = 'Merchant Number is required.';
    }
    if (!nagadKey_test.trim()) {
      newErrors.appKey = 'Merchant Public Key is required.';
    }
    if (!nagadSecret_test.trim()) {
      newErrors.appSecret = 'Merchant Private Key is required.';
    }
    if (!nagadCallBackUrl.trim()) {
      newErrors.nagadCallBackUrl = 'Callback URL is required.';
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleNagadPaymentText = async () => {
    if (!validateForm()) return;

    if (!token) return;

    const formData = new FormData();
    formData.append('name', textDataNagad?.name);
    formData.append('id', textDataNagad?.id);
    formData.append('NAGAD_MERCHANT_ID', userName_test);
    formData.append('NAGAD_MERCHANT_NUMBER', nagadPassword_test);
    formData.append('NAGAD_PRIVATE_KEY', nagadKey_test);
    formData.append('NAGAD_PUBLIC_KEY', nagadSecret_test);
    formData.append('CALLBACK_URL', nagadCallBackUrl);
    formData.append('action', 'update');
    formData.append('type', 0);
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/nagad_setting_add_update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Nagad text updated successfully');
    } catch (e) {
      toast.error('Failed to update nagad text');
    }
    setNagadAddNewModalEdit(null);
    setLoading(false);
  };

  useEffect(() => {
    const nagadSetting = async () => {
      try {
        const response = await ApiRequest({
          url: '/admin/nagad_setting_test_list',
          method: 'get'
        });
        const textData = response.data.data[0];
        setTextDataNagad(textData);
        setUserName_test(textData?.NAGAD_MERCHANT_ID);
        setNagadPassword_test(textData?.NAGAD_MERCHANT_NUMBER);
        setNagadKey_test(textData?.NAGAD_PRIVATE_KEY);
        setNagadSecret_test(textData?.NAGAD_PUBLIC_KEY);
        setNagadCallBackUrl(textData?.CALLBACK_URL);
      } catch (error) {
        // console.log(error);
      }
    };
    nagadSetting();
  }, []);


  useEffect(() => {
    nagadSettingLive();
  }, [currentPage]);
  const nagadSettingLive = async () => {
    setLoadingData(true);
    try {
      const response = await ApiRequest({
        url: `/admin/nagad_setting_live_list?page=${currentPage}&per_page=${ItemsPerPage}&search=${searchNagadName}&status=${searchMerchantStatus === 'Active' ? 1 : searchMerchantStatus === 'Inactive' ? 0 : ''}`,
        method: 'get'
      });
      setNagadlive(response?.data?.data);
      setTotal({
        totalItems: response?.data?.total,
        totalPage: response?.data?.last_page
      });
    }
    catch (error) {
      // console.log(error);
    }
    setLoadingData(false);
  }
  useEffect(() => {
    setCurrentPage(1);
    nagadSettingLive();
  }, [searchNagadName, searchMerchantStatus]);

  const setChecked = async (e, id) => {
    try {
      const response = await ApiRequest({
        url: '/admin/nagad_setting_checkbox',
        method: 'put',
        formdata: { id, checked: e }
      });
      try {
        const response = await ApiRequest({
          url: `/admin/nagad_setting_live_list`,
          method: 'get'
        });
        setNagadlive(response?.data?.data);
      }
      catch (error) {
        // console.log(error);
      }
      toast.success('Nagad status updated successfully');
    } catch (error) {
      // console.log(error);
    }
  };


  const stopNagad = async () => {
    try {
      const response = await ApiRequest({
        url: '/admin/nagad_setting_group_checkbox',
        method: 'put'
      });
      try {
        const response = await ApiRequest({
          url: `/admin/nagad_setting_live_list`,
          method: 'get'
        });
        setNagadlive(response?.data?.data);
      }
      catch (error) {
        // console.log(error);
      }
      toast.success('Nagad group status updated successfully');
    } catch (error) {
      // console.log(error);
    }
  };

  const handleDeleteWithdraw = async () => {
    setDeleteLoading(true);
    if (!token) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/nagad_setting_delete`,
        { id: isModalOpen },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      try {
        const response = await ApiRequest({
          url: `/admin/nagad_setting_live_list?page=${currentPage}&per_page=${ItemsPerPage}`,
          method: 'get'
        });
        setNagadlive(response?.data?.data);
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page
        });
      }
      catch (error) {
        // console.log(error);
      }
      toast.success('Nagad cash in method deleted successfully');
    } catch (error) {
      toast.error('Failed to delete nagad cash in method. Please try again.');
    }
    setIsModalOpen(false);
    setDeleteLoading(false);
  };

  useEffect(() => {
    if (nagadlive && nagadlive[0]?.group_nagad === 1) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [nagadlive]);

  useEffect(() => {
    const handleClickOutShowMerchantStatus = (event) => {
      if (!event.target.closest("#handleClickOutShowMerchantStatus")) {
        setShowMerchantStatus(false);
      }
    };
    window.document.addEventListener("click", handleClickOutShowMerchantStatus);

    return () => {
      window.document.removeEventListener("click", handleClickOutShowMerchantStatus);
    };
  }, []);

  return (
    <>
      {/* nagad test input file */}
      <div className='px-6 py-5 space-y-5'>
        {/* Username Field */}
        <InputField
          label='Nagad Sandbox Merchant ID'
          value={userName_test}
          onChange={setUserName_test}
          id='userName'
          error={errors.userName}
          required={true}
        />
        <InputField
          label='Nagad Sandbox Merchant Number'
          value={nagadPassword_test}
          onChange={setNagadPassword_test}
          id='nagadPassword'
          error={errors.password}
          required={true}
        />
        <InputField
          label='Nagad Sandbox Public Key'
          value={nagadSecret_test}
          onChange={setNagadSecret_test}
          id='nagadSecret'
          error={errors.appSecret}
          required={true}
        />
        <InputField
          label='Nagad Sandbox Private Key'
          value={nagadKey_test}
          onChange={setNagadKey_test}
          id='nagadKey'
          error={errors.appKey}
          required={true}
        />
        <InputField
          label='Nagad Sandbox CallBack URL'
          value={nagadCallBackUrl}
          onChange={setNagadCallBackUrl}
          id='nagadCallBackUrl'
          error={errors.callBackUrl}
          required={true}
        />

        {/* Submit Button */}

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleNagadPaymentText}
            className='button_gradient w-full md:w-fit'
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className='animate-spin' /> Loading...
              </>
            ) : (
              'Update Test Credentials'
            )}
          </button>
          <SearchInputField
            searchText={searchNagadName}
            setSearchText={setSearchNagadName}
            placeholderText="Search Name And Number..."
          />
          <FilterStatus
            showMerchantStatus={showMerchantStatus}
            setShowMerchantStatus={setShowMerchantStatus}
            setSearchMerchantStatus={setSearchMerchantStatus}
            searchMerchantStatus={searchMerchantStatus}
            id="handleClickOutShowMerchantStatus"
            placeholderText="Select Status..."
          >
            {['Active', 'Inactive']?.map((item, index) => (
              <div
                key={index}
                className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                onClick={() => setSearchMerchantStatus(item)}
              >
                <span> {item}</span>
              </div>
            ))}
          </FilterStatus>
        </div>
      </div>

      {/* nagad live data table */}
      <Table headers={headers}>
        {loadingData ? Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="animate-pulse">
            <td className="w-4 py-4 px-6">
              <div className="w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </td>
            <td className="p-4">
              <div className="w-[150px] h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </td>
            <td className="p-4 whitespace-nowrap">
              <div className="w-[150px] h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </td>
            <td className="p-4 whitespace-nowrap">
              <div className="w-[100px] h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </td>
            <td className="p-4 whitespace-nowrap">
              <div className="w-[100px] h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </td>
            <td className="p-4 whitespace-nowrap">
              <div className="w-[80px] h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </td>
            <td className="p-4 whitespace-nowrap">
              <div className="w-[80px] h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </td>
            <td className="p-4 whitespace-nowrap">
              <div className="w-[80px] h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </td>
            <td className="p-4 whitespace-nowrap">
              <div className="w-[50px] h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </td>
            <td className="p-4">
              <div className="w-[50px] h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </td>
            <td className="flex-1 p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </td>
          </tr>
        )) : nagadlive?.map((item, index) => (
          <tr key={index} data-testid='table-row-element' className='table_tr'>
            <td className='w-4 py-4 px-6 '>{total?.totalItems -
              ((currentPage - 1) * ItemsPerPage + index)}</td>

            <td className='p-4'>
              <h2 style={{ width: '150px' }}>{item?.name}</h2>
            </td>

            <td className='p-4 whitespace-nowrap'>
              <h2 style={{ width: '150px' }}>{item?.NAGAD_MERCHANT_ID}</h2>
            </td>

            <td className='p-4 whitespace-nowrap'>
              {item?.NAGAD_MERCHANT_NUMBER}
            </td>
            <td className='p-4 whitespace-nowrap'>
              {item?.NAGAD_PUBLIC_KEY && <>{item?.NAGAD_PUBLIC_KEY?.length > 15
                ? item?.NAGAD_PUBLIC_KEY?.substring(0, 15) + '...'
                : item?.NAGAD_PUBLIC_KEY}<br /></>}
              {item?.NAGAD_PRIVATE_KEY?.length > 15
                ? item?.NAGAD_PRIVATE_KEY?.substring(0, 15) + '...'
                : item?.NAGAD_PRIVATE_KEY}
            </td>
            <td className='p-4 whitespace-nowrap'>
              <h2 className={`${item?.message ? 'text-red-500' : ''}`}>
                {item?.payment_sites_sum_amount}
              </h2>
            </td>
            <td
              className={`p-4 whitespace-nowrap ${item.daily_trx_limit_usage_percentage > 90 ? "text-red-600 bg-yellow-100" : ""
                }`}
            >
              <h2>{item.daily_trx_limit}</h2>
              {item.daily_trx_limit_usage_percentage > 90 && (
                <span>
                  Over 90% limit used ({item.daily_trx_limit_usage_percentage}%)
                </span>
              )}
            </td>
            <td className='p-4 whitespace-nowrap'>
              <h2 className={`${item?.message ? 'text-red-500' : ''}`}>
                {item?.limit_amount ? item?.limit_amount : ''}
              </h2>
            </td>
            <td className='p-4 whitespace-nowrap'>
              <h2 className={`${item?.message ? 'text-red-500' : ''}`}>
                {item?.message ? item?.message : ''}
              </h2>
            </td>
            <td className="p-4">
              <label
                htmlFor={`toggle-${item.id}`}
                className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${item.status == 1 ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
              >
                <input
                  type="checkbox"
                  id={`toggle-${item.id}`}
                  className="peer sr-only"
                  checked={item.status == 1 ? true : false}
                  onChange={(e) => {
                    setChecked(e.target.checked, item.id);
                  }}
                />
                <span
                  className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                ></span>
              </label>
            </td>

            <td className='flex-1 p-4'>
              <div className='flex items-center gap-2'>
                <ActionButton
                  id={item}
                  setAction={setNagadAddNewModal}
                  title={"Edit"}
                  icon={<CiEdit />}
                  bgColor='bg-green-500 hover:bg-green-800'
                />
                <ActionButton
                  id={item.id}
                  setAction={setIsModalOpen}
                  title={"Delete"}
                  icon={<MdDelete />}
                  bgColor='bg-red-500 hover:bg-red-800'
                />
              </div>
            </td>
          </tr>
        ))}
      </Table>
      {/* new nagad added modal button */}
      <div className="px-6 py-5 md:flex items-center justify-between">
        <div className='flex items-center gap-2'>
          <button
            id='handleClickOutsideOperator'
            onClick={() => setNagadAddNewModal(true)}
            className='button_gradient'
          >
            <FaPlus />
            Add Payment
          </button>
          <div className='flex justify-end'>
            {nagadlive && (
              <label
                className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${isChecked ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isChecked}
                  onChange={stopNagad}
                />
                <span
                  className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                ></span>
              </label>
            )}
          </div>
        </div>

        <TableFooter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={total?.totalPage || 0}
        />
      </div>

      {/* new nagad added modal */}
      <NagadPaymentAdd
        nagadAddNewModal={nagadAddNewModal}
        setNagadAddNewModal={setNagadAddNewModal}
        setTotal={setTotal}
        setNagadlive={setNagadlive}
        currentPage={currentPage}
        ItemsPerPage={ItemsPerPage}
      />

      {/* edit nagad added modal */}
      <NagadPaymentEdit
        nagadAddNewModalEdit={nagadAddNewModalEdit}
        setNagadAddNewModalEdit={setNagadAddNewModalEdit}
        setNagadlive={setNagadlive}
      />

      <DeleteItem
        deleteItem={isModalOpen}
        setDeleteItem={setIsModalOpen}
        handleDeleteItem={handleDeleteWithdraw}
        text='Naget Method'
        loading={deleteLoading}
      />
    </>
  );
}

export default NagadPaymentMethod;

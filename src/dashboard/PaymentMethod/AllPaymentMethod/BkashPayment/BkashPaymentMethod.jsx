import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import Auth from "../../../../utils/Auth";
import InputField from "../../../../components/InputField";
import Table from "../../../../components/Table";
import DeleteItem from "../../../../components/DeleteItem";
import { MdDelete } from "react-icons/md";
import ActionButton from "../../../../components/ActionButton";
import FilterStatus from "../../../../components/FilterStatus";
import SearchInputField from "../../../../components/SearchInputField";
import TableFooter from "../../../../components/TableFooter";

function BkashPaymentMethod() {
  const headers = [
    "Sl",
    "Name",
    "Bkash User Name",
    "Password",
    "Public / Private Key",
    "Total Amount",
    "Daily Amount",
    "Limit Amount",
    "Message",
    "Active",
    "Action",
  ];
  const { ApiRequest } = Auth();
  const [dropdownModel, setDropdownModel] = useState(false);
  const [bkashUpdate, setBkashUpdate] = useState("");

  const [userName_test, setUserName_test] = useState("");
  const [userNumber_test, setUserNumber_test] = useState("");
  const [bkashPassword_test, setBkashPassword_test] = useState("");
  const [bkashkey_test, setBkashkey_test] = useState("");
  const [bkashSecret_test, setBkashSecret_test] = useState("");

  const [userName, setUserName] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  const [bkashPassword, setBkashPassword] = useState("");
  const [bkashkey, setBkashkey] = useState("");
  const [bkashSecret, setBkashSecret] = useState("");
  const [bkashAmountLimit, setBkashAmountLimit] = useState("");
  const [dailyTransaction, setDailyTransaction] = useState("");

  const [bkashlive, setBkashlive] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [errors, setErrors] = useState({});
  const [errorsTest, setErrorsTest] = useState({});
  const [searchBkashName, setSearchBkashName] = useState('');
  const [searchMerchantStatus, setSearchMerchantStatus] = useState('');
  const [showMerchantStatus, setShowMerchantStatus] = useState(false);
  const [render, setRender] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ItemsPerPage = 10;

  const [total, setTotal] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testId, setTestId] = useState(null);

  const [copyMessage1, setCopyMessage1] = useState("");
  const [showText, setShowText] = useState(false);
  const [loadignAdd, setLoadignAdd] = useState(false);

  const validateFieldsText = () => {
    const newErrors = {};
    if (!userName_test || userName_test.trim() === "") {
      newErrors.userName_test = "User name is required";
    }
    if (!userNumber_test || userNumber_test.trim() === "") {
      newErrors.userNumber_test = "Bkash Number is required";
    }
    if (!bkashkey_test || bkashkey_test.trim() === "") {
      newErrors.bkashkey_test = "Bkash app key is required";
    }
    if (!bkashSecret_test || bkashSecret_test.trim() === "") {
      newErrors.bkashSecret_test = "Bkash app secret is required";
    }
    if (!bkashPassword_test || bkashPassword_test.trim() === "") {
      newErrors.bkashPassword_test = "Bkash password is required";
    }
    // Set errors to state
    setErrorsTest(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  const handleBkashPayment = async () => {
    if (!validateFieldsText()) return;
    setTestLoading(true);
    const bkashPayment = {
      id: testId,
      name: userName_test,
      user_name: userNumber_test,
      password: bkashPassword_test,
      app_key: bkashkey_test,
      app_secret: bkashSecret_test,
      limit_amount: 1000,
      daily_trx_limit: 10,
      type: testId ? "update" : "add",
    };
    try {
      const response = await ApiRequest({
        url: "/admin/bkash_setting_add_update",
        method: "POST",
        formdata: bkashPayment,
      });
      toast.success(response.data);
    } catch (error) {
      // console.log(error);
    }
    setTestLoading(false);
  };

  useEffect(() => {
    const bkashSetting = async () => {
      try {
        const response = await ApiRequest({
          url: "/admin/bkash_setting_test_list",
          method: "get",
        });
        const test = response.data.data[0];
        setTestId(test?.id);
        setUserName_test(test?.name);
        setUserNumber_test(test?.user_name);
        setBkashPassword_test(test?.password);
        setBkashkey_test(test?.app_key);
        setBkashSecret_test(test?.app_secret);
      } catch (error) {
        // console.log(error);
      }
    };
    bkashSetting();
  }, []);

  useEffect(() => {
    bkashSettingLiveList();
  }, [currentPage, render]);


  const bkashSettingLiveList = async () => {
    setLoading(true);
    try {
      const response = await ApiRequest({
        url: `/admin/bkash_setting_live_list?search=${searchBkashName}${searchMerchantStatus === 'Active' ? "&active=1" : searchMerchantStatus === 'Inactive' ? "&active=0" : ''}&page=${currentPage}&per_page=${ItemsPerPage}`,
        method: "get",

      });
      setBkashlive(response.data.data);
      setTotal({
        totalItems: response?.data?.total,
        totalPage: response?.data?.last_page,
      });
    } catch (error) {
      // console.log(error);
    }
    setLoading(false);
    setRender(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    const bkashSettingLiveList = async () => {
      try {
        const response = await ApiRequest({
          url: `/admin/bkash_setting_live_list?search=${searchBkashName}${searchMerchantStatus === 'Active' ? "&active=1" : searchMerchantStatus === 'Inactive' ? "&active=0" : ''}&page=${currentPage}&per_page=${ItemsPerPage}`,
          method: "get",

        });
        setBkashlive(response.data.data);
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
      } catch (error) {
        // console.log(error);
      }
    };
    bkashSettingLiveList();
  }, [searchBkashName, searchMerchantStatus,]);

  const setChecked = async (e, id) => {
    try {
      const response = await ApiRequest({
        url: "/admin/bkash_setting_checkbox",
        method: "put",
        formdata: { id, checked: e },
      });
      setBkashlive((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, active: e === true ? 1 : 0 || item }
            : item
        )
      );
      toast.success(response?.data);
    } catch (error) {
      // console.log(error);
      toast.error('Failed to update. Please try again.');
    }

  };
  const bkashGroupStop = async () => {
    try {
      const response = await ApiRequest({
        url: "/admin/bkash_setting_group_checkbox",
        method: "put",
      });
      try {
        const response = await ApiRequest({
          url: `/admin/bkash_setting_live_list?page=${currentPage}&per_page=${ItemsPerPage}`,
          method: "get",

        });
        setBkashlive(response.data.data);
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
      } catch (error) {
        // console.log(error);
      }
      toast.success(response.data);

    } catch (error) {
      // console.log(error);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!bkashNumber || bkashNumber.trim() === "") {
      newErrors.bkashNumber = "Bkash number is required";
    }
    if (!bkashkey || bkashkey.trim() === "") {
      newErrors.bkashkey = "Bkash app key is required";
    }
    if (!bkashSecret || bkashSecret.trim() === "") {
      newErrors.bkashSecret = "Bkash app secret is required";
    }

    if (!bkashPassword || bkashPassword.trim() === "") {
      newErrors.bkashPassword = "Bkash password is required";
    }
    if (!bkashAmountLimit) {
      newErrors.bkashAmountLimit = "Bkash amount limit is required";
    } else if (isNaN(bkashAmountLimit) || bkashAmountLimit <= 0) {
      newErrors.bkashAmountLimit =
        "Bkash Transaction Limit must be a valid number.";
    }
    setErrors(newErrors);
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const bkashaddAndUpdate = async () => {
    if (!validateFields()) return;
    setLoadignAdd(true);
    const data = {
      id: bkashUpdate,
      name: userName,
      user_name: bkashNumber,
      password: bkashPassword,
      app_key: bkashkey,
      app_secret: bkashSecret,
      daily_trx_limit: dailyTransaction,
      limit_amount: bkashAmountLimit,
      type: bkashUpdate > 0 ? "update" : "add",
    };

    try {
      const response = await ApiRequest({
        url: "/admin/bkash_setting_add_update",
        formdata: data,
      });
      try {
        const response = await ApiRequest({
          url: `/admin/bkash_setting_live_list?page=${currentPage}&per_page=${ItemsPerPage}`,
          method: "get",

        });
        setBkashlive(response.data.data);
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
      } catch (error) {
        // console.log(error);
      }
      toast.success(`Bkash cash in method ${bkashUpdate > 0 ? "updated" : "added"} successfully`);
      setBkashNumber("");
      setBkashPassword("");
      setBkashkey("");
      setBkashSecret("");
      setDailyTransaction("");
      setBkashAmountLimit("");
      setUserName("");
    }
    catch (error) {
      // console.log(error)
    }
    setDropdownModel(false);
    setLoadignAdd(false);
  };

  const handleDeleteWithdraw = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await ApiRequest({
        url: "/admin/bkash_setting_delete",
        formdata: { id: id },
      });

      try {
        const response = await ApiRequest({
          url: `/admin/bkash_setting_live_list?page=${currentPage}&per_page=${ItemsPerPage}`,
          method: "get",

        });

        setBkashlive(response.data.data);
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
      } catch (error) {
        // console.log(error);
      }
      toast.success("Setting delete success!");
    } catch (error) {
      toast.error(error?.response?.message);
    }
    setDeleteLoading(false);
    setIsModalOpen(false);
  };

  const handleCopy = (text) => {
    const copyText = showText !== null ? text : " ";

    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopyMessage1("Copied!");
        setTimeout(() => setCopyMessage1(""), 2000);
      })
      .catch((err) => {
        // console.error("Failed to copy: ", err);
      });
  };

  const handleRevealText = (id) => {
    setShowText(id);
  };

  const handleHideText = () => {
    setShowText(null);
  };

  useEffect(() => {
    if (bkashlive && bkashlive[0]?.group_bkash === 1) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [bkashlive]);
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
      <div className="px-6 py-5 space-y-5">
        <InputField
          label="Bkash User Name"
          value={userName_test}
          onChange={setUserName_test}
          id="userName"
          required={true}
          error={errorsTest.userName_test}
        />
        <InputField
          label="Bkash Number"
          value={userNumber_test}
          onChange={setUserNumber_test}
          id="userNumber"
          required={true}
          error={errorsTest.userNumber_test}
        />

        <InputField
          label="Bkash Sandbox Password"
          value={bkashPassword_test}
          onChange={setBkashPassword_test}
          id="BkashPassword"
          required={true}
          error={errorsTest.bkashPassword_test}
        />

        <InputField
          label="Bkash Sandbox Public Key"
          value={bkashkey_test}
          onChange={setBkashkey_test}
          id="Bkashkey"
          required={true}
          error={errorsTest.bkashkey_test}
        />
        <InputField
          label="Bkash Sandbox Private Key"
          value={bkashSecret_test}
          onChange={setBkashSecret_test}
          id="BkashSecret"
          required={true}
          error={errorsTest.bkashSecret_test}
        />

        <div className="flex items-center flex-wrap gap-2">
          <button
            id="handleClickOutsideOperator"
            onClick={handleBkashPayment}
            className="button_gradient whitespace-nowrap w-full md:w-fit"
          >
            {testLoading ? (
              <>
                <FaSpinner className="animate-spin" /> Loading...
              </>
            ) : (
              "Update Test Credentials"
            )}
          </button>
          <SearchInputField
            searchText={searchBkashName}
            setSearchText={setSearchBkashName}
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

      {/* Live Credentials*/}

      <Table headers={headers}>
        {loading ? Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="table_tr">
            {/* Serial Number */}
            <td className="w-4 py-4 px-6">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </td>

            {/* Name */}
            <td className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-[150px]"></div>
            </td>

            {/* Username */}
            <td className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-[100px]"></div>
            </td>

            {/* Password */}
            <td className="relative overflow-hidden py-3 w-[100px]">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-[80px]"></div>
            </td>

            {/* App Key */}
            <td className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-[150px]"></div>
            </td>

            {/* Payment Amount */}
            <td className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-[80px]"></div>
            </td>

            {/* Daily Trx Limit */}
            <td className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-[80px]"></div>
            </td>

            {/* Limit Amount */}
            <td className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-[80px]"></div>
            </td>

            {/* Message */}
            <td className="p-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-[120px]"></div>
            </td>

            {/* Active Checkbox */}
            <td className="p-4">
              <div className="h-6 w-11 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            </td>

            {/* Actions */}
            <td className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
              </div>
            </td>
          </tr>
        )) : bkashlive?.map((item, index) => (
          <tr key={index} data-testid="table-row-element" className="table_tr">
            <td className="w-4 py-4 px-6">{total?.totalItems -
              ((currentPage - 1) * ItemsPerPage + index)}</td>

            <td className="p-4">
              <h2 style={{ width: "150px" }}>{item.name}</h2>
            </td>
            <td className="p-4">
              {item.user_name}
            </td>

            <td className="relative overflow-hidden py-3 w-[100px]">
              <span
                className={`cursor-pointer ${showText === item.id ? "" : "blur-sm"} transition-all duration-300`}
                onClick={() => handleCopy(item?.password)}
                onMouseEnter={() => setCopyMessage1("Click to copy")}
                onMouseLeave={() => setCopyMessage1("")}
              >
                {/* Tooltip */}
                {showText === item.id && copyMessage1 && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-[#3766ED] text-white text-xs p-2 rounded shadow-lg z-30 transition-opacity duration-300 opacity-100 whitespace-nowrap">
                    {copyMessage1}
                  </div>
                )}

                <div className="break-words word-break-all overflow-hidden">
                  {showText === item.id ? item?.password : "******"}
                </div>
              </span>

              {/* Reveal/Hide Button */}
              {showText === item.id ? (
                <button
                  className="bg-white border border-gray-300 rounded-md shadow-md p-1 mt-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                  onClick={handleHideText}
                >
                  Hide Token
                </button>
              ) : (
                <button
                  className="bg-white border border-gray-300 rounded-md shadow-md p-1 mt-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                  onClick={() => handleRevealText(item.id)}
                >
                  Reveal Token
                </button>
              )}
            </td>

            <td className="p-4 whitespace-nowrap">
              {item.app_key && <>{item.app_key?.length > 15 ? item.app_key.slice(0, 15) + "..." : item.app_key} <br /></>}
              {item.app_secret.length > 15
                ? item.app_secret.slice(0, 15) + "..."
                : item.app_secret}</td>
            <td className="p-4 whitespace-nowrap">
              <h2 className={`${item.message ? "text-red-500" : ""} `}>
                {item.payment_sites_sum_amount}
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



            <td className="p-4 whitespace-nowrap">
              <h2 className={`${item.message ? "text-red-500" : ""} `}>
                {item.limit_amount ? item.limit_amount : ""}
              </h2>
            </td>
            <td className="p-4">
              <h2 className={`${item.message ? "text-red-500" : ""} `}>
                {item.message && item.message}
              </h2>
            </td>
            <td className="p-4">
              <label
                htmlFor={`toggle-${item.id}`}
                className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${item.active === 1 ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
              >
                <input
                  type="checkbox"
                  id={`toggle-${item.id}`}
                  className="peer sr-only"
                  checked={item.active === 1 ? true : false}
                  onChange={(e) => {
                    setChecked(e.target.checked, item.id);
                  }}
                />
                <span
                  className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                ></span>
              </label>
            </td>

            <td className="flex-1 p-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setBkashUpdate(item.id);
                    setUserName(item.name);
                    setBkashNumber(item.user_name);
                    setBkashPassword(item.password);
                    setBkashkey(item.app_key);
                    setBkashSecret(item.app_secret);
                    setDailyTransaction(item.daily_trx_limit);
                    setBkashAmountLimit(item.limit_amount);

                    setDropdownModel(true);
                  }}
                  className="text-white text-lg w-fit bg-green-500 hover:bg-green-800 rounded-[4px]  p-[5px] dark:bg-green-600 dark:hover:bg-green-500 focus:outline-none dark:focus:ring-green-800 flex items-center gap-1"
                >
                  <CiEdit />
                </button>
                <ActionButton
                  id={item.id}
                  setAction={setIsModalOpen}
                  title={"Delete"}
                  icon={<MdDelete />}
                  bgColor={"bg-red-500 hover:bg-red-800"}
                />
              </div>
            </td>
          </tr>
        ))}
      </Table>


      <DeleteItem
        deleteItem={isModalOpen}
        setDeleteItem={setIsModalOpen}
        handleDeleteItem={handleDeleteWithdraw}
        text="payment method"
        loading={deleteLoading}
      />

      <div className="px-6 py-5 md:flex items-center justify-between space-y-2">
        <div className="flex  items-center gap-4 w-full">
          {/* Add Payment Button */}
          <button
            id="handleClickOutsideOperator"
            onClick={() => {
              setBkashUpdate("");
              setUserName("");
              setBkashPassword("");
              setBkashkey("");
              setBkashSecret("");
              setBkashAmountLimit("");
              setDropdownModel(!dropdownModel);
            }}
            className="button_gradient"
          >
            <FaPlus className="text-lg" />
            Add Payment
          </button>

          {/* Toggle Switch */}
          {
            bkashlive && (
              <label
                className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${isChecked === true ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isChecked}
                  onChange={() => bkashGroupStop()}
                />
                <span
                  className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                ></span>
              </label>
            )
          }
        </div>

        <TableFooter
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={total?.totalPage || 0}
        />
      </div>

      {dropdownModel && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-3xl">
            <div className="relative bg-white rounded-[4px] shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto">
              {/* Modal content */}
              <div className="w-full p-10 space-y-5">
                <InputField
                  label="Name"
                  value={userName}
                  onChange={setUserName}
                  id="userName"
                />
                <InputField
                  label="Bkash User Number"
                  value={bkashNumber}
                  onChange={setBkashNumber}
                  id="bkashNumber"
                  required={true}
                  error={errors.bkashNumber}
                />

                <InputField
                  label="Bkash Password"
                  value={bkashPassword}
                  onChange={setBkashPassword}
                  id="bkashPassword"
                  required={true}
                  error={errors.bkashPassword}
                />

                <InputField
                  label="Bkash Public key"
                  value={bkashkey}
                  onChange={setBkashkey}
                  id="bkashkey"
                  required={true}
                  error={errors.bkashkey}
                />

                <InputField
                  label="Bkash Private key"
                  value={bkashSecret}
                  onChange={setBkashSecret}
                  id="bkashSecret"
                  required={true}
                  error={errors.bkashSecret}
                />

                <InputField
                  label="Daily Transaction Limit"
                  value={dailyTransaction}
                  onChange={setDailyTransaction}
                  id="dailyTransaction"
                  error={errors.dailyTransaction}
                />
                <InputField
                  label="Bkash Transaction Limit"
                  value={bkashAmountLimit}
                  onChange={setBkashAmountLimit}
                  id="bkashAmountLimit"
                  required={true}
                  error={errors.bkashAmountLimit}
                />

                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={bkashaddAndUpdate}
                    className="button_gradient "
                    disabled={loadignAdd}
                  >
                    {loadignAdd ? (
                      <>
                        <FaSpinner className="animate-spin" /> Loading...
                      </>
                    ) : bkashUpdate != "" ? (
                      "Update"
                    ) : (
                      "Add Payment"
                    )}
                  </button>
                  <button
                    onClick={() => setDropdownModel(false)}
                    type="button"
                    className="button_cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BkashPaymentMethod;

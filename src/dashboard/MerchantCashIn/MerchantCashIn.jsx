import { use, useContext, useEffect, useState } from "react";

//  react icons import
import { IoMdClose } from "react-icons/io";
import { GrRotateLeft } from "react-icons/gr";
import { PiClipboardFill } from "react-icons/pi";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";

// import react toast
import { toast } from "react-toastify";

// import component
import Auth from "../../utils/Auth";
import TitleDynamic from "../../TitleDynamic";
import MerchantCashInStatusChange from "./MerchantCashInStatusChange";
import FilterStatus from "../../components/FilterStatus";
import Table from "../../components/Table";
import DatePickers from "../../components/DatePickers";
import SearchInputField from "../../components/SearchInputField";
import TableFooter from "../../components/TableFooter";
import SearchFilterData from "../../components/SearchFilterData";
import ActionButton from "../../components/ActionButton";

// import time format
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import DeleteItem from "../../components/DeleteItem";
import CountdownTimer from "../../components/CountdownTimer";
import { contextAuth } from "../../pages/ContextProvider";
import { TextCopy } from "../../components/Textcopy";
import { TfiReload } from "react-icons/tfi";

function MerchantCashIn() {
  const headers = [
    "Sl",
    "Date",
    "Merchant Details",
    "Sender Info",
    "Wallet Info",
    "Amount",
    "Transaction ID",
    "Reference",
    "Status",
    "Action",
  ];
  const { ApiRequest } = Auth();
  const { merchantAll, countries, manualMethodList } = useContext(contextAuth);

  const [approveModal, setApproveModal] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState("");
  const [deleteItemLoading, setDeleteItemLoading] = useState(false);

  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchMerchant, setSearchMerchant] = useState("");

  // State variables to store start and end dates
  const [startEndDate, setStartEndDate] = useState({
    startDate: "",
    endDate: "",
  });

  const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
  const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");

  // difference day today and start date
  const date = new Date();
  const today = moment(date).format("YYYY-MM-DD");
  const startDates = moment(startDate);
  const todayDate = moment(today);
  const differenceInDays = todayDate.diff(startDates, "days");

  const [showMerchantStatus, setShowMerchantStatus] = useState(false);
  const [searchMerchantStatus, setSearchMerchantStatus] = useState("");
  const [showMerchantList, setShowMerchantList] = useState(false);
  const [searchMerchantName, setSearchMerchantName] = useState("");
  const [searchMerchantNumber, setSearchMerchantNumber] = useState("");
  const [showCashInAutoManual, setShowCashInAutoManual] = useState(false);
  const [searchCashInAutoManual, setSearchCashInAutoManual] = useState("");
  const [methodDaynamiks, setMethodDaynamiks] = useState([]);

  const [countryShow, setCountryShow] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");

  const [merchantMethod, setMerchantMethod] = useState("");
  const [showMerchantMethod, setShowMerchantMethod] = useState(false);

  const [filterMerchant, setFilterMerchant] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const token = Cookies.get("token");

  const [cashInData, setCashInData] = useState([]);
  const [cashInStatus, setCashInStatus] = useState([]);
  const [cashInStatusChange, setCashInStatusChange] = useState();

  // Retrieve the per-page configuration from localStorage on component mount
  const pathName = useLocation().pathname;
  useEffect(() => {
    const perPage = localStorage.getItem("perPage");
    const parsedPerPage = perPage ? JSON.parse(perPage) : {};

    if (
      parsedPerPage[pathName] &&
      typeof parsedPerPage[pathName] === "number"
    ) {
      setItemsPerPage(parsedPerPage[pathName]);
    }
  }, []);

  useEffect(() => {
    merchantSRC();
  }, [searchMerchant]);

  const merchantSRC = async () => {
    if (searchMerchant.length < 2) {
      return;
    }
    try {
      const response = await ApiRequest({
        url: "/admin/merchant/transactions_src",
        formdata: { searchMerchant },
      });
      if (response?.status === 200) {
        if (response.data) {
          if (response.data.length > 0) {
            setData(response.data);
          }
        }
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    setCurrentPage(1);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/merchant/deposits?search=${searchMerchant}&merchant=${searchMerchantName?.phone || ""
          }&status=${searchMerchantStatus}&start_date=${differenceInDays > 0 ? startDate : ""
          }&end_date=${differenceInDays > 0 ? endDate : ""}&country=${filterMerchant?.id || ""
          }&page=${currentPage}&per_page=${ItemsPerPage}&payment_method_type=${searchCashInAutoManual || ""}&payment_method=${merchantMethod ? checkAndRemoveAuto(merchantMethod) : ""}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response?.data?.status === 200) {
          setCashInData(response?.data?.data || []);
        }
      } catch (error) {
        toast.error("Failed to fetch merchant cash-in data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    ItemsPerPage,
    searchMerchant,
    searchMerchantName,
    searchMerchantStatus,
    startDate,
    endDate,
    filterMerchant,
    merchantMethod,
    searchCashInAutoManual,
  ]);


  const checkAndRemoveAuto = (method) => {
    if (method.includes("Auto")) {
      const updatedMethod = method.replace("Auto", "").trim();
      return updatedMethod;
    }
    return method.toLowerCase();
  };

  useEffect(() => {
    const getNewMerchantCashIn = async () => {

      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/merchant/deposits?search=${searchMerchant}&merchant=${searchMerchantName ? searchMerchantName?.phone : ""
          }&status=${searchMerchantStatus}&start_date=${differenceInDays > 0 ? startDate : ""
          }&end_date=${differenceInDays > 0 ? endDate : ""}&country=${filterMerchant?.id ? filterMerchant?.id : ""
          }&page=${currentPage}&per_page=${ItemsPerPage}&payment_method_type=${searchCashInAutoManual ? searchCashInAutoManual : ""}&payment_method=${merchantMethod ? checkAndRemoveAuto(merchantMethod) : ""}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response?.data?.status === 200) {
          setCashInData(response?.data?.data || []);
        }
      } catch (error) {
        toast.error("Failed to fetch merchant cash-in data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getNewMerchantCashIn();
    setRender(false);
  }, [currentPage, render]);

  useEffect(() => {
    const getNewMerchantCashInStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/cash_in_transaction_statuses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCashInStatus(response?.data?.data || []);
      } catch (error) {
        toast.error("Failed to fetch merchant cash-in data. Please try again.");
      }
    };
    getNewMerchantCashInStatus();
  }, []);

  const totalPage = Math.ceil(cashInData.total / ItemsPerPage);

  // filter by country
  const filterCountry = countries?.filter((item) =>
    item?.name?.toLowerCase().includes(searchCountry?.toLowerCase())
  );
  // filter by merchant number
  const filterMerchantUser = merchantAll?.filter((item) =>
    item?.name?.toLowerCase().includes(searchMerchantNumber?.toLowerCase())
  );
  // close on click outside

  const handleDelete = async (id) => {
    setDeleteItemLoading(true);
    try {
      const response = await ApiRequest({
        url: `/admin/merchant/deposits/delete/${id}`,
        method: "delete",
      });
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/merchant/deposits?page=${currentPage}&per_page=${ItemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCashInData((prev) => response?.data?.data ? response?.data?.data : prev);
      } catch (error) {
        // toast.error("Failed to fetch merchant cash-in data. Please try again.");
      }
      toast.success("Cash in deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete cash in. Please try again.");
    }
    setDeleteModalOpen("");
    setDeleteItemLoading(false);
  };

  useEffect(() => {
    if (cashInStatusChange?.length > 0) {
      setCashInData((prev) => ({
        ...prev,
        paymentSite: prev?.paymentSite?.map((item) => {
          const updatedStatus = cashInStatusChange?.find(
            (status) => status.id === item.id
          );
          if (updatedStatus) {
            return {
              ...item,
              transactionStatus: updatedStatus.status,
            };
          }
          return item;
        }),
      }));
    }
  }, [cashInStatusChange]);

  const filteredData = cashInData?.paymentSite?.filter((item) =>
    item.transactionStatus === "Pending" &&
    !item.payment_method?.includes("manual")
  );

  // useEffect hook
  useEffect(() => {
    if (!searchCashInAutoManual && showMerchantMethod === true) {
      toast.error("Please select either Auto or Manual", {
        position: "top-center",
      });
      setShowMerchantMethod(false);
      return;
    }
    if (searchCashInAutoManual === "Auto") {
      const autoMethods = [
        "Bkash Auto",
        "Nagad Auto",
        "Upay Auto",
        "Rocket Auto",
      ];
      setMethodDaynamiks(autoMethods);
    } else if (searchCashInAutoManual === "Manual") {
      const manualMethods = manualMethodList?.map((item) => item?.name);
      setMethodDaynamiks(manualMethods);
    }
  }, [searchCashInAutoManual, showMerchantMethod]);


  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest("#showMerchantList")) {
        setShowMerchantList(false);
      }
    };
    const handleClickOutShowCountry = (event) => {
      if (!event.target.closest("#setCountryShow")) {
        setCountryShow(false);
      }
    };
    const handleClickOutShowMethod = (event) => {
      if (!event.target.closest("#setShowMerchantMethod")) {
        setShowMerchantMethod(false);
      }
    };
    const handleClickOutShowMerchantStatus = (event) => {
      if (!event.target.closest("#handleClickOutShowMerchantStatus")) {
        setShowMerchantStatus(false);
      }
    };
    const handleClickOutAutoManual = (event) => {
      if (!event.target.closest("#setShowCashInAutoManual")) {
        setShowCashInAutoManual(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideOperator);
    window.document.addEventListener("click", handleClickOutShowCountry);
    window.document.addEventListener("click", handleClickOutShowMerchantStatus);
    window.document.addEventListener("click", handleClickOutShowMethod);
    window.document.addEventListener("click", handleClickOutAutoManual);

    return () => {
      window.document.removeEventListener("click", handleClickOutsideOperator);
      window.document.removeEventListener("click", handleClickOutShowCountry);
      window.document.removeEventListener("click", handleClickOutShowMethod);
      window.document.removeEventListener("click", handleClickOutAutoManual);
      window.document.removeEventListener(
        "click",
        handleClickOutShowMerchantStatus
      );
    };
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <TitleDynamic title="Merchant Cash In" />

      <div className="relative  bg-white  boxShadow-table dark:bg-gray-800 rounded-[4px]">
        <div className=" md:flex items-start justify-between px-5 py-6">
          <div className="flex flex-wrap items-center gap-1 ">
            {/* Search Name, Trx id, and Reference code start */}
            <SearchInputField
              searchText={searchMerchant}
              setSearchText={setSearchMerchant}
              placeholderText="Search Reference, Trx Id, Amount"
            />
            {/* Search Name, Trx id, and Reference code end */}

            {/* Choose a Merchant Country code start */}
            <SearchFilterData
              dropdownManu={countryShow}
              setDropdownManu={setCountryShow}
              showData={filterMerchant?.name}
              setShowData={setFilterMerchant}
              placeholderText="Country..."
              id="setCountryShow"
            >
              <input
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="bg-gray-50 border-gray-300 text-gray-900 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-none"
                placeholder="Search Country..."
              />

              {/* Country List */}
              {filterCountry?.length > 0 ? (
                filterCountry?.map((country, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                    onClick={() => {
                      setFilterMerchant(country);
                      setSearchCountry("");
                      setCountryShow(false);
                    }}
                  >
                    <h2>{country.name}</h2>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  No Data Available
                </div>
              )}
            </SearchFilterData>
            {/* Choose a Merchant Country code end */}

            {/* Filter merchant number code start  */}
            <SearchFilterData
              dropdownManu={showMerchantList}
              setDropdownManu={setShowMerchantList}
              showData={
                searchMerchantName?.name?.length > 15
                  ? searchMerchantName?.name.slice(0, 15) + "..."
                  : searchMerchantName?.name
              }
              setShowData={setSearchMerchantName}
              placeholderText="Merchant..."
              id="showMerchantList"
            >
              <input
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSearchMerchantNumber(e.target.value)}
                className="bg-gray-50 border-gray-300 text-gray-900 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-none"
                placeholder="Search Merchant..."
              />

              {/* Country List */}
              {filterMerchantUser?.length > 0 ? (
                filterMerchantUser?.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                    onClick={() => {
                      setSearchMerchantName(item);
                      setSearchMerchantNumber("");
                      setShowMerchantList(false);
                    }}
                  >
                    <h2>{item.name}</h2>
                    <h2>{item.phone}</h2>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  No Data Available
                </div>
              )}
            </SearchFilterData>
            {/* Filter merchant number code end  */}

            {/* auto and manual */}
            <FilterStatus
              showMerchantStatus={showCashInAutoManual}
              setShowMerchantStatus={setShowCashInAutoManual}
              setSearchMerchantStatus={setSearchCashInAutoManual}
              searchMerchantStatus={searchCashInAutoManual}
              id="setShowCashInAutoManual"
              placeholderText="Auto & Manual..."
            >
              {['Auto', 'Manual']?.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                  onClick={() => setSearchCashInAutoManual(item)}
                >
                  <span> {item}</span>
                </div>
              ))}
            </FilterStatus>
            {/* auto and manual */}

            <FilterStatus
              showMerchantStatus={showMerchantMethod}
              setShowMerchantStatus={setShowMerchantMethod}
              setSearchMerchantStatus={setMerchantMethod}
              searchMerchantStatus={merchantMethod}
              id="setShowMerchantMethod"
              placeholderText="Cash In Method..."
            >
              {methodDaynamiks?.length > 0 && searchCashInAutoManual && methodDaynamiks?.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                  onClick={() => setMerchantMethod(item)}
                >
                  <span> {item}</span>
                </div>
              ))}
            </FilterStatus>
            {/* Filter status code start  */}
            <FilterStatus
              showMerchantStatus={showMerchantStatus}
              setShowMerchantStatus={setShowMerchantStatus}
              setSearchMerchantStatus={setSearchMerchantStatus}
              searchMerchantStatus={searchMerchantStatus}
              id="handleClickOutShowMerchantStatus"
              placeholderText="Status..."
            >
              {cashInStatus?.map((item, index) => (
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
          <div className="w-full 2xl:w-fit flex items-end justify-end mt-3 md:mt-0">
            <DatePickers
              setStartEndDate={setStartEndDate}
              startEndDate={startEndDate}
            />
          </div>
        </div>

        {/* show the all data in the table format  */}

        <Table headers={headers}>
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
              <tr
                key={index}
                className="table_tr"
              >
                <td className="px-6 py-4">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-6 w-12"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-6 w-24 mb-2"></div>
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-4 w-16"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-6 w-24"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-6 w-20"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-6 w-36"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-6 w-40 flex gap-2 items-center">
                    <div className="bg-gray-400 dark:bg-gray-600 rounded-full h-6 w-6"></div>
                    <div className="flex-grow bg-gray-300 dark:bg-gray-700 rounded h-6"></div>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-6 w-16"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-6 w-16"></div>
                </td>
                <td className="p-4">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-6 w-28"></div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-4 w-4"></div>
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-4 w-4"></div>
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-4 w-4"></div>
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-4 w-4"></div>
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded h-4 w-4"></div>
                  </div>
                </td>
              </tr>
            ))
            : cashInData?.paymentSite?.map((item, index) => (
              <tr
                key={index}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="px-6 py-4 w-[50px]">
                  {cashInData?.total -
                    ((currentPage - 1) * ItemsPerPage + index)}
                </td>

                <td className="p-4 w-[150px] whitespace-nowrap">
                  {item.created_at
                    && moment(item.created_at).format(" DD MMM YYYY")}
                  <br />
                  {item.created_at
                    && moment(item.created_at).format("h:mm a")}
                </td>

                <td scope="row" className="p-4 cursor-pointer">
                  <div
                    onClick={() =>
                      setSearchMerchantName({
                        name: item?.users?.name,
                        phone: item?.users?.phone,
                      })
                    }
                    className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold"
                  >
                    {item?.users?.name && <>{item?.users?.name} <br /></>}
                    {item?.users?.phone}
                  </div>
                </td>

                <td className="p-4  whitespace-nowrap">
                  <h2 className="w-[180px]">
                    {item.customerMsisdn
                      ? item.customerMsisdn
                      : item.payment_method?.includes("manual") &&
                        item.manual?.payment_fields
                        ? (() => {
                          // Ensure payment_fields is parsed into an object
                          let paymentFields = {};
                          try {
                            paymentFields =
                              typeof item.manual.payment_fields === "string"
                                ? JSON.parse(item.manual.payment_fields)
                                : item.manual.payment_fields;
                          } catch (error) {
                            /* console.error(
                              "Error parsing payment_fields:",
                              error
                            ); */
                          }
                          // Render the parsed object
                          return (
                            <div>
                              {Object.entries(paymentFields).map(
                                ([key, value], index) =>
                                  key === "TrxId" ? (
                                    ""
                                  ) : (
                                    <p key={index}>
                                      {`${key.slice(0, 7)} : ${value.slice(
                                        0,
                                        15
                                      )}...`}
                                    </p>
                                  )
                              )}
                            </div>
                          );
                        })()
                        : ""}
                  </h2>
                </td>

                <td className="p-4 whitespace-nowrap ">
                  {item.currency && <>{item.currency}<br /></>}
                  {item.payment_method && <>{item.payment_method.charAt(0).toUpperCase() +
                    item.payment_method.slice(1).toLowerCase()}<br /></>}
                  {item.merchant_number && item.merchant_number}
                </td>

                <td className="p-4  whitespace-nowrap ">
                  {item.amount && item.amount}
                </td>
                <td className="p-4  whitespace-nowrap ">
                  {item.trxID && <TextCopy text={item.trxID} />}
                </td>

                <td className="p-4 ">
                  {item.reference && <TextCopy text={item.reference} />}
                </td>
                <td className="p-4 space-y-2">
                  <div
                    onClick={() =>
                      setSearchMerchantStatus(item.transactionStatus)
                    }
                    className={`px-2 py-0.5 rounded border border-dotted flex items-center cursor-pointer transition-colors duration-200 gap-2 w-fit ${{
                      Success:
                        "bg-green-600 hover:bg-green-800 text-white border-green-800",
                      Pending:
                        "bg-[#ff7654] hover:bg-[#da5737] text-white border-[#ff7654]",
                      Failed:
                        "bg-red-600 hover:bg-red-800 text-white border-red-800",
                      Rejected:
                        "bg-[#ff1d1d] hover:bg-[#d63737] text-white border-[#ff1d1d]",
                    }[
                      Array.isArray(cashInStatusChange) &&
                        cashInStatusChange.find(
                          (status) => status.id === item.id
                        )
                        ? cashInStatusChange.find(
                          (status) => status.id === item.id
                        ).status
                        : item.transactionStatus
                    ] ||
                      "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400"
                      }`}
                  >
                    {Array.isArray(cashInStatusChange) &&
                      cashInStatusChange.find((status) => status.id === item.id)
                      ? cashInStatusChange.find(
                        (status) => status.id === item.id
                      ).status
                      : item.transactionStatus}
                  </div>

                  {(Array.isArray(cashInStatusChange) &&
                    cashInStatusChange.find((status) => status.id === item.id)
                    ? cashInStatusChange.find(
                      (status) => status.id === item.id
                    ).status === "Pending"
                    : item.transactionStatus === "Pending") &&
                    !item.payment_method?.includes("manual") && (
                      <CountdownTimer
                        item={item}
                        filteredData={filteredData}
                        setCashInStatusChange={setCashInStatusChange}
                      />
                    )}
                </td>

                <td className="p-4  ">
                  <div className="flex items-center gap-1">

                    <ActionButton
                      id={{
                        id: item.id,
                        status: "Success",
                        itemStatus: item.transactionStatus,
                        btnText: "Approve",
                        iconColor: "text-green-500",
                        icon: <FaCheck size={40} />,
                        bgColor: "bg-green-500",
                        btnColor: "bg-green-500 hover:bg-green-800",
                        cancelBgColor:
                          "text-white bg-red-500  hover:bg-red-800",
                        title: (
                          <>
                            Are you sure? <br />
                            You want to approve this Cash In
                          </>
                        ),
                      }}
                      setAction={setApproveModal}
                      title={"Approve"}
                      icon={<FaCheck />}
                      bgColor={"bg-green-500 hover:bg-green-800"}
                    />
                    {
                      item.payment_method?.includes("manual") && item.transactionStatus === "Pending" &&
                      <ActionButton
                        id={{
                          id: item.id,
                          status: "Manual",
                          itemStatus: item.customerMsisdn,
                          btnText: "Re-generate",
                          iconColor: "text-[#FF5733]",
                          icon: <TfiReload size={40} />,
                          bgColor: "bg-[#FF5733]",
                          btnColor: "bg-[#FF5733] hover:bg-[#fc3d16]",
                          cancelBgColor:
                            "text-white bg-red-500  hover:bg-red-800",
                          title: (
                            <>
                              Are you sure? <br />
                              You want to re-generate this Cash In
                            </>
                          ),
                        }}
                        setAction={setApproveModal}
                        title={"Re-generate"}
                        icon={<TfiReload />}
                        bgColor={"bg-[#FF5733] hover:bg-[#fc3d16]"}
                      />
                    }
                    <ActionButton
                      id={{
                        id: item.id,
                        status: "Refund",
                        btnText: "Refund",
                        iconColor: "text-blue-500",
                        icon: <GrRotateLeft size={40} />,
                        bgColor: "bg-blue-500",
                        btnColor: "bg-blue-500 hover:bg-blue-800",
                        cancelBgColor:
                          "text-white bg-red-500  hover:bg-red-800",
                        title: (
                          <>
                            Are you sure? <br />
                            You want to refund this Cash In
                          </>
                        ),
                      }}
                      setAction={setApproveModal}
                      title={"Refund"}
                      icon={<GrRotateLeft />}
                      bgColor="bg-teal-500 hover:bg-teal-800"
                    />
                    <ActionButton
                      id={{
                        id: item.id,
                        status: "Rejected",
                        btnText: "Reject",
                        iconColor: "text-red-500",
                        icon: <IoMdClose size={40} />,
                        bgColor: "bg-red-500",
                        btnColor: "bg-red-500 hover:bg-red-800",
                        cancelBgColor:
                          "text-gray-700 bg-gray-100 hover:bg-gray-200",
                        title: (
                          <>
                            Are you sure? <br />
                            You want to reject this Cash In
                          </>
                        ),
                      }}
                      setAction={setApproveModal}
                      title={"Reject"}
                      icon={<IoMdClose />}
                      bgColor={"bg-red-500 hover:bg-red-800"}
                    />
                    <ActionButton
                      id={{
                        id: item.id,
                        status: "Failed",
                        btnText: "Failed",
                        iconColor: "text-orange-500",
                        icon: <FaExclamationTriangle size={40} />,
                        bgColor: "bg-orange-500",
                        btnColor: "bg-orange-500 hover:bg-orange-800",
                        cancelBgColor:
                          "text-gray-700 bg-gray-100 hover:bg-gray-200",
                        title: (
                          <>
                            Are you sure? <br />
                            You want to failed this Cash In
                          </>
                        ),
                      }}
                      setAction={setApproveModal}
                      title={"Failed"}
                      icon={<FaExclamationTriangle />}
                      bgColor={"bg-orange-600 hover:bg-orange-800"}
                    />
                    <ActionButton
                      id={item.id}
                      setAction={setDeleteModalOpen}
                      title={"Delete"}
                      icon={<MdDelete />}
                      bgColor={"bg-red-500 hover:bg-red-800"}
                    />
                  </div>
                  {approveModal && (
                    <MerchantCashInStatusChange
                      setApproveModal={setApproveModal}
                      approveModal={approveModal}
                      item={item}
                      setRender={setRender}
                      setCashInData={setCashInData}
                      setCashInStatus={setCashInStatus}
                    />
                  )}
                </td>
              </tr>
            ))}
        </Table>
        {/* show the all data in the table format  */}

        {/* table footer code start  */}
        <TableFooter
          totalItems={cashInData?.total}
          currentPage={currentPage}
          perPage={ItemsPerPage}
          setPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          totalPage={totalPage}
        />
        {/* table footer code end  */}
      </div>

      <DeleteItem
        deleteItem={deleteModalOpen}
        setDeleteItem={setDeleteModalOpen}
        handleDeleteItem={handleDelete}
        text="Cash In"
        loading={deleteItemLoading}
      />
    </section>
  );
}

export default MerchantCashIn;

import { useContext, useEffect, useState } from "react";

//  react icons import
import { PiClipboardFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";

// react toast npm package
import { toast } from "react-toastify";

// import component
import Auth from "../../utils/Auth";
import SearchInputField from "../../components/SearchInputField";
import FilterStatus from "../../components/FilterStatus";
import PayoutStatusChange from "./PayoutStatusChange";
import Table from "../../components/Table";
import TitleDynamic from "../../TitleDynamic";
import useFetchData from "../../utils/useFetchData";
import SearchFilterData from "../../components/SearchFilterData";
import TableFooter from "../../components/TableFooter";
import DeleteItem from "../../components/DeleteItem";
import ActionButton from "../../components/ActionButton";

//  import time formate package
import moment from "moment";
import { useLocation } from "react-router-dom";
import { FaCheck, FaExclamationTriangle, FaRegEye } from "react-icons/fa";
import { GrRotateLeft } from "react-icons/gr";
import axios from "axios";
import Cookies from "js-cookie";
import CountdownTimerPayout from "../../components/CountdownTimerPayout";
import { contextAuth } from "../../pages/ContextProvider";
import DatePickers from "../../components/DatePickers";
import { TextCopy } from "../../components/Textcopy";
import ResetBalance from "./ResetBalance";
import ShowExtraData from "./ShowExtraData";

function MerchantPayout() {
  const headers = [
    "Sl",
    "Date",
    "Merchant Details",
    "Sender Info",
    "Payout Info",
    "Amount",
    "Trx ID/ Payout ID",
    "Reason",
    "Attempt",
    "Status",
    "Action",
  ];

  const { ApiRequest } = Auth();
  const { merchantAll, countries } = useContext(contextAuth);

  const [searchMerchant, setSearchMerchant] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

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

  const [searchMerchantName, setSearchMerchantName] = useState("");
  const [showMerchantList, setShowMerchantList] = useState(false);
  const [searchMerchantNumber, setSearchMerchantNumber] = useState("");

  const [searchSenderName, setSearchSenderName] = useState("");
  const [sender, setSender] = useState("");
  const [showSenderList, setShowSenderList] = useState(false);

  const [searchMerchantStatus, setSearchMerchantStatus] = useState("");
  const [showMerchantStatus, setShowMerchantStatus] = useState(false);

  const [merchantMethod, setMerchantMethod] = useState("");
  const [showMerchantMethod, setShowMerchantMethod] = useState(false);

  const [country, setCountry] = useState("");
  const [countryShow, setCountryShow] = useState(false);
  const [searchCountry, setSearchCountry] = useState("");
  const [refund, setRefund] = useState("");
  const [payoutExtraData, setPayoutExtraData] = useState("");

  const [payoutStatusChangeModalOpen, setPayoutStatusChangeModalOpen] =
    useState(null);
  const [payoutDelete, setPayoutDelete] = useState("");

  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [render, setRender] = useState(false);

  const [total, setTotal] = useState({});
  const [payoutStatus, setPayoutStatus] = useState([]);

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

  const token = Cookies.get("token");

  const [filterSender, setFilterSender] = useState([]);
  const [payouttatusChange, setpayouttatusChange] = useState([]);

  useEffect(() => {
    const fetchMerchantData = async () => {
      setLoadingData(true);
      try {
        const response = await ApiRequest({
          url: `/admin/merchant/payout?sender=${sender?.sender || ""
            }&search=${searchMerchant}&per_page=${ItemsPerPage}&page=${currentPage}&country=${country?.id || ""
            }&merchant_number=${searchMerchantName?.merchant?.id || ""
            }&payment_method=${merchantMethod}&status=${searchMerchantStatus}&start_date=${differenceInDays > 0 ? startDate : ""
            }&end_date=${differenceInDays > 0 ? endDate : ""}`,
          method: "get",
        });

        if (response?.status === 200) {
          setData(response.data?.data);
          setTotal({
            totalItems: response.data?.total,
            totalPage: response.data?.last_page,
          });
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoadingData(false);
      }
    };

    setRender(false);
    fetchMerchantData();
  }, [currentPage, render]);

  useEffect(() => {
    setCurrentPage(1);
    const fetchMerchantData = async () => {
      try {
        const response = await ApiRequest({
          url: `/admin/merchant/payout?sender=${sender?.sender || ""
            }&search=${searchMerchant}&per_page=${ItemsPerPage}&page=${currentPage}&country=${country?.id || ""
            }&merchant_number=${searchMerchantName?.merchant?.id || ""
            }&payment_method=${merchantMethod}&status=${searchMerchantStatus}&start_date=${differenceInDays > 0 ? startDate : ""
            }&end_date=${differenceInDays > 0 ? endDate : ""}`,
          method: "get",
        });

        if (response?.status === 200) {
          setData(response.data?.data);
          setTotal({
            totalItems: response.data?.total,
            totalPage: response.data?.last_page,
          });
        } else {
          toast.error("Failed to fetch data");
        }
      } catch (error) {
        toast.error("Failed to fetch data");
      }
    };
    fetchMerchantData();
  }, [
    country,
    searchMerchant,
    sender,
    merchantMethod,
    searchMerchantName,
    searchMerchantStatus,
    ItemsPerPage,
    startEndDate
  ]);

  const { data: payoutSenders } = useFetchData(
    "/admin/merchant/payout_senders"
  );
  useEffect(() => {
    if (payoutSenders?.data) {
      const filtered = searchSenderName
        ? payoutSenders.data.filter((item) =>
          item?.sender?.includes(searchSenderName)
        )
        : payoutSenders.data;

      setFilterSender(filtered);
    }
  }, [searchSenderName, payoutSenders?.data]);

  useEffect(() => {
    getNewMerchantPayoutStatus();
  }, []);
  const getNewMerchantPayoutStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/merchant/payout_status_list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPayoutStatus(response?.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch merchant cash-in data. Please try again.");
    }
  };
  // filter by country
  const filterCountry = countries?.filter((item) =>
    item?.name?.toLowerCase().includes(searchCountry?.toLowerCase())
  );

  // filter by merchant number
  const filterMerchant = merchantAll?.filter((item) =>
    item?.name?.toLowerCase().includes(searchMerchantNumber?.toLowerCase())
  );

  const checkMerchant = (name) => {
    const merchant = merchantAll?.find((item) => item?.name === name);
    return merchant;
  };
  // outlet click close the toggle function
  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest("#showMerchantList")) {
        setShowMerchantList(false);
      }
    };
    const handleClickOutShowSenderList = (event) => {
      if (!event.target.closest("#setShowSenderList")) {
        setShowSenderList(false);
      }
    };
    const handleClickOutShowMerchantStatus = (event) => {
      if (!event.target.closest("#setShowMerchantStatus")) {
        setShowMerchantStatus(false);
      }
    };
    const handleClickOutShowCountry = (event) => {
      if (!event.target.closest("#setCountryShow")) {
        setCountryShow(false);
      }
    };
    const handleClickOutShowMerchantMethod = (event) => {
      if (!event.target.closest("#setShowMerchantMethod")) {
        setShowMerchantMethod(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideOperator);
    window.document.addEventListener("click", handleClickOutShowMerchantStatus);
    window.document.addEventListener("click", handleClickOutShowSenderList);
    window.document.addEventListener("click", handleClickOutShowCountry);
    window.document.addEventListener("click", handleClickOutShowMerchantMethod);

    return () => {
      window.document.removeEventListener("click", handleClickOutsideOperator);
      window.document.removeEventListener(
        "click",
        handleClickOutShowSenderList
      );
      window.document.removeEventListener("click", handleClickOutShowCountry);
      window.document.removeEventListener(
        "click",
        handleClickOutShowMerchantStatus
      );
      window.document.removeEventListener("click", handleClickOutShowMerchantMethod
      );
    };
  }, []);

  const handleDeleteMerchant = async (id) => {
    setLoadingDelete(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/merchant/delete_payout/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await ApiRequest({
          url: `/admin/merchant/payout?per_page=${ItemsPerPage}&page=${currentPage}`,
          method: "get",
        });
        setData(response.data?.data);
        setTotal({
          totalItems: response.data?.total,
          totalPage: response.data?.last_page,
        });
      } catch (error) {
        // toast.error("Failed to fetch data");
      }
      toast.success(response.data.data);
      setPayoutDelete(null);
    } catch (error) {
      toast.error("Failed to delete payout");
    }
    setLoadingDelete(false);
  };

  useEffect(() => {
    if (Array.isArray(payouttatusChange) && payouttatusChange.length > 0) {
      setData((prev) =>
        prev.map((item) => {
          const updatedItem = payouttatusChange.find(
            (change) => change.id === item.id
          );
          // If found, update status
          if (updatedItem) {
            return { ...item, status: updatedItem.status, failed_attempt: updatedItem.attempt };
          }
          return item;
        })
      );
    }
  }, [payouttatusChange]);

  const filteredData = data?.filter((item) =>
    ["Pending", "Awaited"].includes(item.status)
  );

  return (
    <section className="bg-gray-50 dark:bg-gray-800">
      <TitleDynamic title="Merchant Payout" />

      <div className="relative  bg-white  boxShadow-table dark:bg-gray-800 rounded-[4px]">
        <div className=" justify-between px-5 py-6 md:flex">
          {/* search number amount and choose country and filter merchant number and filter merchant status  */}
          <div className="flex flex-wrap items-center gap-1 ">
            {/* Search Method, Number, Amount and Trx id code start*/}
            <SearchInputField
              searchText={searchMerchant}
              setSearchText={setSearchMerchant}
              placeholderText="Search Payment Id, Trx Id, Amount... "
            />
            {/* Search Method, Number, Amount and Trx id code end*/}

            {/* Choose a Merchant Country code start  */}

            <SearchFilterData
              dropdownManu={countryShow}
              setDropdownManu={setCountryShow}
              showData={country?.name}
              setShowData={setCountry}
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
              {filterCountry.length > 0 ? (
                filterCountry.map((country, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                    onClick={() => {
                      setCountry(country);
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
            {/* Filter merchant number code start  */}
            <SearchFilterData
              dropdownManu={showMerchantList}
              setDropdownManu={setShowMerchantList}
              showData={
                searchMerchantName?.name?.length > 20
                  ? searchMerchantName?.name.slice(0, 20) + "..."
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
              {filterMerchant.length > 0 ? (
                filterMerchant.map((item, index) => (
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

            {/* Filter sender number code start  */}
            <SearchFilterData
              dropdownManu={showSenderList}
              setDropdownManu={setShowSenderList}
              showData={sender?.sender}
              setShowData={setSender}
              placeholderText="Sender..."
              id="setShowSenderList"
            >
              <input
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSearchSenderName(e.target.value)}
                className="bg-gray-50 border-gray-300 text-gray-900 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-none"
                placeholder="Search Sender..."
              />

              {/* Country List */}
              {filterSender.length > 0 ? (
                filterSender.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                    onClick={() => {
                      setSender(item);
                      setSearchSenderName("");
                      setShowSenderList(false);
                    }}
                  >
                    <h2>{item.sender}</h2>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  No Data Available
                </div>
              )}
            </SearchFilterData>
            {/* Filter sender number code end  */}

            {/* Filter status code start  */}
            <FilterStatus
              showMerchantStatus={showMerchantStatus}
              setShowMerchantStatus={setShowMerchantStatus}
              setSearchMerchantStatus={setSearchMerchantStatus}
              searchMerchantStatus={searchMerchantStatus}
              id="setShowMerchantStatus"
              placeholderText="Payout Status..."
            >
              {payoutStatus?.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                  onClick={() => setSearchMerchantStatus(item)}
                >
                  <span> {item}</span>
                </div>
              ))}
            </FilterStatus>
            <FilterStatus
              showMerchantStatus={showMerchantMethod}
              setShowMerchantStatus={setShowMerchantMethod}
              setSearchMerchantStatus={setMerchantMethod}
              searchMerchantStatus={merchantMethod}
              id="setShowMerchantMethod"
              placeholderText="Payout Method..."
            >
              {["Bkash", "Nagad", "Upay", "Rocket"]?.map((item, index) => (
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
          </div>
          <div className="mt-4 md:mt-0">
            <DatePickers
              setStartEndDate={setStartEndDate}
              startEndDate={startEndDate}
            />
          </div>
        </div>

        {/* table code start  */}
        <Table headers={headers}>
          {loadingData
            ? Array.from({ length: 10 }).map((_, index) => (
              <tr
                key={index}
                data-testid="table-row-skeleton"
                className="table_tr"
              >
                <td className="px-6 py-4">
                  <div className="w-8 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded mb-1"></div>
                  <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="w-28 h-5 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded mb-1"></div>
                  <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded mb-1"></div>
                  <div className="w-28 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600  animate-pulse rounded"></div>
                </td>
                <td className="flex-1 p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600  animate-pulse rounded-full"></div>
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600  animate-pulse rounded-full"></div>
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600  animate-pulse rounded-full"></div>
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600  animate-pulse rounded-full"></div>
                  </div>
                </td>
              </tr>
            ))
            : data?.map((item, index) => (
              <tr
                key={index}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="px-6 py-4" style={{ width: "50px" }}>
                  {total?.totalItems -
                    ((currentPage - 1) * ItemsPerPage + index)}
                </td>

                <td
                  className="p-4  whitespace-nowrap"
                  style={{ width: "100px" }}
                >
                  <h2>
                    {item.created_at
                      ? moment(item.created_at).format(" DD MMM YYYY")
                      : "--"}
                  </h2>
                  <h2>
                    {item.created_at
                      ? moment(item.created_at).format("h:mm a")
                      : "--"}
                  </h2>
                </td>

                <td
                  scope="row"
                  className="p-4 cursor-pointer whitespace-nowrap"
                >
                  {(() => {
                    const data = checkMerchant(item?.user_name);
                    return data ? (
                      <div
                        onClick={() =>
                          setSearchMerchantName(data)
                        }
                        className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold "
                      >
                        {data.name && <>{data.name} <br /></>}
                        {data.phone}
                      </div>
                    ) : (
                      ""
                    );
                  })()}
                </td>

                <td className="p-4  ">
                  {item.sender && (
                    <h2
                      onClick={() => setSender(item)}
                      className="w-[130px] font-semibold text-blue-700 cursor-pointer"
                    >
                      {item.sender}
                    </h2>
                  )}
                </td>
                <td className="p-4  whitespace-nowrap ">
                  {item.currency && <>{item.currency} <br /></>}
                  {item.payment_method && <>{item.payment_method.charAt(0).toUpperCase() +
                    item.payment_method.slice(1).toLowerCase()} <br /></>}
                  {item.withdraw_number}
                </td>

                <td className="p-4  whitespace-nowrap ">
                  <h2>{item.amount}</h2>
                </td>
                <td
                  scope="row"
                  className="p-4  cursor-pointer whitespace-nowrap"
                >
                  {item.trxID && <TextCopy text={item.trxID} fontSize="font-bold" />}
                  {item.uniqId && <TextCopy text={item.uniqId} />}
                </td>

                <td className="p-4  whitespace-nowrap ">
                  <h2 className="w-[150px] overflow-hidden text-ellipsis whitespace-normal">
                    {item.failed_reason && item.failed_reason}
                  </h2>
                </td>
                <td className="p-4  whitespace-nowrap ">
                  {item.failed_attempt && item.failed_attempt}
                </td>
                <td className="p-4 space-y-2">
                  <div
                    onClick={() => setSearchMerchantStatus(item.status)}
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
                      Array.isArray(payouttatusChange) &&
                        payouttatusChange.find(
                          (status) => status.id === item.id
                        )
                        ? payouttatusChange.find(
                          (status) => status.id === item.id
                        ).status
                        : item.status
                    ] ||
                      "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400"
                      }`}
                  >
                    {Array.isArray(payouttatusChange) &&
                      payouttatusChange.find((status) => status.id === item.id)
                      ? payouttatusChange.find(
                        (status) => status.id === item.id
                      ).status
                      : item.status}
                  </div>

                  {(Array.isArray(payouttatusChange) &&
                    payouttatusChange.find((status) => status.id === item.id)
                    ? ["Pending", "Awaited"].includes(
                      payouttatusChange.find(
                        (status) => status.id === item.id
                      ).status
                    )
                    : ["Pending", "Awaited"].includes(item.status)) && (
                      <CountdownTimerPayout
                        item={item}
                        filteredData={filteredData}
                        setpayouttatusChange={setpayouttatusChange}
                      />
                    )}
                </td>

                <td className="flex-1 p-4 ">
                  <div className="flex items-center gap-2">
                    <ActionButton
                      id={{
                        id: item.id,
                        status: "Success",
                        title: "Approve",
                      }}
                      setAction={setPayoutStatusChangeModalOpen}
                      title={"Approve"}
                      icon={<FaCheck />}
                      bgColor={"bg-green-500 hover:bg-green-800"}
                    />

                    <ActionButton
                      id={item}
                      setAction={setPayoutExtraData}
                      title="View Extra Data "
                      icon={<FaRegEye />}
                      bgColor={"bg-blue-500 hover:bg-blue-800"}
                    />
                    <ActionButton
                      id={{
                        id: item.id,
                        status: item.status,
                        btnText: "Reset",
                        iconColor: "text-blue-500",
                        icon: <GrRotateLeft size={40} />,
                        bgColor: "bg-blue-500",
                        btnColor: "bg-blue-500 hover:bg-blue-800",
                        cancelBgColor:
                          "text-gray-700 bg-gray-100 hover:bg-gray-200",
                        title: (
                          <>
                            Are you sure? <br />
                            You want to reset this payout?
                          </>
                        ),
                      }}
                      setAction={setRefund}
                      title={"Reset"}
                      icon={<GrRotateLeft />}
                      bgColor="bg-teal-500 hover:bg-teal-800"
                    />
                    <ActionButton
                      id={{ id: item.id, status: "Failed", title: "Failed" }}
                      setAction={setPayoutStatusChangeModalOpen}
                      title={"Failed"}
                      icon={<FaExclamationTriangle />}
                      bgColor={"bg-orange-600 hover:bg-orange-800"}
                    />
                    <ActionButton
                      id={item.id}
                      setAction={setPayoutDelete}
                      title={"Delete"}
                      icon={<MdDelete />}
                      bgColor={"bg-red-500 hover:bg-red-800"}
                    />
                  </div>
                </td>
                <PayoutStatusChange
                  setPayoutStatusChangeModalOpen={
                    setPayoutStatusChangeModalOpen
                  }
                  payoutStatusChangeModalOpen={payoutStatusChangeModalOpen}
                  setPayoutStatus={setPayoutStatus}
                  setData={setData}
                />
              </tr>
            ))}
        </Table>

        {/* table code start  */}

        {/* table footer code start  */}
        <TableFooter
          totalItems={total?.totalItems || 0}
          perPage={ItemsPerPage}
          setPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={total?.totalPage || 0}
        />
        <ResetBalance
          approveModal={refund}
          setApproveModal={setRefund}
          setData={setData}

        />
        <ShowExtraData
          setPayoutExtraData={setPayoutExtraData}
          payoutExtraData={payoutExtraData}
        />
        <DeleteItem
          deleteItem={payoutDelete}
          setDeleteItem={setPayoutDelete}
          handleDeleteItem={handleDeleteMerchant}
          loading={loadingDelete}
          text={"Payout"}
        />
        {/* table footer code end  */}
      </div>
    </section>
  );
}

export default MerchantPayout;

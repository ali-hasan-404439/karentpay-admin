import React, { useContext, useEffect, useState } from "react";

import TitleDynamic from "../../TitleDynamic";
import TransectionCard from "./TransectionCard";
import NoData from "./NoData";
import FilterStatus from "../../components/FilterStatus";

//  import time formate package
import axios from "axios";
import Cookies from "js-cookie";
import DatePickers from "../../components/DatePickers";
import Table from "../../components/Table";
import SearchFilterData from "../../components/SearchFilterData";
import TableFooter from "../../components/TableFooter";
import { useLocation } from "react-router-dom";
import { contextAuth } from "../../pages/ContextProvider";
import { FaFileExport, FaSpinner } from "react-icons/fa6";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { TextCopy } from "../../components/Textcopy";

function ReportsCashIn() {
  const headers = [
    "Sl",
    "Date",
    "Merchant Details",
    "Sender Info",
    "Wallet Info",
    "Amount",
    "Trx / Reference ID",
    "Status",
  ];
  const { merchantAll } = useContext(contextAuth);

  const [showMerchantList, setShowMerchantList] = useState(false);
  const [searchMerchantName, setSearchMerchantName] = useState("");
  const [searchMerchantNumber, setSearchMerchantNumber] = useState("");

  const [showCashInMethod, setShowCashInMethod] = useState(false);
  const [searchCashInMethod, setSearchCashInMethod] = useState("");

  const [startEndDate, setStartEndDate] = useState({});

  const token = Cookies.get("token");

  const [loading, setLoading] = useState(false);
  const [selectSingleUser, setSelectSingleUser] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);
  const [loadingExport, setLoadingExport] = useState(false);

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

  const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
  const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");

  useEffect(() => {
    getSelectUser();
  }, [
    searchMerchantName,
    currentPage,
  ]);
  const getSelectUser = async () => {
    if (!searchMerchantName?.id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/merchant/history/cash-in/${searchMerchantName?.id}` +
        `?start_date=${startDate}&end_date=${endDate}&page=${currentPage}&per_page=${ItemsPerPage}&payment_method=${searchCashInMethod?.charAt(0).toLowerCase() + searchCashInMethod.slice(1)}&payment_type=Auto`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (response?.data?.status === 200) {
        setSelectSingleUser(response?.data.data);
      }
    } catch (error) {
      // console.error("Error managing payment: ", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    getSelectUser();
  }, [ItemsPerPage, startEndDate, searchCashInMethod]);

  const totalPages = Math.ceil(selectSingleUser.total / ItemsPerPage);

  // filter by merchant number
  const filterMerchantUser = merchantAll?.filter((item) =>
    item?.name?.toLowerCase().includes(searchMerchantNumber?.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest("#setShowMerchantList")) {
        setShowMerchantList(false);
      }
    };
    const handleClickOutsideMethod = (event) => {
      if (!event.target.closest("#setShowCashInMethod")) {
        setShowCashInMethod(false);
      }
    };

    window.document.addEventListener("click", handleClickOutsideOperator);
    window.document.addEventListener("click", handleClickOutsideMethod);

    return () => {
      window.document.removeEventListener("click", handleClickOutsideOperator);
      window.document.removeEventListener("click", handleClickOutsideMethod);
    };
  }, []);

  const handleExportReportCashIn = async () => {
    if (searchMerchantName === '') return toast.error("Please select merchant");

    const localTimezone = moment.tz.guess();
    const localTime = moment().tz(localTimezone).format("YYYY-MM-DD HH:mm:ss");
    const date = new Date(localTime);
    setLoadingExport(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/merchant/export/cash-in/${searchMerchantName?.id}` +
        `?start_date=${startDate}&end_date=${endDate}&payment_method=${searchCashInMethod?.charAt(0).toLowerCase() + searchCashInMethod.slice(1)}&payment_type=Auto`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const fileType = response.headers["content-type"];
      let fileExtension = "";

      if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        fileExtension = ".xlsx";
      } else if (fileType === "application/zip") {
        fileExtension = ".zip";
      }

      if (fileExtension) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Cash In Auto ${searchCashInMethod} Report - ${date.toISOString()}${fileExtension}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // toast.error("Unsupported file type. Unable to download the report.");
      }
    } catch (error) {
      // console.error("Error exporting report: ", error.message);
    }
    setLoadingExport(false);
  };

  return (
    <section className="space-y-5">
      <TitleDynamic title="Cash In Reports" />
      <div className="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-2 px-6 pt-6">
        <div className="w-full flex items-center flex-wrap gap-2">
          <SearchFilterData
            dropdownManu={showMerchantList}
            setDropdownManu={setShowMerchantList}
            showData={searchMerchantName?.name}
            setShowData={setSearchMerchantName}
            placeholderText="All Merchant..."
            id="setShowMerchantList"
          >
            <input
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSearchMerchantNumber(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-900 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-none"
              placeholder="Search Merchant..."
            />

            {/* Country List */}
            {filterMerchantUser.length > 0 ? (
              filterMerchantUser.map((item, index) => (
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


          <FilterStatus
            showMerchantStatus={showCashInMethod}
            setShowMerchantStatus={setShowCashInMethod}
            setSearchMerchantStatus={setSearchCashInMethod}
            searchMerchantStatus={searchCashInMethod}
            id="setShowCashInMethod"
            placeholderText="Auto Method..."
          >
            {['Bkash', 'Nagad']?.map((item, index) => (
              <div
                key={index}
                className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                onClick={() => setSearchCashInMethod(item)}
              >
                <span> {item}</span>
              </div>
            ))}
          </FilterStatus>
        </div>
        <DatePickers
          setStartEndDate={setStartEndDate}
          startEndDate={startEndDate}
        />
        <div className="w-full md:w-auto">
          <button onClick={handleExportReportCashIn} disabled={loadingExport} className="button_gradient flex items-start gap-3 w-full md:w-auto">  {loadingExport ? (
            <>
              <FaSpinner className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <FaFileExport />
              Export
            </>
          )}
          </button>
        </div>
      </div>
      {searchMerchantName && selectSingleUser ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3  xl:grid-cols-5 gap-5  px-6">
            {[
              {
                transaction: selectSingleUser?.reports?.dailyTransaction,
                transactionCount: selectSingleUser?.reports?.dailyTransactionCount,
                title: "Today Cash In",
              },
              {
                transaction: selectSingleUser?.reports?.weeklyTransaction,
                transactionCount: selectSingleUser?.reports?.weeklyTransactionCount,
                title: "Weekly Cash In",
              },
              {
                transaction: selectSingleUser?.reports?.monthlyTransaction,
                transactionCount: selectSingleUser?.reports?.monthlyTransactionCount,
                title: "Monthly Cash In",
              },
              {
                transaction: selectSingleUser?.reports?.allTransaction,
                transactionCount: selectSingleUser?.reports?.allTransactionCount,
                title: "All Cash In",
              },
              {
                transaction: selectSingleUser?.reports?.filtered_Transaction,
                transactionCount: selectSingleUser?.reports?.filtered_count,
                title: "Filtered Cash In",
              },
            ].map((item, index) => (
              <TransectionCard
                key={index}
                transaction={item.transaction}
                transactionCount={item.transactionCount}
                title={item.title}
                loading={loading}
              />
            ))}
          </div>

          {/* To display data in a table format  */}
          <Table headers={headers}>
            {loading ? Array(10)
              .fill(0)
              .map((_, index) => (
                <tr key={index} className="table_tr ">
                  <td className="px-4 pl-6 w-[50px]">
                    <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4 w-[140px]">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="cursor-pointer flex items-center p-1 bg-gray-300 dark:bg-gray-700 animate-pulse rounded w-full h-8"></div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>
                </tr>
              )) : selectSingleUser?.deposits?.map((item, index) => (
                <tr key={index} className="table_tr">
                  <td className="px-4 pl-6 w-[50px]">
                    <h2>
                      {selectSingleUser?.total -
                        ((currentPage - 1) * ItemsPerPage + index)}
                    </h2>
                  </td>
                  <td className="p-4 w-[140px]">
                    {item.created_at
                      ? moment(item.created_at).format("DD MMM YYYY")
                      : ""}
                    <br />
                    {item.created_at
                      ? moment(item.created_at).format("h:mm a")
                      : ""}
                  </td>
                  <td className="p-4">
                    <div className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold">
                      {item?.users?.name} <br /> {item?.users?.phone}
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <h2 className="w-[150px]">
                      {item.customerMsisdn
                        ? item.customerMsisdn
                        : item.payment_method?.includes("manual") &&
                          item.manual?.payment_fields
                          ? (() => {
                            let paymentFields = {};
                            try {
                              paymentFields =
                                typeof item.manual.payment_fields === "string"
                                  ? JSON.parse(item.manual.payment_fields)
                                  : item.manual.payment_fields;
                            } catch (error) {
                            }
                            return (
                              <div>
                                {Object.entries(paymentFields).map(
                                  ([key, value], index) =>
                                    key === "TrxId" ? (
                                      ""
                                    ) : (
                                      <p key={index}>
                                        {key.length > 7 ? key.slice(0, 7) : key} :
                                        {value}
                                      </p>
                                    )
                                )}
                              </div>
                            );
                          })()
                          : ""}
                    </h2>
                  </td>
                  <td className="p-4">
                    {item?.currency} <br />
                    {item.payment_method.charAt(0).toUpperCase() +
                      item.payment_method.slice(1).toLowerCase()}<br />
                    {item.merchant_number && item.merchant_number}
                  </td>
                  <td className="p-4">{item.amount}</td>
                  <td className="p-4">
                    {item?.trxID && <TextCopy text={item.trxID} fontSize="font-bold" />}
                    {item?.reference && <TextCopy text={item.reference} />}
                  </td>
                  <td className="p-4 ">
                    <span
                      className={`px-2 py-0.5 rounded border border-dotted flex items-center cursor-pointer gap-2 w-fit ${{
                        Success:
                          "bg-green-600 hover:bg-green-800 text-white border-green-800",
                        Pending:
                          "bg-[#ff7654] hover:bg-[#da5737] text-white border-[#ff7654]",
                        Failed:
                          "bg-red-600 hover:bg-red-800 text-white border-red-800",
                        Rejected:
                          "bg-[#ff1d1d] hover:bg-[#d63737] text-white border-[#ff1d1d]",
                        Completed:
                          "bg-green-600 hover:bg-green-800 text-white border-green-800",
                      }[item.transactionStatus] ||
                        "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400"
                        }`}
                    >
                      {item.transactionStatus}
                    </span>
                  </td>
                </tr>
              ))}
          </Table>
          {/* To display data in a table format  */}

          {/* table footer code  */}
          <TableFooter
            totalItems={selectSingleUser?.deposits?.length || 0}
            currentPage={currentPage}
            perPage={ItemsPerPage}
            setPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPages || 0}
          />
          {/* table footer code  */}
        </>
      ) : (
        <NoData title="Please select a merchant" />
      )}
    </section>
  );
}

export default ReportsCashIn;

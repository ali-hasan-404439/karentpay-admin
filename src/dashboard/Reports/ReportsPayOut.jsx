import React, { use, useContext, useEffect, useState } from "react";
import TitleDynamic from "../../TitleDynamic";
import TransectionCard from "./TransectionCard";
import NoData from "./NoData";

//  import time formate package
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import Table from "../../components/Table";
import DatePickers from "../../components/DatePickers";
import SearchFilterData from "../../components/SearchFilterData";
import TableFooter from "../../components/TableFooter";
import { useLocation } from "react-router-dom";
import { contextAuth } from "../../pages/ContextProvider";
import FilterStatus from "../../components/FilterStatus";
import { FaFileExport, FaSpinner } from "react-icons/fa6";
import { TextCopy } from "../../components/Textcopy";

function ReportsPayOut() {
  const headers = [
    "Sl",
    "Date",
    "Merchant Details",
    "Sender Info",
    "Payment Info",
    "Amount",
    "Last Balance",
    "Trx / Reference ID",
    "Status",
  ];
  const { merchantAll } = useContext(contextAuth);
  const [showMerchantList, setShowMerchantList] = useState(false);
  const [searchMerchantName, setSearchMerchantName] = useState("");
  const [searchMerchantNumber, setSearchMerchantNumber] = useState("");

  const [showPayoutMethod, setShowPayoutMethod] = useState(false);
  const [searchPayoutMethod, setSearchPayoutMethod] = useState("");

  const [startEndDate, setStartEndDate] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const [selectSingleUser, setSelectSingleUser] = useState({});

  const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
  const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");
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

  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    getSelectUser();
  }, [currentPage]);
  const getSelectUser = async () => {
    if (!searchMerchantName?.id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/merchant/filter/payouts/${searchMerchantName?.id
        }?start_date=${startDate}&end_date=${endDate}&page=${currentPage}&per_page=${ItemsPerPage}&payment_method=${searchPayoutMethod}`,
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
  }, [ItemsPerPage, startEndDate, searchPayoutMethod, searchMerchantName]);
  // filter by merchant number
  const filterMerchantUser = merchantAll?.filter((item) =>
    item?.name?.toLowerCase().includes(searchMerchantNumber?.toLowerCase())
  );
  const totalPages = Math.ceil(selectSingleUser.total / ItemsPerPage);
  // console.log(selectSingleUser, "selectSingleUser");
  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest("#setShowMerchantList")) {
        setShowMerchantList(false);
      }
    };
    const handleClickOutsideMethod = (event) => {
      if (!event.target.closest("#setShowPayoutMethod")) {
        setShowPayoutMethod(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideOperator);
    window.document.addEventListener("click", handleClickOutsideMethod);
    return () => {
      window.document.removeEventListener("click", handleClickOutsideOperator);
      window.document.removeEventListener("click", handleClickOutsideMethod);
    };
  }, []);



  const handleExportReportPayout = async () => {
    if (searchMerchantName === '') return toast.error("Please select merchant");
    setLoadingExport(true);
    try {
      const localTimezone = moment.tz.guess();
      const localTime = moment().tz(localTimezone).format("YYYY-MM-DD HH:mm:ss");
      const date = new Date(localTime);
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/merchant/export/payout/${searchMerchantName?.id
        }?start_date=${startDate}&end_date=${endDate}&payment_method=${searchPayoutMethod}`,
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
        link.setAttribute("download", `Pay Out ${searchPayoutMethod} Report - ${date.toISOString()}${fileExtension}`);
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
      <TitleDynamic title="Pay Out Reports" />
      <div className="w-full flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 px-6 pt-6">
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
            showMerchantStatus={showPayoutMethod}
            setShowMerchantStatus={setShowPayoutMethod}
            setSearchMerchantStatus={setSearchPayoutMethod}
            searchMerchantStatus={searchPayoutMethod}
            id="setShowPayoutMethod"
            placeholderText="Payout Method..."
          >
            {['Bkash', 'Nagad']?.map((item, index) => (
              <div
                key={index}
                className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                onClick={() => setSearchPayoutMethod(item)}
              >
                <span> {item}</span>
              </div>
            ))}
          </FilterStatus>
        </div>
        {/* Filter merchant number code end  */}
        <DatePickers
          setStartEndDate={setStartEndDate}
          startEndDate={startEndDate}
        />
        <div className="w-full md:w-auto">
          <button onClick={handleExportReportPayout} disabled={loadingExport} className="button_gradient flex items-start gap-3 w-full md:w-auto">  {loadingExport ? (
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
          {/* Transaction Cards */}
          <div className="grid grid-cols-2 gap-5 px-6 lg:grid-cols-2 xl:grid-cols-5">
            {[
              {
                transaction: selectSingleUser.reports?.dailyPayouts,
                transactionCount: selectSingleUser.reports?.dailyPayoutsCount,
                title: "Today payout",
              },
              {
                transaction: selectSingleUser.reports?.weeklyPayouts,
                transactionCount: selectSingleUser.reports?.weeklyPayoutsCount,
                title: "Weekly payout",
              },
              {
                transaction: selectSingleUser.reports?.monthlyPayouts,
                transactionCount: selectSingleUser.reports?.monthlyPayoutsCount,
                title: "Monthly payout",
              },
              {
                transaction: selectSingleUser.reports?.allPayouts,
                transactionCount: selectSingleUser.reports?.allPayoutsCount,
                title: "All payout",
              },
              {
                transaction: selectSingleUser.reports?.filtered_Transaction,
                transactionCount: selectSingleUser.reports?.filtered_count,
                title: "Filtered payout",
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

          {/* Table */}
          <Table headers={headers}>
            {loading ? Array(10)
              .fill(0)
              .map((_, index) => (
                <tr key={index} className="table_tr">
                  <td className="py-4 pl-6 w-[50px]">
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-8 animate-pulse"></div>
                  </td>
                  <td className="p-4 w-[150px]">
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-24 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-16 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-6 bg-gray-300 rounded dark:bg-gray-600 w-32 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-20 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-12 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-16 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-16 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-16 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-24 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-6 bg-gray-300 rounded dark:bg-gray-600 w-16 animate-pulse"></div>
                  </td>
                </tr>
              )) : selectSingleUser.deposits?.map((item, index) => (
                <tr key={index} className="table_tr">
                  <td className="py-4 pl-6 w-[50px]">
                    <h2>
                      {selectSingleUser?.total -
                        ((currentPage - 1) * ItemsPerPage + index)}
                    </h2>
                  </td>
                  <td className="p-4 w-[150px]">
                    {item.created_at
                      ? moment(item.created_at).format("DD MMM YYYY")
                      : "--"}
                    <br />
                    {item.created_at
                      ? moment(item.created_at).format("h : mm a")
                      : "--"}
                  </td>
                  <td className="p-4">
                    <div className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold">
                      {item?.users?.name && <>{item?.users?.name}<br /></>}  {item?.users?.phone}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-blue-700">
                    {item?.sender}
                  </td>
                  <td className="p-4">
                    {item.currency && <>{item.currency}<br /></>}
                    {item.payment_method && <>{item.payment_method.charAt(0).toUpperCase() +
                      item.payment_method.slice(1).toLowerCase()}<br /></>}
                    {item.withdraw_number}
                  </td>
                  <td className="p-4">{item.amount}</td>
                  <td className="p-4">{item?.last_balance || 0}</td>
                  <td className="p-4">
                    {item?.trxID && <TextCopy text={item.trxID} fontSize="font-bold" />}
                    {item?.reference && <TextCopy text={item.reference} />}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded border border-dotted flex items-center cursor-pointer gap-2 w-fit ${{
                        Success:
                          "bg-green-600 hover:bg-green-800 text-white border-green-800",
                        Inactive:
                          "bg-[#ff7654] hover:bg-[#da5737] text-white border-[#ff7654]",
                      }[item.status] ||
                        "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
          </Table>

          {/* Table Footer */}
          <TableFooter
            totalItems={selectSingleUser?.total || 0}
            currentPage={currentPage}
            perPage={ItemsPerPage}
            setPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPages || 0}
          />
        </>
      ) : (
        <NoData title="Please select a merchant" />
      )}
    </section>
  );
}

export default ReportsPayOut;

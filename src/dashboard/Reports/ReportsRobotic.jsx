import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";

//  import time formate package
import moment from "moment";

import TitleDynamic from "../../TitleDynamic";
import TransectionCard from "./TransectionCard";
import NoData from "./NoData";
import DatePickers from "../../components/DatePickers";
import Table from "../../components/Table";
import SearchFilterData from "../../components/SearchFilterData";
import { useLocation } from "react-router-dom";
import TableFooter from "../../components/TableFooter";
import { contextAuth } from "../../pages/ContextProvider";
import { FaFileExport, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

function ReportsRobotic() {
  const headers = [
    "Sl",
    "Date",
    "Currency",
    "Payment Method",
    "Total Amount",
    "Amount",
    "Status",
  ];

  const { merchantAll } = useContext(contextAuth);
  const [showMerchantList, setShowMerchantList] = useState(false);
  const [searchMerchantName, setSearchMerchantName] = useState("");
  const [searchMerchantNumber, setSearchMerchantNumber] = useState("");

  const [startEndDate, setStartEndDate] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const [selectSingleUser, setSelectSingleUser] = useState({});
  const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
  const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (searchMerchantName) {
      getSelectUser();
    }
  }, [searchMerchantName, startEndDate, currentPage]);
  const getSelectUser = async () => {
    if (!searchMerchantName?.id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/merchant/filter/robotics/${searchMerchantName?.id
        }?start_date=${startDate}&end_date=${endDate}&page=${currentPage}&per_page=${ItemsPerPage}`,
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
  const totalPages = Math.ceil(selectSingleUser.total / ItemsPerPage);

  const filterMerchantUser = merchantAll?.filter((item) =>
    item?.name?.toLowerCase().includes(searchMerchantNumber?.toLowerCase())
  );
  // console.log(selectSingleUser, "selectSingleUser");
  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest("#setShowMerchantList")) {
        setShowMerchantList(false);
      }
    };

    window.document.addEventListener("click", handleClickOutsideOperator);

    return () => {
      window.document.removeEventListener("click", handleClickOutsideOperator);
    };
  }, []);
  const handleExportReportRobotic = async () => {
    return toast.error("Export not working");
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

      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Pay Out Report - " + date.toISOString() + ".xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // console.error("Error exporting report: ", error.message);
    }
    setLoadingExport(false);
  };
  console.log(searchMerchantName, "searchMerchantName");
  return (
    <section className="space-y-5">
      <TitleDynamic title="Robotic Reports" />
      <div className="flex flex-wrap items-center justify-between gap-2 px-6 pt-6 w-full">
        {/* Filter merchant number code start  */}

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
        <div className="md:flex items-center gap-2 w-full md:w-auto">
          <DatePickers
            setStartEndDate={setStartEndDate}
            startEndDate={startEndDate}
          />
          <div className="w-full md:w-auto mt-2 md:mt-0">
            <button onClick={handleExportReportRobotic} disabled={loadingExport} className="button_gradient flex items-start gap-3 w-full md:w-auto">  {loadingExport ? (
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
      </div>
      {searchMerchantName && selectSingleUser ? (
        <>
          <div className="grid grid-cols-1 gap-5 px-6 md:grid-cols-3 xl:grid-cols-5">
            {[
              {
                transaction: selectSingleUser?.reports?.dailyPayouts,
                transactionCount: selectSingleUser?.reports?.dailyPayoutsCount,
                title: "Today Robotics",
              },
              {
                transaction: selectSingleUser?.reports?.weeklyPayouts,
                transactionCount: selectSingleUser?.reports?.weeklyPayoutsCount,
                title: "Weekly Robotics",
              },
              {
                transaction: selectSingleUser?.reports?.monthlyPayouts,
                transactionCount: selectSingleUser?.reports?.monthlyPayoutsCount,
                title: "Monthly Robotics",
              },
              {
                transaction: selectSingleUser?.reports?.allPayouts,
                transactionCount: selectSingleUser?.reports?.allPayoutsCount,
                title: "All Robotics",
              },
              {
                transaction: selectSingleUser?.reports?.filtered_Transaction,
                transactionCount: selectSingleUser?.reports?.filtered_count,
                title: "Filtered Robotics",
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
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-16 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-24 animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-6 bg-gray-300 rounded dark:bg-gray-600 w-16 animate-pulse"></div>
                  </td>
                </tr>
              )) : selectSingleUser?.deposits?.map((item, index) => (
                <tr key={index} className="table_tr">
                  <td className="py-4 pl-6">
                    <h2>{(currentPage - 1) * ItemsPerPage + index + 1}</h2>
                  </td>
                  <td className="p-4">
                    {item.created_at
                      ? moment(item.created_at).format("DD MMMM YYYY")
                      : "--"}
                    <br />
                    {item.created_at
                      ? moment(item.created_at).format("h:mm a")
                      : "--"}
                  </td>

                  <td className="p-4">{item?.currency}</td>
                  <td className="p-4">{item.method}</td>
                  <td className="p-4">
                    {item?.total_amount ? item?.total_amount : 0}
                  </td>
                  <td className="p-4">
                    <button className="text-white bg-blue-700 hover:bg-blue-800 rounded-[4px] px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none  flex items-center gap-1">
                      {/* <FaDollarSign /> */}
                      {item?.amount ? item?.amount : 0}
                    </button>
                  </td>

                  <td className="p-4 ">
                    <span
                      className={`px-2 py-0.5 rounded border border-dotted flex items-center cursor-pointer gap-2 w-fit ${{
                        Success: "bg-green-600 hover:bg-green-800 text-white border-green-800",
                        Pending:
                          "bg-[#ff7654] hover:bg-[#da5737] text-white border-[#ff7654]",
                        Failed: "bg-red-600 hover:bg-red-800 text-white border-red-800",
                        Rejected: "bg-[#ff1d1d] hover:bg-[#d63737] text-white border-[#ff1d1d]",
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
          {/* To display data in a table format  */}

          {/* table footer code  */}

          <TableFooter
            totalItems={selectSingleUser?.total || 0}
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

export default ReportsRobotic;

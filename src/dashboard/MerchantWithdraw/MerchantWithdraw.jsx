import { useContext, useEffect, useRef, useState } from "react";

//  react icons import
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";

// react toast npm package
import { toast } from "react-toastify";

// import component
import Auth from "../../utils/Auth";
import TitleDynamic from "../../TitleDynamic";
import SearchInputField from "../../components/SearchInputField";
import FilterStatus from "../../components/FilterStatus";

//  import time formate package
import moment from "moment";
import Table from "../../components/Table";
import DeleteItem from "../../components/DeleteItem";
import DatePickers from "../../components/DatePickers";
import SearchFilterData from "../../components/SearchFilterData";
import WithdrawApprove from "./WithdrawApprove";
import TableFooter from "../../components/TableFooter";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { IoClose } from "react-icons/io5";
import ActionButton from "../../components/ActionButton";
import { contextAuth } from "../../pages/ContextProvider";

function MerchantWithdraw() {
  const headers = [
    "Sl",
    "Date",
    "Merchant Details",
    "Payment Info",
    "Withdraw Info",
    "Amount",
    "Reason",
    "Status",
    "Action",
  ];
  const { ApiRequest } = Auth();

  const { merchantAll } = useContext(contextAuth);
  // search merchant transaction id and Reference store state
  const [searchMerchant, setSearchMerchant] = useState("");

  // filter merchant store state
  const [filterMerchant, setFilterMerchant] = useState("");
  const [showMerchantList, setShowMerchantList] = useState(false);
  const [searchMerchantName, setSearchMerchantName] = useState("");
  const [searchMerchantNumber, setSearchMerchantNumber] = useState("");

  const [showWithdrawStatus, setShowWithdrawStatus] = useState(false);
  const [searchWithdrawStatus, setSearchWithdrawStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(null);
  const [payoutApproveModalOpen, setPayoutApproveModalOpen] = useState(null);
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

  // data fetch start function
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [array, setArray] = useState([]);
  const [total, setTotal] = useState(null);

  // State variables to store start and end dates
  const [startEndDate, setStartEndDate] = useState({
    startDate: "",
    endDate: "",
  });

  const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
  const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");
  const [render, setRender] = useState(false);

  const date = new Date();
  const today = moment(date).format("YYYY-MM-DD");
  const startDates = moment(startDate);
  const todayDate = moment(today);
  const differenceInDays = todayDate.diff(startDates, "days");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
    const getWithdraw = async () => {
      const response = await ApiRequest({
        url: `/admin/merchant/get_withdraw?start_date=${differenceInDays > 0 ? startDate : ""
          }&end_date=${differenceInDays > 0 ? endDate : ""
          }&search=${searchMerchant}&number=${searchMerchantName?.phone ? searchMerchantName?.phone : ""
          }&method=${filterMerchant === "All Payment Method" ? "" : filterMerchant
          }&status=${searchWithdrawStatus}&page=${currentPage}&per_page=${ItemsPerPage}`,
        method: "get",
      });
      if (response?.status == 200) {
        setLoading(false);
        setTotal({
          totalPage: response?.data?.last_page,
          totalItems: response?.data?.total,
        });
        setArray(response.data?.data);
      }
    };
    getWithdraw();
  }, [
    ItemsPerPage,
    startEndDate,
    searchMerchant,
    searchMerchantName,
    searchWithdrawStatus,
    filterMerchant,
  ]);

  useEffect(() => {
    const getWithdraw = async () => {
      setLoading(true);
      const response = await ApiRequest({
        url: `/admin/merchant/get_withdraw?start_date=${differenceInDays > 0 ? startDate : ""
          }&end_date=${differenceInDays > 0 ? endDate : ""
          }&search=${searchMerchant}&number=${searchMerchantName?.phone ? searchMerchantName?.phone : ""
          }&method=${filterMerchant === "All Payment Method" ? "" : filterMerchant
          }&status=${searchWithdrawStatus}&page=${currentPage}&per_page=${ItemsPerPage}`,
        method: "get",
      });
      if (response?.status == 200) {
        setLoading(false);
        setTotal({
          totalPage: response?.data?.last_page,
          totalItems: response?.data?.total,
        });
        setArray(response.data?.data);
      } else {
        setLoading(false);
        toast.error(response?.message);
      }
    };
    getWithdraw();
    setRender(false);
  }, [currentPage, render]);

  //  filter merchant method function end
  const handleDeleteItem = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/merchant/delete_withdraw/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (response?.data?.status === 403) {
        setIsModalOpen(false);
        setDeleteLoading(false);
        return toast.warn(
          "Already status changed, can not delete this withdraw."
        );
      }
      try {
        const response = await ApiRequest({
          url: `/admin/merchant/get_withdraw?page=${currentPage}&per_page=${ItemsPerPage}`,
          method: "get",
        });
        setTotal({
          totalPage: response?.data?.last_page,
          totalItems: response?.data?.total,
        });
        setArray(response.data?.data);
      } catch (error) {
        // toast.error("Failed to fetch merchant withdraw data. Please try again.");
      }
      toast.success("Merchant withdraw deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete merchant withdraw. Please try again.");
    }
    setIsModalOpen(false);
    setDeleteLoading(false);
  };

  // outlet click close the toggle function
  useEffect(() => {
    const handleClickOutsideOperator = (event) => {
      if (!event.target.closest("#handleClickOutOperator")) {
        setIsDropdownOpen(false);
      }
    };

    const handleClickOutsideSearch = (event) => {
      if (!event.target.closest("#setShowWithdrawStatus")) {
        setShowWithdrawStatus(false);
      }
    };
    const showMerchantListWithdraw = (event) => {
      if (!event.target.closest("#showMerchantList")) {
        setShowMerchantList(false);
      }
    };

    window.document.addEventListener("click", handleClickOutsideOperator);

    window.document.addEventListener("click", handleClickOutsideSearch);
    window.document.addEventListener("click", showMerchantListWithdraw);

    return () => {
      window.document.removeEventListener("click", handleClickOutsideOperator);

      window.document.removeEventListener("click", handleClickOutsideSearch);
      window.document.removeEventListener("click", showMerchantListWithdraw);
    };
  }, []);
  // outlet click close the toggle function


  // filter by merchant number
  const filterMerchantUser = merchantAll?.filter((item) =>
    item?.name?.toLowerCase().includes(searchMerchantNumber?.toLowerCase())
  );

  return (
    <section className="bg-white dark:bg-gray-900">
      <TitleDynamic title="Merchant Withdraw" />

      <div className=" boxShadow-table relative bg-white dark:bg-gray-800 rounded-[4px] mb-4">
        <div className=" justify-between items-start px-5 py-6 md:flex">
          {/*all search and filter function withdraw status start  */}

          <div className="flex flex-wrap items-center gap-1 ">
            {/* search merchant email and amount start  */}
            <SearchInputField
              searchText={searchMerchant}
              setSearchText={setSearchMerchant}
              placeholderText="Search Name, Amount"
            />
            {/* search merchant email and amount end  */}

            <SearchFilterData
              dropdownManu={showMerchantList}
              setDropdownManu={setShowMerchantList}
              showData={searchMerchantName?.name?.length > 15 ? searchMerchantName?.name.slice(0, 15) + "..." : searchMerchantName?.name}
              setShowData={setSearchMerchantName}
              placeholderText="All Merchant..."
              id="showMerchantList"
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
            {/* filter all merchant user withdraw end  */}

            {/* filter only operator start  */}
            <div className="w-full md:w-[250px] relative mt-2 lg:mt-0">
              <button
                id="handleClickOutOperator"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`bg-gray-50 border border-gray-300  ${isDropdownOpen ? "rounded-t-[4px]" : " rounded-[4px]"
                  }  w-full  p-3 dark:bg-gray-700 whitespace-nowrap dark:border-gray-600 ${filterMerchant
                    ? "text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-400"
                  } flex items-center justify-between`}
                ref={trigger}
              >
                {filterMerchant ? filterMerchant : "Payment Method..."}

                <svg
                  className={`w-[14px] h-[14px] ms-3 transition-transform transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
                {filterMerchant && (
                  <div
                    onClick={() => setFilterMerchant("")}
                    className="absolute top-[15px] right-[.5rem] w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center cursor-pointer"
                  >
                    <IoMdClose />
                  </div>
                )}
              </button>

              {isDropdownOpen && (
                <div
                  className="z-10 absolute button-0 left-0  bg-white  divide-gray-100 rounded-b-[4px] shadow w-full md:w-[250px] dark:text-white  dark:bg-gray-700 boxShadow-table"
                  ref={dropdown}
                >
                  <ul
                    className="pt-1 text-black dark:text-white"
                    aria-labelledby="dropdownHoverButton"
                  >
                    {[
                      "Bkash",
                      "Nagad",
                      "Roket",
                      "Upay",
                      "My Cash",
                      "Ok Wallet",
                    ].map((item, index, array) => (
                      <li
                        key={item}
                        onClick={() => setFilterMerchant(item)}
                        className={`block p-2 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer ${index === 0 ? "rounded-t-[4px]" : ""
                          } ${index === array.length - 1 ? "rounded-b-[4px]" : ""
                          }`}
                      >
                        <a>{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* filter all merchant user withdraw start  */}
            {/* filter withdraw status start  */}
            <FilterStatus
              setShowMerchantStatus={setShowWithdrawStatus}
              showMerchantStatus={showWithdrawStatus}
              setSearchMerchantStatus={setSearchWithdrawStatus}
              searchMerchantStatus={searchWithdrawStatus}
              id="setShowWithdrawStatus"
              placeholderText="Status..."
            >
              {["Success", "Pending", "Rejected"]?.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                  onClick={() => setSearchWithdrawStatus(item)}
                >
                  <span> {item}</span>
                </div>
              ))}
            </FilterStatus>
            {/* filter withdraw status end  */}
          </div>

          <div className="w-full 2xl:w-fit flex items-end justify-end mt-5 md:mt-0">
            <DatePickers
              setStartEndDate={setStartEndDate}
              startEndDate={startEndDate}
            />
            {/* start and end date code end  */}
          </div>
        </div>
        {/* Showing all data table code start */}

        <Table headers={headers}>
          {loading
            ? Array(10)
              .fill(null)
              .map((_, index) => (
                <tr
                  key={index}
                  data-testid="table-row-element"
                  className="table_tr"
                >
                  <td className="px-6 py-4">
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-16 rounded-md"></div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded-md mb-2"></div>
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded-md"></div>
                  </td>

                  <td className="gap-2 p-4 whitespace-nowrap">
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-32 rounded-md mb-2"></div>
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-32 rounded-md mb-2"></div>
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-32 rounded-md"></div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-16 rounded-md"></div>
                  </td>

                  <td className="p-4 whitespace-nowrap space-y-1">
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded-md"></div>
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded-md"></div>
                  </td>

                  <td className="p-4">
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded-md"></div>
                  </td>

                  <td className="p-4">
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-32 rounded-md"></div>
                  </td>

                  <td className="p-4">
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 w-32 rounded-md"></div>
                  </td>

                  <td className="flex-1 p-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-300 dark:bg-gray-600 h-6 w-6 rounded-md"></div>
                      <div className="bg-gray-300 dark:bg-gray-600 h-6 w-6 rounded-md"></div>
                      <div className="bg-gray-300 dark:bg-gray-600 h-6 w-6 rounded-md"></div>
                    </div>
                  </td>
                </tr>
              ))
            : array?.map((item, index) => (
              <tr
                key={item.id}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="px-6 py-4 w-[50px]">
                  <h2>
                    {total?.totalItems -
                      ((currentPage - 1) * ItemsPerPage + index)}
                  </h2>
                </td>

                <td className="p-4 w-[100px] whitespace-nowrap">
                  {item?.created_at && (
                    <>
                      {item.created_at
                        ? moment(item.created_at).format(" DD MMM YYYY")
                        : "--"}
                      <br />
                      {item.created_at
                        ? moment(item.created_at).format("h:mm a")
                        : "--"}
                    </>
                  )}
                </td>

                <td scope="row" className="p-4 cursor-pointer">
                  <div
                    onClick={() => setSearchMerchantName(item?.users)}
                    className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold"
                  >
                    {item?.users?.name && <>{item?.users?.name} <br /></>}
                    {item?.users?.phone}
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  {item.currency && <>{item.currency} <br /></>}
                  {item.method && <>{item.method}</>}
                </td>
                <td className="p-4  whitespace-nowrap">
                  <h2>{item.number}</h2>
                </td>

                <td className="p-4  whitespace-nowrap">{item.amount}</td>

                <td className="p-4 ">{item.note}</td>
                <td className="p-4">
                  <div
                    onClick={() => setSearchWithdrawStatus(item.status)}
                    className={`px-2 py-0.5 rounded border border-dotted flex items-center cursor-pointer gap-2 w-fit ${{
                      Success:
                        "bg-green-600 hover:bg-green-800 text-white border-green-800",
                      Approve:
                        "bg-green-600 hover:bg-green-800 text-white border-green-800",
                      Pending:
                        "bg-[#ff7654] hover:bg-[#da5737] text-white border-[#ff7654]",
                      Rejected:
                        "bg-[#ff1d1d] hover:bg-[#d63737] text-white border-[#ff1d1d]",
                    }[item.status] ||
                      "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400"
                      }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </td>
                <td className="flex-1 p-4 w-[100px]">
                  <div className="flex items-center gap-2">
                    <ActionButton
                      id={{
                        id: item.id,
                        title: "approve",
                        note: item.note,
                      }}
                      setAction={setPayoutApproveModalOpen}
                      title={"Approve"}
                      icon={<FaCheck />}
                      bgColor={"bg-green-500 hover:bg-green-800"}
                    />
                    <ActionButton
                      id={{
                        id: item.id,
                        title: "Rejected",
                        note: item.note,
                      }}
                      setAction={setPayoutApproveModalOpen}
                      title={"Rejected"}
                      icon={<IoClose />}
                      bgColor={"bg-red-500 hover:bg-red-800"}
                    />
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

        {/* table footer showing data length and pagination item code start  */}
        <TableFooter
          totalItems={total?.totalItems || 0}
          perPage={ItemsPerPage}
          setPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={total?.totalPage || 0}
        />
        {/* table footer showing data length and pagination item code end  */}

        <DeleteItem
          deleteItem={isModalOpen}
          setDeleteItem={setIsModalOpen}
          handleDeleteItem={handleDeleteItem}
          text="Withdraw"
          loading={deleteLoading}
        />
        <WithdrawApprove
          payoutApproveModalOpen={payoutApproveModalOpen}
          setPayoutApproveModalOpen={setPayoutApproveModalOpen}
          setArray={setArray}
        />
      </div>
    </section>
  );
}

export default MerchantWithdraw;

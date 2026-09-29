import TitleDynamic from "../../TitleDynamic";

import { RiDeleteBin2Fill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";

import { Link, useLocation } from "react-router-dom";

//  import time formate package
import moment from "moment";
import DeleteItem from "../../components/DeleteItem";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Table from "../../components/Table";
import SearchInputField from "../../components/SearchInputField";
import FilterStatus from "../../components/FilterStatus";
import TableFooter from "../../components/TableFooter";
import SearchFilterData from "../../components/SearchFilterData";
import ActionButton from "../../components/ActionButton";
import { MdDelete } from "react-icons/md";

moment().format();

function DashboardSupport() {
  const headers = [
    "Sl",
    "Date",
    "Ticket ID",
    "User / Merchant Info",
    "Subject",
    "Message",
    "Status",
    "Action",
  ];

  const [searchSupport, setSearchSupport] = useState("");
  const [searchShowSupport, setSearchShowSupport] = useState("");

  const [showSupportOpen, setShowSupportOpen] = useState(false);
  const [searchShowOpenAndClose, setSearchShowOpenAndClose] = useState("");
  const [searchMerchantNumber, setSearchMerchantNumber] = useState("");

  const [loadingDelete, setLoadingDelete] = useState(false);

  const [total, setTotal] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const [support, setSupport] = useState([]);
  const [loading, setLoading] = useState(false);

  const [supportDeleteModalOpen, setSupportDeleteModalOpen] = useState("");
  const [showSupport, setShowSupport] = useState(false);

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
    getSupport();
  }, [currentPage]);
  const getSupport = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST
        }/admin/tickets?per_page=${ItemsPerPage}&page=${currentPage}&status=${searchShowOpenAndClose}&name=${searchShowSupport?.name ? searchShowSupport?.name : ""
        }&search=${searchSupport}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotal({
        totalItems: response?.data?.total,
        totalPage: response?.data?.last_page,
      });
      setSupport(response.data?.data);
    } catch (err) {
      // console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    getSupport();
  }, [ItemsPerPage, searchSupport, searchShowSupport, searchShowOpenAndClose]);

  const handleDeleteSupport = async (id) => {
    setLoadingDelete(true);
    try {
      const token = Cookies.get("token");

      const res = await axios.delete(
        import.meta.env.VITE_API_HOST + "/admin/tickets/" + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/tickets?per_page=${ItemsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
        setSupport(response.data?.data);
      } catch (err) {
        // console.log(err);
      }
      toast.success("Support deleted successfully!");
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Failed to delete support. Please try again.");
      }
    }
    setLoadingDelete(false);
    setSupportDeleteModalOpen("");
  };

  // unique support email
  const uniqueSupport = Array.from(new Map(support.map(item => [item.email, item])).values());
  const filterSupport = uniqueSupport?.filter((item) =>
    item?.name?.toLowerCase().includes(searchMerchantNumber?.toLowerCase())
  );

  // outlet click close the toggle function
  useEffect(() => {
    const handleClickOutsideUsersFilter = (event) => {
      if (!event.target.closest("#showSupport")) {
        setShowSupport(false);
      }
    };
    const handleClickOutsideSearchShowOpenAndClose = (event) => {
      if (!event.target.closest("#setSearchShowOpenAndClose")) {
        setShowSupportOpen(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideUsersFilter);
    window.document.addEventListener(
      "click",
      handleClickOutsideSearchShowOpenAndClose
    );
    return () => {
      window.document.removeEventListener(
        "click",
        handleClickOutsideUsersFilter
      );
      window.document.removeEventListener(
        "click",
        handleClickOutsideSearchShowOpenAndClose
      );
    };
  }, []);

  return (
    <div className="boxShadow-table relative overflow-hidden bg-[#FFFFFF] dark:bg-gray-800 rounded-[4px] mb-5 text-black dark:text-white">
      <TitleDynamic title="Support" />
      <div className="flex flex-wrap items-center gap-2 px-5 py-6">
        <SearchInputField
          searchText={searchSupport}
          setSearchText={setSearchSupport}
          placeholderText="Search Name, Email Or Track Id "
        />

        <SearchFilterData
          dropdownManu={showSupport}
          setDropdownManu={setShowSupport}
          showData={searchShowSupport?.name}
          setShowData={setSearchShowSupport}
          placeholderText="Support..."
          id="showSupport"
        >
          <input
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSearchMerchantNumber(e.target.value)}
            className="bg-gray-50 border-gray-300 text-gray-900 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-none"
            placeholder="Search Name..."
          />

          {/* Country List */}
          {filterSupport.length > 0 ? (
            filterSupport.map((item, index) => (
              <div
                key={index}
                className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                onClick={() => {
                  setSearchShowSupport(item);
                  setSearchMerchantNumber("");
                  setShowSupport(false);
                }}
              >
                <h2>{item.name}</h2>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
              No Data Available
            </div>
          )}
        </SearchFilterData>

        <FilterStatus
          setShowMerchantStatus={setShowSupportOpen}
          showMerchantStatus={showSupportOpen}
          setSearchMerchantStatus={setSearchShowOpenAndClose}
          searchMerchantStatus={searchShowOpenAndClose}
          id="setSearchShowOpenAndClose"
          placeholderText="Status..."
        >
          {["Open", "Closed"]?.map((item, index) => (
            <div
              key={index}
              className="p-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
              onClick={() => setSearchShowOpenAndClose(item)}
            >
              <span> {item}</span>
            </div>
          ))}
        </FilterStatus>
      </div>
      <Table headers={headers}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
            <tr
              key={index}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="py-3 pl-6 pr-2 whitespace-nowrap">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
              </td>

              <td className="p-4 whitespace-nowrap">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              </td>

              <td className="p-4 whitespace-nowrap">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              </td>

              <td
                className="flex items-center gap-2 p-4 whitespace-nowrap"
                style={{ width: "300px" }}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="ml-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </td>

              <td className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
              </td>

              <td className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
              </td>

              <td className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              </td>

              <td className="p-4">
                <div className="flex items-center w-[100px] gap-2 mr-5 lg:mr-0">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                </div>
              </td>
            </tr>
          ))
          : support.map((item, index) => (
            <tr
              key={index}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="px-6 py-4 w-[50px] whitespace-nowrap">
                {total?.totalItems -
                  ((currentPage - 1) * ItemsPerPage + index)}
              </td>

              <td className="p-4 w-[150px] whitespace-nowrap">
                {item.date
                  ? moment(item.created_at).format("DD MMM YYYY")
                  : ""}
                <br />
                {item.time ? moment(item.created_at).format("h:mm a") : ""}
              </td>

              <td className="p-4 whitespace-nowrap">
                <Link to={`/support/${item.track_id}`} className="w-[80px]">
                  {item.track_id}
                </Link>
              </td>
              <td
                className=" p-4 whitespace-nowrap"
                style={{ width: "300px" }}
              >
                <div className="cursor-pointer flex gap-2 p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold">
                  <div className="flex items-center justify-center w-8 h-8 border rounded-full">
                    {item.user_avatar ? (
                      <img
                        src={item.user_avatar}
                        alt=""
                        className="rounded-full w-10 object-cover"
                      />
                    ) : (
                      <h2 className="uppercase w-10 h-10 flex items-center justify-center">
                        {item?.name.slice(0, 1)}
                      </h2>
                    )}
                  </div>
                  <Link to={`/support/${item.track_id}`}>
                    <h2>{item.name}</h2>
                    <p>{item.phone}</p>
                    <p>{item.email}</p>
                  </Link>
                </div>
              </td>
              <td className="p-4 min-w-[250px]">
                <Link
                  to={`/support/${item.track_id}`}
                  style={{ width: "150px" }}
                >
                  {item.subject.length > 100
                    ? item.subject.slice(0, 100) + "..."
                    : item.subject}
                </Link>
              </td>
              <td className="p-4 min-w-[350px]">
                <Link to={`/support/${item.track_id}`}>
                  {item.message.length > 200
                    ? item.message.slice(0, 200) + "..."
                    : item.message}
                </Link>
              </td>
              <td className="p-4">{item?.status?.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}</td>

              <td className="p-4 w-[100px] ">
                <div className="flex items-center gap-2 mr-5 lg:mr-0">
                  <Link
                    to={`/support/${item.track_id}`}
                    className="cursor-pointer"
                  >
                    <ActionButton
                      title={"View"}
                      icon={<IoEyeSharp />}
                      bgColor={"bg-blue-500 hover:bg-blue-800"}
                    />
                  </Link>
                  <ActionButton
                    title={"Delete"}
                    id={item.id}
                    setAction={setSupportDeleteModalOpen}
                    icon={<MdDelete />}
                    bgColor={"bg-red-500 hover:bg-red-800"}
                  />
                </div>
              </td>
            </tr>
          ))}
      </Table>

      <TableFooter
        totalItems={total?.totalItems || 0}
        perPage={ItemsPerPage}
        setPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={total?.totalPage || 0}
      />

      <DeleteItem
        deleteItem={supportDeleteModalOpen}
        setDeleteItem={setSupportDeleteModalOpen}
        handleDeleteItem={handleDeleteSupport}
        text="support"
        loading={loadingDelete}
      />
    </div>
  );
}

export default DashboardSupport;

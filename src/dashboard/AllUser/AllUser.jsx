import { useEffect, useState } from "react";

//  react icons import
import { FaEllipsis } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa";

// react toast npm package
import { toast } from "react-toastify";

// import component
import DashboardEditUser from "./DashboardEditUser";
import Auth from "../../utils/Auth";
import TitleDynamic from "../../TitleDynamic";
import SearchInputField from "../../components/SearchInputField";

//  import time formate package
import moment from "moment";
import Table from "../../components/Table";
import DeleteItem from "../../components/DeleteItem";
import { useLocation } from "react-router-dom";
import TableFooter from "../../components/TableFooter";
import { MdDelete } from "react-icons/md";
import ActionButton from "../../components/ActionButton";
import { CiEdit } from "react-icons/ci";

function AllUser() {
  const headers = [
    "Sl",
    "Date",
    "User Details",
    "Country",
    "User Roll",
    "Balance",
    "Active",
    "Action",
  ];
  const { ApiRequest } = Auth();
  const [searchText, setSearchText] = useState("");

  // edit user model state
  const [modalOpen, setModalOpen] = useState(false);

  const [array, setArray] = useState([]);

  const [render, setRender] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemLoading, setDeleteItemLoading] = useState(false);
  const [searchMerchantName, setSearchMerchantName] = useState("");
  const [showMerchantList, setShowMerchantList] = useState("");

  const [total, setTotal] = useState({});
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

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getUser();
  }, [currentPage]);
  const getUser = async () => {
    setLoading(true);
    try {
      const response = await ApiRequest({
        url: `/admin/all_users/user?per_page=${ItemsPerPage}&page=${currentPage}&search=${searchText}&name=${searchMerchantName}`,
        method: "get",
      });
      setArray(response.data.data);
      setTotal({
        totalItems: response?.data?.total,
        totalPage: response?.data?.last_page,
      });
    } catch (error) {
      toast.error(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    setCurrentPage(1);
    const getUser = async () => {
      try {
        const response = await ApiRequest({
          url: `/admin/all_users/user?per_page=${ItemsPerPage}&page=${currentPage}&search=${searchText}&name=${searchMerchantName}`,
          method: "get",
        });
        setArray(response.data.data);
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
      } catch (error) {
        toast.error(error);
      }
    };
    getUser();
  }, [searchText, searchMerchantName, ItemsPerPage]);


  const setChecked = async (e, id) => {
    try {
      const response = await ApiRequest({
        url: "/admin/merchant",
        method: "put",
        formdata: { id, checked: e === true ? 1 : 0 },
      });
      setArray((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, active: e === true ? 1 : 0 || item }
            : item
        )
      );
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error("Failed to update. Please try again.");
    }
  };

  // outlet click close the toggle function
  useEffect(() => {
    const handleClickOutsideMerchantList = (event) => {
      if (!event.target.closest("#showMerchantList")) {
        setShowMerchantList(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideMerchantList);

    return () => {
      window.document.addEventListener("click", handleClickOutsideMerchantList);
    };
  }, []);

  // handle delete withdraw function
  const handleDeleteUser = async (id) => {
    setDeleteItemLoading(true);
    try {
      const response = await ApiRequest({
        url: `/admin/user_delete/${id}`,
        method: "delete",
      });
      toast.success("User deleted successfully!");
      try {
        const response = await ApiRequest({
          url: `/admin/all_users/user?per_page=${ItemsPerPage}&page=${currentPage}`,
          method: "get",
        });
        setArray(response.data.data);
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
      } catch (error) {
        // toast.error(error);
      }
    } catch (error) {
      toast.error("Failed to delete user. Please try again.");
    }
    setDeleteModalOpen(false);
    setDeleteItemLoading(false);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 ">
      <TitleDynamic title="All User" />

      <div className="boxShadow-table relative  bg-white dark:bg-gray-800 rounded-[4px] mb-4">
        {/* search function code start  */}
        <div className="flex items-center gap-2 flex-wrap relative py-6 px-5">
          {/* Search Name Email Phone And Balance code start  */}
          <SearchInputField
            searchText={searchText}
            setSearchText={setSearchText}
            placeholderText="Search Email Phone And Balance"
          />
        </div>
        {/* search function code start  */}

        {/* show the all data in the table format code start  */}
        <Table headers={headers}>
          {loading
            ? Array.from({ length: ItemsPerPage }).map((_, index) => (
              <tr
                key={index}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="px-4 py-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-300 dark:bg-gray-700 rounded mt-1 animate-pulse"></div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="w-32 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
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
                <td className="px-6 w-[50px] py-4">
                  {total?.totalItems -
                    ((currentPage - 1) * ItemsPerPage + index)}
                </td>

                <td className="p-4 w-[120px] whitespace-nowrap">
                  {item?.created_at && (
                    <>
                      {item.created_at && moment(item.created_at).format(" DD MMM YYYY")}
                      <br />
                      {item.created_at && moment(item.created_at).format("h:mm a")}
                    </>
                  )}
                </td>
                <td className="p-4 cursor-pointer w-[300px] ">
                  <div
                    onClick={() => setSearchText(item?.email)}
                    className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold"
                  >
                    {item.name} <br />
                    {item.phone}
                    <br />
                    {item.email}
                  </div>
                </td>

                <td className="p-4 ">{item.country_name}</td>
                <td className="p-4">
                  <span
                    className={`bg-primary-100 text-primary-800  px-2 py-2.5 rounded bg-blue-100  dark:bg-[#374151] dark:text-primary-300 flex items-center gap-2 w-[150px] ${item.role == 2
                      ? "bg-red-50"
                      : item.role == 3
                        ? "bg-green-50"
                        : item.role == 1
                          ? "bg-red-50"
                          : "bg-blue-50"
                      }`}
                  >
                    <div
                      className={`inline-block w-3 h-3 rounded-full ${item.role == 2
                        ? "bg-red-700"
                        : item.role == 3
                          ? "bg-green-700"
                          : item.role == 1
                            ? "bg-red-500"
                            : "bg-blue-700"
                        }`}
                    ></div>
                    {item?.role == 2
                      ? "Administrator"
                      : item?.role == 3
                        ? "Moderator"
                        : item?.role == 1
                          ? "Super Admin"
                          : "User"}
                  </span>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300  rounded-[4px]  px-3 py-[2px] dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex items-center gap-1">
                    <FaDollarSign />
                    {item?.balance}
                  </button>
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
                      checked={item.active == 1 ? true : false}
                      onChange={(e) => {
                        setChecked(e.target.checked, item.id);
                      }}
                    />
                    <span
                      className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                    ></span>
                  </label>
                </td>
                <td
                  className="relative p-4 w-[100px]"
                  id="openRightEditModelAll"
                >
                  <div className="flex items-center gap-2 ">
                    <ActionButton
                      id={item}
                      setAction={setModalOpen}
                      title={"Edit"}
                      icon={<CiEdit />}
                      bgColor={"bg-green-500 hover:bg-green-800"}
                    />
                    <ActionButton
                      id={item.id}
                      setAction={setDeleteModalOpen}
                      title={"Delete"}
                      icon={<MdDelete />}
                      bgColor={"bg-red-500 hover:bg-red-800"}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </Table>

        {/* table footer code and pagination code start  */}
        <TableFooter
          totalItems={total?.totalItems || 0}
          perPage={ItemsPerPage}
          setPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={total?.totalPage || 0}
        />


        <DashboardEditUser
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          setArray={setArray}
        />
        <DeleteItem
          deleteItem={deleteModalOpen}
          setDeleteItem={setDeleteModalOpen}
          handleDeleteItem={handleDeleteUser}
          text="User"
          loading={deleteItemLoading}
        />
      </div>
    </section>
  );
}

export default AllUser;

import { useContext, useEffect, useState } from "react";

// import react icons
import { FaEllipsis } from "react-icons/fa6";

// import react toast
import { toast } from "react-toastify";

// import component
import Auth from "../../utils/Auth";
import TitleDynamic from "../../TitleDynamic";
import AllMerchantEdit from "./AllMerchantEdit";
import ManagePaymentMerchant from "./ManagePaymentMerchant";
import SearchInputField from "../../components/SearchInputField";

//  import time formate package
import moment from "moment";

import { useLocation } from "react-router-dom";
import AllowedIP from "../AllowedIP/AllowedIP";
import DeleteItem from "../../components/DeleteItem";
import Table from "../../components/Table";
import TableFooter from "../../components/TableFooter";
import SearchFilterData from "../../components/SearchFilterData";
import { contextAuth } from "../../pages/ContextProvider";

function AllMerchant() {
  const headers = [
    "Sl",
    "Date",
    "Merchant Details",
    "Total Cash In",
    "Total Link Balance",
    "Automation Balance",
    "Withdrawal Balance",
    "Main Balance",
    "User Login",
    "Active",
    "Action",
  ];
  const { ApiRequest } = Auth();
  const { merchantAll } = useContext(contextAuth);

  const { logoAndIdentityData } = useContext(contextAuth)

  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const [managePayment, setManagePayment] = useState(null);
  const [allowedIp, setAllowedIP] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [openRightEdit, setOpenRightEdit] = useState(false);
  const [deleteItemLoading, setDeleteItemLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [merchant, setMerchant] = useState([]);

  const [total, setTotal] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const [searchMerchantName, setSearchMerchantName] = useState(null);
  const [searchMerchantNumber, setSearchMerchantNumber] = useState("");
  const [showMerchantList, setShowMerchantList] = useState(false);

  // edit user model state
  const [modalOpen, setModalOpen] = useState(false);

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

  const setChecked = async (e, id) => {
    try {
      const response = await ApiRequest({
        url: "/admin/merchant",
        method: "put",
        formdata: { id, checked: e },
      });
      setMerchant((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, active: e === true ? 1 : 0 };
          }
          return item;
        })
      );
      toast.success('Merchant status updated successfully');
    } catch (error) {
      toast.error("Failed to update. Please try again.");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    const LoadMerchant = async () => {
      const response = await ApiRequest({
        url: `/admin/merchant?search=${searchText}&name=${searchMerchantName?.name ? searchMerchantName?.name : ""
          }&page=${currentPage}&per_page=${ItemsPerPage}`,
        method: "get",
      });
      if (response?.status === 200) {
        if (response.data) {
          const merchantData = response.data.data.filter(
            (item) => item.merchant !== null
          );
          setTotal({
            totalItems: response.data?.total,
            totalPage: response.data?.last_page,
          });
          setMerchant(merchantData);
        }
      }
    };
    LoadMerchant();
  }, [searchText, searchMerchantName, ItemsPerPage]);

  const LoadMerchant = async () => {
    setLoading(true);
    const response = await ApiRequest({
      url: `/admin/merchant?search=${searchText}&name=${searchMerchantName?.name ? searchMerchantName?.name : ""
        }&page=${currentPage}&per_page=${ItemsPerPage}`,
      method: "get",
    });
    if (response?.status === 200) {
      setLoading(false);
      if (response.data) {
        const merchantData = response.data.data.filter(
          (item) => item.merchant !== null
        );
        setTotal({
          totalItems: response.data?.total,
          totalPage: response.data?.last_page,
        });
        setMerchant(merchantData);
      }
    } else {
      setLoading(false);
      toast.error(response?.message);
    }
  };
  useEffect(() => {
    LoadMerchant();
  }, [currentPage]);

  const calculatePosition = (item, last) => {
    const index = last.find((index) => index.id === item.id);
    return index;
  };

  // outlet click close the toggle function
  useEffect(() => {
    const handleClickOutsideUsersFilter = (event) => {
      if (!event.target.closest("#showMerchantList")) {
        setShowMerchantList(false);
      }
    };
    const handleClickOutsideRightEdit = (event) => {
      if (!event.target.closest("#openRightEditModel")) {
        setOpenRightEdit(false);
      }
    };

    window.document.addEventListener("click", handleClickOutsideUsersFilter);
    window.document.addEventListener("click", handleClickOutsideRightEdit);

    return () => {
      window.document.removeEventListener(
        "click",
        handleClickOutsideUsersFilter
      );
      window.document.removeEventListener("click", handleClickOutsideRightEdit);
    };
  }, []);

  const toggleDropdown = (id) => {
    setOpenRightEdit(false);
    setIsDropdownOpen("");

    if (id) {
      setOpenRightEdit(true);
      setIsDropdownOpen(id);
    }
  };

  const toggleModal = async (id) => {
    setOpenRightEdit(false);
    setModalOpen(id);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleManagePayment = (id) => {
    setOpenRightEdit(false);
    setManagePayment(id);
  };
  const handleAllowedIP = (id) => {
    setOpenRightEdit(false);
    setAllowedIP(id);
  };

  const handleDeleteItem = async (id) => {
    setDeleteItemLoading(true);
    const response = await ApiRequest({
      url: `/admin/user_delete/${id}`,
      method: "delete",
    });
    if (response?.status === 200) {
      toast.success("User deleted successfully!");
      setDeleteModalOpen(false);

      setMerchant((prev) => prev.filter((item) => item.id !== id));
    } else {
      toast.error("Failed to delete user. Please try again.");
    }
    setDeleteModalOpen(false);
    setDeleteItemLoading(true);
  };

  // filter by merchant number
  const filterMerchant = merchantAll?.filter((item) =>
    item?.name?.toLowerCase().includes(searchMerchantNumber?.toLowerCase())
  );

  const merchantLogin = async (id) => {
    const response = await ApiRequest({
      url: `/admin/impersonate/${id}`,
      method: "get",
    });
    if (response?.status === 200) {
      if (response.data) {
        const redirectUrl = `${logoAndIdentityData?.siteUrl}/pricing?id=${response.data}`;
        window.open(redirectUrl, "_blank");
      }
    } else {
      toast.error(response?.message);
    }
  };
  return (
    <div>
      <TitleDynamic title="All Merchant" />
      <section className="bg-gray-50 dark:bg-gray-900 boxShadow-table ">
        <div className="relative bg-white dark:bg-gray-800 rounded-[4px] ">
          <div className="relative flex flex-wrap items-center gap-2 px-5 py-6">
            {/* Search Merchant Email, Amount */}
            <SearchInputField
              searchText={searchText}
              setSearchText={setSearchText}
              placeholderText="Search Main Amount..."
            />
            {/* Search Merchant Email, Amount */}
            <SearchFilterData
              dropdownManu={showMerchantList}
              setDropdownManu={setShowMerchantList}
              showData={searchMerchantName?.name}
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
            {/* filter merchant  */}
          </div>

          {/* To display data in a table format  */}
          <Table headers={headers}>
            {loading
              ? Array.from({ length: ItemsPerPage }).map((_, index) => (
                <tr key={index} className="table_tr">
                  <td className="px-6 py-4">
                    <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                      <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                    </div>
                  </td>
                  <td scope="row" className="p-4">
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                        <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-8 w-16 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                  </td>
                  <td className="p-4">
                    <div className="h-6 w-11 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                  </td>
                  <td className="relative p-4">
                    <div className="h-6 w-10 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                  </td>
                </tr>
              ))
              : merchant?.map((item, index) => (
                <tr key={item.id} className="table_tr">
                  <td className="px-6 py-4">
                    {total?.totalItems -
                      ((currentPage - 1) * ItemsPerPage + index)}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {item.created_at
                      ? moment(item.created_at).format("DD MMM YYYY")
                      : "--"}
                    <br />
                    {item.created_at
                      ? moment(item.created_at).format("h:mm a")
                      : "--"}
                  </td>

                  <td scope="row" className="p-4">
                    <div
                      onClick={() => setSearchMerchantName(item.merchant)}
                      className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold"
                    >
                      <div>
                        <h1>{item.merchant.name}</h1>
                        <h1>{item.merchant.phone}</h1>
                        <h1>{item.merchant.email}</h1>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 ">
                    <div className="flex items-center gap-2">
                      {item?.payment[0]?.total_amount
                        ? item?.payment[0]?.total_amount
                        : 0}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {item?.link_balance ? item?.link_balance : 0}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {item?.automation_balance
                        ? item?.automation_balance
                        : 0}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {item?.withdrawal_balance
                        ? item?.withdrawal_balance
                        : 0}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {item.balance}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => merchantLogin(item?.id)}
                      className="text-white bg-blue-700 hover:bg-blue-800 rounded-[4px] px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none  flex items-center gap-1 w-fit"
                    >
                      Login
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
                        checked={item.active === 1}
                        onChange={(e) => {
                          setChecked(e.target.checked, item.id);
                        }}
                      />
                      <span
                        className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                      ></span>
                    </label>
                  </td>
                  <td className="relative p-4" id="openRightEditModel">
                    <div
                      className="flex text-xl items-center justify-center w-fit gap-1 px-2 py-[2px]  rounded-[4px] hover:bg-slate-200 dark:hover:bg-[#1f2937] cursor-pointer "
                      onClick={() => toggleDropdown(item.id)}
                    >
                      <FaEllipsis />
                    </div>

                    <ManagePaymentMerchant
                      managePayment={managePayment}
                      setManagePayment={setManagePayment}
                      item={item}
                      setMerchant={setMerchant}
                      currentPage={currentPage}
                      ItemsPerPage={ItemsPerPage}
                    />
                    <AllMerchantEdit
                      modalOpen={modalOpen}
                      closeModal={closeModal}
                      item={item}
                      setMerchant={setMerchant}
                    />

                    {isDropdownOpen === item.id && openRightEdit && (
                      <div
                        className={`z-40 absolute ${calculatePosition(item, merchant.slice(-1))
                          ? "-top-[48px]"
                          : "top-0"
                          } -left-[8.7rem] bg-white rounded-[4px] w-40  dark:bg-gray-700 dark:text-white boxShadow-table`}
                      >
                        {item?.merchant?.id && (
                          <div
                            onClick={() =>
                              handleAllowedIP(item?.merchant?.id)
                            }
                            className="block px-4 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] whitespace-nowrap hover:text-white cursor-pointer rounded-t-[4px]"
                          >
                            Allowed IP
                          </div>
                        )}

                        <div
                          onClick={() => handleManagePayment(item.id)}
                          className="block px-4 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] whitespace-nowrap hover:text-white cursor-pointer rounded-t-[4px]"
                        >
                          Manage Payment
                        </div>
                        <div
                          onClick={() => toggleModal(item.id)}
                          className="block px-4 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer  dark:border-b-[#1f2937]"
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => setDeleteModalOpen(item.id)}
                          className="block px-4 py-1 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer rounded-b-[4px]"
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </Table>
          {/* To display data in a table format  */}
          <AllowedIP allowedIP={allowedIp} setAllowedIP={setAllowedIP} />

          {/* table footer code start  */}
          <TableFooter
            totalItems={total?.totalItems || 0}
            perPage={ItemsPerPage}
            setPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={total?.totalPage || 0}
          />
          {/* table footer code end  */}
        </div>
        <DeleteItem
          deleteItem={deleteModalOpen}
          setDeleteItem={setDeleteModalOpen}
          handleDeleteItem={handleDeleteItem}
          text="Merchant"
          loading={deleteItemLoading}
        />
      </section>
    </div>
  );
}

export default AllMerchant;

import { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import { toast } from "react-toastify";
import Auth from "../../utils/Auth";

import moment from "moment";

import TitleDynamic from "../../TitleDynamic";
import SearchInputField from "../../components/SearchInputField";
import Table from "../../components/Table";
import axios from "axios";
import Cookies from "js-cookie";
import SearchFilterData from "../../components/SearchFilterData";
import { Link, useLocation } from "react-router-dom";
import TableFooter from "../../components/TableFooter";
import FilterStatus from "../../components/FilterStatus";
import { MdDelete } from "react-icons/md";
import ActionButton from "../../components/ActionButton";
import DeleteItem from "../../components/DeleteItem";
import { contextAuth } from "../../pages/ContextProvider";

function MerchantRequests() {
  const headers = [
    "Sl",
    "Date",
    "Merchant Details",
    "Business Info",
    "Industry",
    "Status",
    "Action",
  ];
  const { ApiRequest } = Auth();
  const { merchantAll } = useContext(contextAuth);

  const [searchWithdraw, setSearchWithdraw] = useState("");

  const [loading, setLoading] = useState(false);
  const [array, setArray] = useState([]);

  const [showMerchantList, setShowMerchantList] = useState(false);
  const [searchMerchantName, setSearchMerchantName] = useState("");
  const [searchMerchantNumber, setSearchMerchantNumber] = useState("");

  const [showWithdrawStatus, setShowWithdrawStatus] = useState(false);
  const [searchWithdrawStatus, setSearchWithdrawStatus] = useState("");
  const [merchantRequestDelete, setMerchantRequestDelete] = useState("");
  const [deleteItemLoading, setDeleteItemLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(null);
  const [render, setRender] = useState(false);

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
    setCurrentPage(1);
    const merchant = async () => {
      try {
        const response = await ApiRequest({
          url: `/admin/merchant/request?search=${searchWithdraw}&phone=${searchMerchantName ? searchMerchantName?.phone : ""
            }&page=${currentPage}&per_page=${ItemsPerPage}&confirmed=${searchWithdrawStatus
              ? searchWithdrawStatus == "Pending"
                ? 0
                : searchWithdrawStatus == "Approved"
                  ? 1
                  : 2
              : ""
            }`,
          method: "get",
        });
        setTotal({
          totalPage: response?.data?.last_page,
          totalItems: response?.data?.total,
        });
        setArray(response.data.data);
      } catch (error) {
        toast.error(error);
      }
    };
    merchant();
  }, [ItemsPerPage, searchMerchantName, searchWithdrawStatus, searchWithdraw]);

  useEffect(() => {
    const merchant = async () => {
      setLoading(true);
      try {
        const response = await ApiRequest({
          url: `/admin/merchant/request?search=${searchWithdraw}&phone=${searchMerchantName ? searchMerchantName?.phone : ""
            }&page=${currentPage}&per_page=${ItemsPerPage}&confirmed=${searchWithdrawStatus
              ? searchWithdrawStatus == "Pending"
                ? 0
                : searchWithdrawStatus == "Approved"
                  ? 1
                  : 2
              : ""
            }`,
          method: "get",
        });
        if (response?.status === 200) {
          setLoading(false);

          if (response.data) {
            setTotal({
              totalPage: response?.data?.last_page,
              totalItems: response?.data?.total,
            });
            setArray(response.data.data);
          }
        } else {
          toast.error(response?.message);
        }
      } catch (error) {
        toast.error(error);
      }
      setLoading(false);
    };
    merchant();
    setRender(false);
  }, [currentPage, render]);

  // handle received withdraw function
  const handleApproveMerchant = async (id) => {
    try {
      const response = await ApiRequest({
        url: "/admin/merchant/payment_approve/" + id,
        method: "get",
      });
      if (response?.status === 404) {
        return toast.error(response?.message);
      };
      toast.success(response?.data);
      setArray((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, confirmed: 1 }
            : item
        )
      );
    } catch (error) {
      toast.error("Failed to approve merchant request. Please try again.");
    }
  };

  const handleRejectMerchant = async (id) => {
    try {
      const response = await ApiRequest({
        url: `/admin/merchant/reject/${id}`,
      });
      if (response?.status === 404) {
        return toast.error(response?.message);
      };
      toast.success(response?.data);
      setArray((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, confirmed: 2 }
            : item
        )
      );
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Failed to reject merchant request. Please try again.");
      }
    }
  };

  // filter by merchant number
  const filterMerchantUser = merchantAll?.filter((item) =>
    item?.name?.toLowerCase().includes(searchMerchantNumber?.toLowerCase())
  );

  // outlet click close the toggle function
  useEffect(() => {
    const handleClickOutsideUsersFilter = (event) => {
      if (!event.target.closest("#showMerchantList")) {
        setShowMerchantList(false);
      }
    };
    const handleClickWithdrawStatus = (event) => {
      if (!event.target.closest("#setShowWithdrawStatus")) {
        setShowWithdrawStatus(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideUsersFilter);
    window.document.addEventListener("click", handleClickWithdrawStatus);
    return () => {
      window.document.removeEventListener(
        "click",
        handleClickOutsideUsersFilter
      );
      window.document.removeEventListener("click", handleClickWithdrawStatus);
    };
  }, []);

  const handleDeleteMerchantRequest = async (id) => {
    setDeleteItemLoading(true);
    try {
      const response = await ApiRequest({
        url: `/admin/merchant/delete/${id}`,
        method: "delete",
      });
      if (response?.status === 200) {
        toast.success("Merchant request deleted successfully!");
        try {
          const response = await ApiRequest({
            url: `/admin/merchant/request?page=${currentPage}&per_page=${ItemsPerPage}`,
            method: "get",
          });
          if (response?.status === 200) {
            if (response.data) {
              setTotal({
                totalPage: response?.data?.last_page,
                totalItems: response?.data?.total,
              });
              setArray(response.data.data);
            }
          }
        } catch (error) {
          // toast.error(error);
        }
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Failed to delete merchant request. Please try again.");
    }
    setMerchantRequestDelete("");
    setDeleteItemLoading(false);
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-">
      <TitleDynamic title="Merchant Request" />
      <div className="boxShadow-table relative overflow-hidden bg-white dark:bg-gray-800 rounded-[4px] mb-4">
        <div className="items-center justify-between px-5 py-6 lg:flex">
          <div className="items-center gap-2 md:flex">
            <SearchInputField
              searchText={searchWithdraw}
              setSearchText={setSearchWithdraw}
              placeholderText="Search Name And Email"
            />
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
              {filterMerchantUser.length > 0 ? (
                filterMerchantUser.map((merchant, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                    onClick={() => {
                      setSearchMerchantName(merchant);
                      setSearchMerchantNumber("");
                      setShowMerchantList(false);
                    }}
                  >
                    <h2>{merchant.name}</h2>
                    <h2>{merchant.phone ? merchant.phone : ""}</h2>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  No Data Available
                </div>
              )}
            </SearchFilterData>

            <FilterStatus
              showMerchantStatus={showWithdrawStatus}
              setShowMerchantStatus={setShowWithdrawStatus}
              setSearchMerchantStatus={setSearchWithdrawStatus}
              searchMerchantStatus={searchWithdrawStatus}
              id="setShowWithdrawStatus"
              placeholderText="Status..."
            >
              {["Pending", "Approved", "Rejected"]?.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                  onClick={() => setSearchWithdrawStatus(item)}
                >
                  <span> {item}</span>
                </div>
              ))}
            </FilterStatus>
          </div>
        </div>

        <Table headers={headers}>
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
              <tr
                key={index}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-10"></div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col space-y-1">
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-24"></div>
                    <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-16"></div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-32"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-40"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-28"></div>
                </td>
                <td className="p-4">
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-600 w-36"></div>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-300 rounded dark:bg-gray-600"></div>
                    <div className="h-8 w-8 bg-gray-300 rounded dark:bg-gray-600"></div>
                    <div className="h-8 w-8 bg-gray-300 rounded dark:bg-gray-600"></div>
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
                  {total?.totalItems -
                    ((currentPage - 1) * ItemsPerPage + index)}
                </td>
                <td className="p-4 w-[100px]  whitespace-nowrap">
                  {item?.created_at && (
                    <>
                      {item.created_at && moment(item.created_at).format(" DD MMM YYYY")}
                      <br />
                      {item.created_at && moment(item.created_at).format("h:mm a")}
                    </>
                  )}
                </td>
                <td className="p-4 w-[220px]">
                  <div
                    onClick={() =>
                      setSearchMerchantName({
                        name: item?.name,
                        phone: item?.phone,
                      })
                    }
                    className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold"
                  >
                    {item.name && <>{item.name} <br /></>}
                    {item.phone && <>{item.phone} <br /></>}
                    {item.email.length > 45
                      ? item.email.slice(0, 45) + "..."
                      : item.email}
                  </div>
                </td>
                <td className="p-4 text-gray-900 w-[250px] dark:text-white">
                  <p>{item.company.company_name}</p>
                  <p>{item.address}</p>
                  <Link
                    to={item.web_address}
                    target="_blank"
                    className="flex items-center gap-1 cursor-pointer hover:underline text-wrap"
                  >
                    {item.web_address?.length > 45
                      ? item.web_address?.slice(0, 45) + "..."
                      : item.web_address}
                  </Link>
                </td>
                <td className="p-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <p>{item.industry.industry_name}</p>
                </td>
                <td className="p-4">
                  <div
                    onClick={() =>
                      setSearchWithdrawStatus(
                        item.confirmed == 2
                          ? "Rejected"
                          : item.confirmed == 1
                            ? "Approved"
                            : "Pending"
                      )
                    }
                    className={`px-2 py-0.5 rounded border border-dotted flex items-center cursor-pointer gap-2 w-fit ${{
                      1: "bg-green-600 hover:bg-green-800 text-white border-green-800",
                      0: "bg-[#ff7654] hover:bg-[#da5737] text-white border-[#ff7654]",
                      2: "bg-[#ff1d1d] hover:bg-[#d63737] text-white border-[#ff1d1d]",
                    }[item.confirmed] ||
                      "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400"
                      }`}
                  >
                    {item.confirmed == 2
                      ? "Rejected"
                      : item.confirmed == 1
                        ? "Approved"
                        : "Pending"}
                  </div>
                </td>
                <td className="flex-1 p-4 w-[180px]">
                  <div className="flex items-center gap-2">
                    <button
                      title="Approve"
                      disabled={item.confirmed == 1 ? true : false}
                      onClick={() => handleApproveMerchant(item.id)}
                      className="text-white text-xl w-fit bg-green-500 hover:bg-green-800 rounded-[4px]  p-[5px] flex items-center gap-1 cursor-pointer"
                    >
                      <FaCheck />
                    </button>

                    <button
                      title="Reject"
                      disabled={item.confirmed == 2 ? true : false}
                      onClick={() => handleRejectMerchant(item.id)}
                      className="text-white w-fit bg-red-500 hover:bg-red-800  rounded-[4px] text-xl p-[5px] flex items-center gap-1 cursor-pointer"
                    >
                      <IoClose />
                    </button>

                    <ActionButton
                      id={item.id}
                      setAction={setMerchantRequestDelete}
                      title={"Delete"}
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
      </div>
      <DeleteItem
        deleteItem={merchantRequestDelete}
        setDeleteItem={setMerchantRequestDelete}
        handleDeleteItem={handleDeleteMerchantRequest}
        text="Merchant Request"
        loading={deleteItemLoading}
      />
    </section>
  );
}

export default MerchantRequests;

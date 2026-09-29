import { useEffect, useState } from "react";
import SearchInputField from "../../components/SearchInputField";
import TitleDynamic from "../../TitleDynamic";
import moment from "moment";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import Table from "../../components/Table";
import { useLocation } from "react-router-dom";
import TableFooter from "../../components/TableFooter";
import FilterStatus from "../../components/FilterStatus";
import ActionButton from "../../components/ActionButton";
import IpRequestStatusChange from "./IpRequestStatusChange";
import { IoMdClose } from "react-icons/io";
import { MdBlock, MdDelete } from "react-icons/md";
import DeleteItem from "../../components/DeleteItem";

function IpRequest() {
  const headers = [
    "Sl",
    "Date",
    "Merchant Details",
    "IP Address",
    "Business Name",
    "Status",
    "Active",
    "Action",
  ];
  const [searchText, setSearchText] = useState("");

  const [showIpRequestStatus, setShowIpRequestStatus] = useState(false);
  const [showIpRequest, setShowIpRequest] = useState("");
  const [rejectModal, setRejectModal] = useState("");
  const [ipRequestDelete, setIpRequestDelete] = useState("");
  const [deleteItemLoading, setDeleteItemLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);
  const [ipRequest, setIpRequest] = useState([]);
  const [total, setTotal] = useState(null);
  const token = Cookies.get("token");

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
    const getAllowedIpRequest = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/allowed-ips?search=${searchText}&status=${showIpRequest?.toLocaleLowerCase()}&per_page=${ItemsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalPage: response?.data?.last_page,
          totalItems: response?.data?.total,
        });
        setIpRequest(response?.data?.data);
      } catch (err) {
        // console.log(err);
      }
    };
    getAllowedIpRequest();
  }, [ItemsPerPage, searchText, showIpRequest]);

  useEffect(() => {
    const getAllowedIpRequest = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/allowed-ips?search=${searchText}&status=${showIpRequest?.toLocaleLowerCase()}&per_page=${ItemsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalPage: response?.data?.last_page,
          totalItems: response?.data?.total,
        });
        setIpRequest(response?.data?.data);
      } catch (err) {
        // console.log(err);
      }
      setLoading(false);
    };
    getAllowedIpRequest();
  }, [currentPage]);

  const requestStatusChange = async (e, item) => {
    if (!token) return;

    const formData = new FormData();
    formData.append("ip_address", item?.ip_address);
    formData.append("merchant_id", item?.merchant_id);
    formData.append("status", e === true ? "active" : "inactive");
    formData.append("_method", "PUT");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/allowed-ips/${item.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/allowed-ips?per_page=${ItemsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalPage: response?.data?.last_page,
          totalItems: response?.data?.total,
        });
        setIpRequest(response?.data?.data);
      } catch (err) {
        // console.log(err);
      }
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  // outlet click close the toggle function
  useEffect(() => {
    const handleClickShowIpRequest = (event) => {
      if (!event.target.closest("#setShowIpRequestStatus")) {
        setShowIpRequestStatus(false);
      }
    };
    window.document.addEventListener("click", handleClickShowIpRequest);
    return () => {
      window.document.removeEventListener("click", handleClickShowIpRequest);
    };
  }, []);

  const handleDeleteIpRequest = async (id) => {
    setDeleteItemLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/allowed-ips/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/allowed-ips?per_page=${ItemsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalPage: response?.data?.last_page,
          totalItems: response?.data?.total,
        });
        setIpRequest(response?.data?.data);
      } catch (err) {
        // console.log(err);
      }
      toast.success(" Allowed ip deleted successfully");
    } catch (error) {
      toast.error("Allowed ip delete failed");
    }
    setIpRequestDelete("");
    setDeleteItemLoading(false);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <TitleDynamic title="IP Request" />
      <div className="boxShadow-table relative overflow-hidden bg-white dark:bg-gray-800 rounded-[4px] mb-4">
        <div className="items-center justify-between px-5 py-6 lg:flex">
          <div className="items-center gap-2 md:flex">
            <SearchInputField
              searchText={searchText}
              setSearchText={setSearchText}
              placeholderText="Search Name And Phone..."
            />
            <FilterStatus
              showMerchantStatus={showIpRequestStatus}
              setShowMerchantStatus={setShowIpRequestStatus}
              setSearchMerchantStatus={setShowIpRequest}
              searchMerchantStatus={showIpRequest}
              id="setShowIpRequestStatus"
              placeholderText="Status..."
            >
              {["Active", "Inactive", "Suspended", "Rejected"]?.map(
                (item, index) => (
                  <div
                    key={index}
                    className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                    onClick={() => setShowIpRequest(item)}
                  >
                    <span> {item}</span>
                  </div>
                )
              )}
            </FilterStatus>
          </div>
        </div>
        <Table headers={headers}>
          {loading
            ? [...Array(10)].map((_, index) => (
              <tr
                key={index}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-16"></div>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-24"></div>
                </td>
                <td className="p-4 cursor-pointer">
                  <div className="flex items-center p-1 border bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-48">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-24"></div>
                  </div>
                </td>

                <td className="p-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-32"></div>
                </td>

                <td className="p-4 text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-32"></div>
                </td>

                <td className="p-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-24"></div>
                </td>

                <td className="p-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-16"></div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full"></div>
                    <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full"></div>
                  </div>
                </td>
              </tr>
            ))
            : ipRequest?.map((item, index) => (
              <tr
                key={item.id}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="px-6 py-4 w-[50px]">
                  {total?.totalItems -
                    ((currentPage - 1) * ItemsPerPage + index)}
                </td>

                <td className="p-4 w-[100px] whitespace-nowrap">
                  {item?.created_at && (
                    <>
                      {item.created_at && moment(item.created_at).format(" DD MMM YYYY")}
                      <br />
                      {item.created_at && moment(item.created_at).format("h:mm a")}
                    </>
                  )}
                </td>
                <td className="p-4 cursor-pointer">
                  <div
                    onClick={() => setSearchText(item?.merchant?.name)}
                    className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold"
                  >
                    {item?.merchant?.name && <>{item?.merchant?.name}<br /></>}
                    {item?.merchant?.phone}
                  </div>
                </td>

                <td className="p-4 text-gray-900 whitespace-nowrap dark:text-white">
                  {item.ip_address && item.ip_address}
                </td>
                <td className="p-4 text-gray-900 whitespace-nowrap dark:text-white">
                  {item.merchant?.business_name &&
                    item.merchant?.business_name}
                </td>
                <td className="p-4">
                  <span
                    onClick={() => setShowIpRequest(item.status)}
                    className={`px-2 py-0.5 rounded border border-dotted flex items-center cursor-pointer gap-2 w-fit ${{
                      active: "bg-green-600 text-white border-green-800",
                      inactive: "bg-gray-600 text-white border-gray-800",
                      suspended: "bg-[#d15820] text-white border-[#d15820]",
                      rejected: "bg-[#ff1d1d] text-white border-[#ff1d1d]",
                    }[item.status] ||
                      "bg-gray-200 text-gray-800 border-gray-400"
                      }`}
                  >
                    {item.status.slice(0, 1).toUpperCase() +
                      item.status.slice(1)}
                  </span>
                </td>

                <td className="p-4">
                  <label
                    htmlFor={`toggle-${item.id}`}
                    className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${item.status == "active" ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
                  >
                    <input
                      type="checkbox"
                      id={`toggle-${item.id}`}
                      className="peer sr-only"
                      checked={item.status == "active" ? true : false}
                      onChange={(e) => {
                        requestStatusChange(e.target.checked, item);
                      }}
                    />
                    <span
                      className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                    ></span>
                  </label>
                </td>
                <td className="p-4 w-[180px]">
                  <div className="flex items-center gap-2">
                    <ActionButton
                      id={{
                        id: item.id,
                        merchant_id: item.merchant_id,
                        ip_address: item.ip_address,
                        status: "rejected",
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
                            You want to reject this IP Request
                          </>
                        ),
                      }}
                      setAction={setRejectModal}
                      title={"Reject"}
                      icon={<IoMdClose />}
                      bgColor={"bg-red-500 hover:bg-red-600"}
                    />
                    <ActionButton
                      id={{
                        id: item.id,
                        merchant_id: item.merchant_id,
                        ip_address: item.ip_address,
                        status: "suspended",
                        btnText: "Suspend",
                        iconColor: "text-[#d15820]",
                        icon: <MdBlock size={40} />,
                        bgColor: "bg-[#d15820]",
                        btnColor: "bg-[#d15820] hover:bg-[#d15820]",
                        cancelBgColor:
                          "text-gray-700 bg-gray-100 hover:bg-gray-200",
                        title: (
                          <>
                            Are you sure? <br />
                            You want to suspend this IP Request
                          </>
                        ),
                      }}
                      setAction={setRejectModal}
                      title={"Suspend"}
                      icon={<MdBlock />}
                      bgColor={"bg-[#d15820] hover:bg-[#d15820]"}
                    />

                    <ActionButton
                      id={item.id}
                      setAction={setIpRequestDelete}
                      title={"Delete"}
                      icon={<MdDelete />}
                      bgColor={"bg-red-500 hover:bg-red-800"}
                    />
                  </div>
                  <IpRequestStatusChange
                    rejectModal={rejectModal}
                    setRejectModal={setRejectModal}
                    item={item}
                    setIpRequest={setIpRequest}
                  />
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
          deleteItem={ipRequestDelete}
          setDeleteItem={setIpRequestDelete}
          handleDeleteItem={handleDeleteIpRequest}
          text="Ip Request"
          loading={deleteItemLoading}
        />
      </div>
    </section>
  );
}

export default IpRequest;

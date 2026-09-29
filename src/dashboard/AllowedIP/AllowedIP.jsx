import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Table from "../../components/Table";
import DeleteItem from "../../components/DeleteItem";
import InputField from "../../components/InputField";
import TableFooter from "../../components/TableFooter";

function AllowedIP({ setAllowedIP, allowedIP }) {
  const headers = ["Sl", "Date", "Ip Address", "Status", "Action"];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteAllowedIp, setDeleteAllowedIp] = useState(null);
  const [render, setRender] = useState(false);
  const token = Cookies.get("token");
  const [merchant_id, setMerchant_id] = useState("");
  const [dataFetchLoading, setDataFetchLoading] = useState(false);

  useEffect(() => {
    if (allowedIP) {
      localStorage.setItem("merchant_id", allowedIP);
      setMerchant_id(allowedIP);
    }
  }, [allowedIP]);
  useEffect(() => {
    if (!token) return;
    fetchData();
    setRender(false);
  }, [allowedIP, render, token]);

  const fetchData = async () => {
    if (!allowedIP) return;
    setDataFetchLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST
        }/admin/allowed-ips/merchant/${allowedIP}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.status === 200) {
        setData(response.data?.reverse());
      }
    } catch (err) {
      // console.error("Error fetching data:", err);
    }
    setDataFetchLoading(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(8);
  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / ItemsPerPage);

  // Delete Allowed IP
  const handleDeleteAllowedIp = async () => {
    if (!token) return;
    setLoading(true);
    const id = localStorage.getItem("merchant_id");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/allowed-ips/${deleteAllowedIp}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMerchant_id(id);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/allowed-ips/merchant/${allowedIP}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response?.status === 200) {
          setData(response.data?.reverse());
        }
      } catch (err) {
        // console.error("Error fetching data:", err);
      }
      toast.success("Allowed ip deleted successfully");
    } catch (err) {
      toast.error("Allowed ip deletion failed");
    } finally {
      setDeleteAllowedIp(null);
      setLoading(false);
    }
  };

  // Update Status action in Allowed IP
  const handleUpdateStatus = async (item, newStatus) => {
    if (!token) return;
    const formData = new FormData();
    formData.append("ip_address", item?.ip_address);
    formData.append("merchant_id", item?.merchant_id);
    formData.append("status", newStatus);
    formData.append("_method", "PUT");
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/allowed-ips/${item.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.status === 200) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_HOST
            }/admin/allowed-ips/merchant/${allowedIP}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response?.status === 200) {
            setData(response.data?.reverse());
          }
        } catch (err) {
          // console.error("Error fetching data:", err);
        }
        toast.success("Status updated successfully");
      }
    } catch (err) {
      toast.error("Status update failed");
    } finally {
      setLoading(false);
    }
  };

  const [addAllowedIp, setAddAllowedIp] = useState(false);
  const [allowedIps, setAllowedIp] = useState("");

  //  create Allowed IP
  const handleAllowedIps = async () => {
    if (!token) return;

    const formData = new FormData();
    formData.append("ip_address", allowedIps);
    formData.append("merchant_id", merchant_id);
    formData.append("status", "inactive");
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/allowed-ips`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.status == 201) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_HOST
            }/admin/allowed-ips/merchant/${allowedIP}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response?.status === 200) {
            setData(response.data?.reverse());
          }
        } catch (err) {
          // console.error("Error fetching data:", err);
        }
        toast.success("Status create successfully");
        setAddAllowedIp(null);
        setAllowedIp("");
      }
    } catch (err) {
      if (err.response.data.message) {
        return toast.error(err.response.data.message);
      }
      toast.error("Status Create Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {allowedIP && (
        <div
          id="default-modal"
          tabIndex="-1"
          inert
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-6xl h-md max-h-full">
            <div className="relative bg-white rounded shadow dark:bg-gray-700">
              <div
                onClick={() => {
                  setAllowedIP(null);
                  setData([]);
                }}
                className="absolute top-0 right-0 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-300 text-blue-600 flex items-center justify-center text-2xl cursor-pointer dark:bg-[#485363]"
              >
                <IoClose />
              </div>

              <div className="p-5">
                <button
                  onClick={() => setAddAllowedIp(!addAllowedIp)}
                  className="button_gradient"
                >
                  Add New IP
                </button>
              </div>

              {dataFetchLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full">
                    {/* Skeleton Header */}
                    <div className="overflow-x-auto rounded mb-4">
                      <table className="w-full text-left text-black dark:text-white">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Sl
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Date
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Ip Address
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Status
                            </th>
                            <th scope="col" className="px-4 py-3">
                              Action
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    {/* Skeleton Body */}
                    <div className="space-y-2">
                      {[...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-6 py-2 animate-pulse bg-gray-100 rounded dark:bg-gray-800"
                        >
                          <div className="w-10 h-4 bg-gray-300 rounded dark:bg-gray-700"></div>
                          <div className="w-32 h-4 bg-gray-300 rounded dark:bg-gray-700"></div>
                          <div className="w-20 h-4 bg-gray-300 rounded dark:bg-gray-700"></div>
                          <div className="w-24 h-6 bg-gray-300 rounded dark:bg-gray-700"></div>
                          <div className="w-10 h-10 bg-gray-300 rounded dark:bg-gray-700"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : data?.length > 0 ? (
                <>
                  <Table headers={headers}>
                    {currentItems?.map((item, index) => (
                      <tr key={index} className="table_tr">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {data?.length -
                            ((currentPage - 1) * ItemsPerPage + index)}
                        </td>
                        <td className="p-4 whitespace-nowrap">

                          {moment(item?.created_at).format("DD MMM YYYY")} <br />
                          {moment(item?.created_at).format("hh:mm A")}

                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {item?.ip_address}
                        </td>
                        <td className="p-4">
                          <select
                            value={item.status}
                            className={`w-fit px-3 py-2 rounded border-dotted shadow-sm focus:outline-none focus:ring-0
                                ${item.status === "active"
                                ? "bg-green-50 border-green-500 text-green-700"
                                : ""
                              }
                                ${item.status === "inactive"
                                ? "bg-gray-50 border-gray-400 text-gray-600"
                                : ""
                              }
                                ${item.status === "suspended"
                                ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                                : ""
                              }
                                ${item.status === "rejected"
                                ? "bg-red-50 border-red-500 text-red-700"
                                : ""
                              }
                            `}
                            onChange={(e) =>
                              handleUpdateStatus(item, e.target.value)
                            }
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspend</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-4 w-[40px]">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setDeleteAllowedIp(item?.id)}
                              className="px-2 py-1 bg-red-500 text-white hover:bg-red-600 cursor-pointer rounded text-xl"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Table>

                  <TableFooter
                    perPage={ItemsPerPage}
                    setPerPage={setItemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPage={totalPages}
                  />
                </>
              ) : (
                <h2 className="text-center text-black dark:text-white pb-5 text-xl ">
                  No data available to display at the moment.
                </h2>
              )}
            </div>
          </div>

          <DeleteItem
            deleteItem={deleteAllowedIp}
            setDeleteItem={setDeleteAllowedIp}
            handleDeleteItem={handleDeleteAllowedIp}
            text={"Allowed IP"}
            loading={loading}
          />

          {/* add allowed ip address modal */}
          {addAllowedIp && (
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/40">
              <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto  ">
                <div className="relative p-10 bg-white rounded-[4px] shadow dark:bg-gray-700">
                  <div className="space-y-5 text-black dark:text-white text-size">
                    <InputField
                      type="text"
                      name="allowed_ip"
                      value={allowedIps}
                      onChange={setAllowedIp}
                      placeholder="Allowed Ip"
                      label="Allowed Ip"
                      id="allowed_ip"
                      required={true}
                    />
                    <div className=" flex items-center gap-3">
                      <button
                        onClick={handleAllowedIps}
                        disabled={loading}
                        className="button_gradient"
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin" /> Loading...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                      <button
                        onClick={() => setAddAllowedIp(false)}
                        className="button_cancel"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AllowedIP;

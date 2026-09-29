import { useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa";

import TitleDynamic from "../../../TitleDynamic";
import SearchInputField from "../../../components/SearchInputField";
import DeleteItem from "../../../components/DeleteItem";
import Table from "../../../components/Table";
import ManualPaymentEdit from "./ManualPaymentEdit";
import AddManualPayment from "./AddManualPayment";

import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import TableFooter from "../../../components/TableFooter";
import ActionButton from "../../../components/ActionButton";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function ManualPayment() {
  const headers = [
    "Sl",
    "Date",
    "Device Info",
    "Payment Info",
    "Information Fields",
    "Total Trx",
    "Min / Max Trx",
    "Daily / Monthly Trx",
    "Active",
    "Action",
  ];
  const [searchManualPayment, setSearchManualPayment] = useState("");
  const [addManualPayment, setAddManualPayment] = useState(false);

  const [editManualPayment, setEditManualPayment] = useState("");
  const [deleteManualPayment, setDeleteManualPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [getManualPayment, setGetManualPayment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);
  const token = Cookies.get("token");

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
    setRender(true);
  }, [searchManualPayment, ItemsPerPage]);

  useEffect(() => {
    const handleGetManualPayment = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/manual-payment-gateways?search=${searchManualPayment}&per_page=${ItemsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response?.status === 200) {
          setGetManualPayment(response?.data);
        }
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
      }
    };

    setRender(false);
    handleGetManualPayment();
  }, [render, currentPage]);

  const totalPages = Math.ceil(getManualPayment?.total_data / ItemsPerPage);

  const handleStatusChange = async (id, e) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_HOST
        }/admin/manual-payment-gateways/status/change/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGetManualPayment((prev) => ({
        ...prev,
        data: prev.data?.map((item) =>
          item.id === id
            ? { ...item, status: e == true ? 'active' : 'inactive' }
            : item
        ),
      }));
      toast.success("Status updated successfully!");

    } catch (error) {
      // console.log(error);
    }
  };

  const handleDeleteManualPayment = async (id) => {
    setLoadingDelete(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST
        }/admin/delete-manual-payment-gateway/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/manual-payment-gateways?&per_page=${ItemsPerPage}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGetManualPayment(response?.data);
      } catch (error) {
        // console.log(error);
      }
      toast.success("Manual payment delete successfully!");
    } catch (error) {
      toast.error('Failed to delete manual payment. Please try again.');
    } finally {
      setLoadingDelete(false);
      setDeleteManualPayment(null);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 ">
      <TitleDynamic title="Manual Payment" />
      <div>
        <div className="boxShadow-table  bg-white dark:bg-gray-800 rounded-[4px] mb-4">
          <div className="lg:flex items-center justify-between py-6 px-5">
            <div className="flex sm:flex-row flex-col items-center gap-2 text-black dark:text-white">
              <SearchInputField
                searchText={searchManualPayment}
                setSearchText={setSearchManualPayment}
                placeholderText="Search Method And Wallet Address"
              />

              <button
                id="handleClickOutsideOperator"
                onClick={() => setAddManualPayment(!addManualPayment)}
                className="button_gradient w-full md:w-auto"
              >
                <FaPlus />
                Add Manual Payment
              </button>

              <AddManualPayment
                setAddManualPayment={setAddManualPayment}
                addManualPayment={addManualPayment}
                setGetManualPayment={setGetManualPayment}
                currentPage={currentPage}
                ItemsPerPage={ItemsPerPage}
              />
            </div>
          </div>
          <Table headers={headers}>
            {loading
              ?
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="table_tr ">
                  <td className="px-6 py-4 text-left w-[50px]">
                    <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>

                  <td className="p-4 w-[150px] whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="h-16 w-[200px] bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 w-[300px] flex-wrap">
                      <div className="px-3 py-2 rounded bg-gray-300 dark:bg-gray-700 animate-pulse w-20 h-6"></div>
                      <div className="px-3 py-2 rounded bg-gray-300 dark:bg-gray-700 animate-pulse w-20 h-6"></div>
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="h-6 w-11 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full"></div>
                  </td>

                  <td className="p-4 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
              : getManualPayment?.data?.map((item, index) => (
                <tr
                  key={index}
                  data-testid="table-row-element"
                  className="table_tr"
                >
                  <td className="px-6 py-4 text-left w-[50px]">
                    {getManualPayment?.total_data -
                      ((currentPage - 1) * ItemsPerPage + index)}
                  </td>

                  <td className="p-4 w-[150px] whitespace-nowrap">
                    {item.created_at && moment(item.created_at).format("DD MMM YYYY")}
                    <br />
                    {item.created_at && moment(item.created_at).format("h:mm a")}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    {
                      item?.manual_cash_in_robotic_device &&
                      <h2 className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold w-[200px]">
                        {item?.manual_cash_in_robotic_device.owner_name && <>{item?.manual_cash_in_robotic_device.owner_name.charAt(0).toUpperCase() +
                          item?.manual_cash_in_robotic_device.owner_name.slice(1).toLowerCase()}<br /></>}
                        {item?.manual_cash_in_robotic_device.device_name && <>{item?.manual_cash_in_robotic_device.device_name} <br /></>}
                        {item?.manual_cash_in_robotic_device.owner_phone && <>{item?.manual_cash_in_robotic_device.owner_phone} <br /></>}
                      </h2>
                    }
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {item.payment_method_name && <>{item.payment_method_name.charAt(0).toUpperCase() +
                      item.payment_method_name.slice(1).toLowerCase()}<br /></>}
                    {item.default_currency && <>{item.default_currency} <br /></>}
                    {item.wallet_address && <>{item.wallet_address} <br /></>}
                    {item.secret_key && <TextCopy text={item.secret_key} />}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 w-[300px] flex-wrap">
                      {item.fields.length > 0
                        ? item.fields?.map((item, index) => (
                          <div
                            key={index}
                            className="px-3 py-1 rounded bg-[#395BEF] text-white"
                          >
                            <h2>{item?.info_keys}</h2>
                          </div>
                        ))
                        : ""}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {item.total_trx_amount?.total_amount && item.total_trx_amount?.total_amount}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {item.min_trx_amount && <>{item.min_trx_amount}<br /></>}
                    {item.max_trx_amount && item.max_trx_amount}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {item.daily_trx_limit && <>{item.daily_trx_limit}<br /></>}
                    {item.monthly_trx_limit && item.monthly_trx_limit}
                  </td>

                  <td className="p-4">
                    <label
                      htmlFor={`toggle-${item.id}`}
                      className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${item.status === "active" ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
                    >
                      <input
                        type="checkbox"
                        id={`toggle-${item.id}`}
                        className="peer sr-only"
                        checked={item.status === 'active' ? true : false}
                        onChange={(e) => {
                          handleStatusChange(item.id, e.target.checked);
                        }}
                      />
                      <span
                        className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                      ></span>
                    </label>
                  </td>
                  <td className="p-4  flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          title={"Edit"}
                          id={item}
                          setAction={setEditManualPayment}
                          icon={<CiEdit />}
                          bgColor={"bg-green-500 hover:bg-green-800"}
                        />
                        <ActionButton
                          title={"Delete"}
                          id={item.id}
                          setAction={setDeleteManualPayment}
                          icon={<MdDelete />}
                          bgColor={"bg-red-500 hover:bg-red-800"}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </Table>
          <ManualPaymentEdit
            editManualPayment={editManualPayment}
            setEditManualPayment={setEditManualPayment}
            setGetManualPayment={setGetManualPayment}
          />

          <TableFooter
            totalItems={getManualPayment?.total_data || 0}
            perPage={ItemsPerPage}
            setPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPages || 0}
          />
        </div>
        <DeleteItem
          deleteItem={deleteManualPayment}
          setDeleteItem={setDeleteManualPayment}
          handleDeleteItem={handleDeleteManualPayment}
          text="Manual Payment"
          loading={loadingDelete}
        />
      </div>
    </section>
  );
}

export default ManualPayment;

import { useEffect, useState } from "react";
import { FaPlus, FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

import TitleDynamic from "../../../TitleDynamic";
import PayoutPaymentMethodEdit from "./PayoutPaymentMethodEdit";
import Auth from "./../../../utils/Auth";
import SearchInputField from "../../../components/SearchInputField";

import { toast } from "react-toastify";
import AddPayment from "./AddPayment";
import DeleteItem from "../../../components/DeleteItem";
import Table from "../../../components/Table";
import TableFooter from "../../../components/TableFooter";
import { useLocation } from "react-router-dom";
import { PiClipboardFill } from "react-icons/pi";
import ActionButton from "../../../components/ActionButton";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import PayoutSmsView from "./PayoutSmsView";

function PayoutPaymentMethod() {
  const headers = [
    "Sl",
    "Date",
    "Sender Info",
    "Total/Last TRX",
    "Min/Max Balance",
    "Daily Limit",
    "Monthly Limit",
    "Last Balance",
    "Action",
  ];
  const { ApiRequest } = Auth();
  const [searchPaymentMethod, setSearchPaymentMethod] = useState("");

  const [render, setRender] = useState(false);

  const [dropdownModel, setDropdownModel] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutPaymentMethodEdit, setPayoutPaymentMethodEdit] = useState(null);
  const [viewPayoutMethodSms, setViewPayoutMethodSms] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [allData, setAllData] = useState([]);

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
  useEffect(() => {
    setCurrentPage(1);
    getAllSecretKey();
    setRender(false);
  }, [ItemsPerPage, searchPaymentMethod]);
  useEffect(() => {
    getAllSecretKey();
    setRender(false);
  }, [render, currentPage,]);

  const getAllSecretKey = async () => {
    setLoading(true);
    const response = await ApiRequest({
      url: `/admin/get_all_secret_key?per_page=${ItemsPerPage}&page=${currentPage}&search=${searchPaymentMethod}`,
      method: "get",
    });
    if (response.data) {
      setLoading(false);
      setAllData(response.data.data);
      setTotal({
        totalItems: response?.data?.total,
        totalPage: response?.data?.last_page,
      });
    } else {
      setLoading(false);
      toast.error(response?.message);
    }
  };
  const setChecked = async (e, id) => {
    try {
      const response = await ApiRequest({
        url: "/admin/secret_active_deactive",
        formdata: { id, checked: e == true ? 1 : 0 },
      });
      setAllData((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, active: e == true ? 1 : 0 }
            : item
        )
      );
      toast.success("Successfully updated");
    } catch (error) {
      toast.error("Failed to update. Please try again.");
    }
  };
  const handleDeleteWithdraw = async (id) => {
    setLoadingDelete(true);
    try {
      const response = await ApiRequest({
        url: "/admin/secret_delete/" + id,
        method: "delete",
      });
      const res = await ApiRequest({
        url: `/admin/get_all_secret_key?per_page=${ItemsPerPage}&page=${currentPage}`,
        method: "get",
      });
      setAllData(res.data.data);
      setTotal({
        totalItems: res?.data?.total,
        totalPage: res?.data?.last_page,
      });
      toast.success("Payment method deleted successfully!");
    }
    catch (error) {
      toast.error("Failed to delete. Please try again.");
    }
    setIsModalOpen(false);
    setLoadingDelete(false);
  };

  return (
    <section className="relative w-full bg-white dark:bg-gray-800  rounded-[4px] mr-3 boxShadow-table mb-5">
      <div className="bg-white dark:bg-gray-800">
        <TitleDynamic title="Payout Payment Method" />

        <div className="flex items-center flex-wrap gap-2 py-6 px-5">
          <SearchInputField
            searchText={searchPaymentMethod}
            setSearchText={setSearchPaymentMethod}
            placeholderText="Search Name And Secret Key"
          />

          <button
            id="handleClickOutsideOperator"
            onClick={() => setDropdownModel(!dropdownModel)}
            className="button_gradient w-full md:w-auto"
          >
            <FaPlus />
            Add Payment
          </button>
          <AddPayment
            dropdownModel={dropdownModel}
            setDropdownModel={setDropdownModel}
            setTotal={setTotal}
            setAllData={setAllData}
            currentPage={currentPage}
            ItemsPerPage={ItemsPerPage}
          />
        </div>
        <Table headers={headers}>
          {loading
            ? Array(5) // Skeleton rows
              .fill(0)
              .map((_, index) => (
                <tr key={index} className="table_tr">
                  <td className="w-[50px] px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-8 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </td>
                  <td className="w-[120px] px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="h-6 w-[250px] bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                      <div className="h-4 w-[200px] bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                      <div className="h-4 w-[180px] bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </td>
                  <td className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-11 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))
            : allData?.map((item, index) => (
              <tr
                key={index}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="w-[50px] px-6 py-4 whitespace-nowrap">
                  {total?.totalItems -
                    ((currentPage - 1) * ItemsPerPage + index)}
                </td>
                <td className="w-[120px] px-6 py-4 whitespace-nowrap">
                  {moment(item?.created_at).format("DD MMM YYYY")} <br />
                  {item?.created_at
                    ? moment(item?.created_at).format("h:mm a")
                    : ""}
                </td>

                <td className="p-4">
                  <div
                    className="cursor-pointer flex flex-col p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold w-[270px]"
                  >

                    <h2
                      className=" cursor-pointer flex items-center justify-between gap-2 w-full">

                      <span>
                        Secret Key :
                        {" " + item?.secret?.length > 10
                          ? item?.secret?.slice(0, 10) + "..."
                          : item?.secret}
                      </span>
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          navigator?.clipboard
                            .writeText(item?.secret)
                            .then(() => {
                              toast.success("Copied successfully", {
                                position: "top-center",
                              });
                            })
                            .catch(() => {
                              toast.error("Failed to copy. Please try again.");
                            });
                        }}
                        className="cursor-pointer"
                      >
                        <PiClipboardFill className="text-xl text-[#08987C] hover:text-[#065A47] transition-colors duration-200" />
                      </span>
                    </h2>
                    <div>
                      {item?.name && (<>Name: {item?.name}<br /> </>)}
                      {item?.device_id && (<>ID: {item?.device_id}<br /></>)}
                      {item?.device_imei_no && (<>IMEI: {item?.device_imei_no}<br /></>)}
                      {item?.bkash_mobile_no && (<>Bkash: {item?.bkash_mobile_no}<br /></>)}
                      {item?.nagad_mobile_no && (<>Nagad: {item?.nagad_mobile_no}</>)}
                    </div>
                  </div>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <h2 className="w-[100px] lg:w-fit">
                    {"Bkash: " +
                      (item?.total_bkash_transactions
                        ?.total_bkash_transactions == undefined
                        ? 0
                        : item?.total_bkash_transactions
                          .total_bkash_transactions)}
                  </h2>

                  <h2 className="w-[100px] lg:w-fit">
                    {"Nagad: " +
                      (item?.total_nagad_transactions
                        ?.total_nagad_transactions == undefined
                        ? 0
                        : item?.total_nagad_transactions
                          ?.total_nagad_transactions)}
                  </h2>
                  <h2 className="w-[100px] lg:w-fit">
                    {"Bkash: " +
                      (item?.last_bkash_transaction?.amount == undefined
                        ? 0
                        : item?.last_bkash_transaction?.amount)}
                  </h2>
                  <h2 className="w-[100px] lg:w-fit">
                    {"Nagad: " +
                      (item?.last_nagad_transaction?.amount == undefined
                        ? 0
                        : item?.last_nagad_transaction?.amount)}
                  </h2>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <h2 className="w-[100px] lg:w-fit">
                    {"Bkash: " + (item?.trx_min_limit_bkash && item?.trx_min_limit_bkash)}
                  </h2>
                  <h2 className="w-[100px] lg:w-fit">
                    {"Nagad: " +
                      (item?.trx_min_limit_nagad && item?.trx_min_limit_nagad)}
                  </h2>
                  <h2 className="w-[100px] lg:w-fit">
                    {"Bkash: " + (item?.trx_max_limit_bkash && item?.trx_max_limit_bkash)}
                  </h2>
                  <h2 className="w-[100px] lg:w-fit">
                    {"Nagad: " +
                      (item?.trx_max_limit_nagad && item?.trx_max_limit_nagad)}
                  </h2>
                </td>


                <td
                  className={`p-4 w-[220px] ${(item?.get_daily_bkash_usage_percentage?.percentage > 90 ||
                    item?.get_daily_nagad_usage_percentage?.percentage > 90)
                    ? "bg-yellow-100"
                    : ""
                    }`}
                >
                  <h2
                    className={` ${item?.get_daily_bkash_usage_percentage?.percentage > 90
                      ? "text-red-600"
                      : ""
                      }`}
                  >
                    {"Bkash: " +
                      (item?.daily_trx_limit_bkash && item?.daily_trx_limit_bkash)}
                  </h2>
                  <h2
                    className={` ${item?.get_daily_nagad_usage_percentage?.percentage > 90
                      ? "text-red-600"
                      : ""
                      }`}
                  >
                    {"Nagad: " +
                      (item?.daily_trx_limit_nagad && item?.daily_trx_limit_nagad)}
                  </h2>
                  {(item?.get_daily_bkash_usage_percentage?.percentage > 90 ||
                    item?.get_daily_nagad_usage_percentage?.percentage > 90) && (
                      <span>
                        Over 90% limit used for{" "}
                        {item?.get_daily_bkash_usage_percentage?.percentage > 90 && "Bkash"}
                        {item?.get_daily_bkash_usage_percentage?.percentage > 90 &&
                          item?.get_daily_nagad_usage_percentage?.percentage > 90 &&
                          " and "}
                        {item?.get_daily_nagad_usage_percentage?.percentage > 90 && "Nagad"} (
                        {Math.max(
                          item?.get_daily_bkash_usage_percentage?.percentage || 0,
                          item?.get_daily_nagad_usage_percentage?.percentage || 0
                        )}
                        %)
                      </span>
                    )}
                </td>
                <td
                  className={`p-4  w-[220px]  ${(item?.get_monthly_nagad_usage_percentage?.percentage > 90 ||
                    item?.get_monthly_bkash_usage_percentage?.percentage > 90)
                    ? "bg-yellow-100"
                    : ""
                    }`}
                >
                  <h2
                    className={`${item?.get_monthly_nagad_usage_percentage?.percentage > 90
                      ? "text-red-600"
                      : ""
                      }`}
                  >
                    {"Bkash: " +
                      (item?.monthly_trx_limit_bkash && item?.monthly_trx_limit_bkash)}
                  </h2>
                  <h2
                    className={`${item?.get_monthly_bkash_usage_percentage?.percentage > 90
                      ? "text-red-600"
                      : ""
                      }`}
                  >
                    {"Nagad: " +
                      (item?.monthly_trx_limit_nagad && item?.monthly_trx_limit_nagad)}
                  </h2>
                  {(item?.get_monthly_nagad_usage_percentage?.percentage > 90 ||
                    item?.get_monthly_bkash_usage_percentage?.percentage > 90) && (
                      <span>
                        Over 90% limit used for{" "}
                        {item?.get_monthly_nagad_usage_percentage?.percentage > 90 && "Bkash"}
                        {item?.get_monthly_nagad_usage_percentage?.percentage > 90 &&
                          item?.get_monthly_bkash_usage_percentage?.percentage > 90 &&
                          " and "}
                        {item?.get_monthly_bkash_usage_percentage?.percentage > 90 && "Nagad"} (
                        {Math.max(
                          item?.get_monthly_nagad_usage_percentage?.percentage || 0,
                          item?.get_monthly_bkash_usage_percentage?.percentage || 0
                        )}
                        %)
                      </span>
                    )}
                </td>

                <td className="p-4 whitespace-nowrap">
                  <h2 className="w-[100px] lg:w-fit">
                    {"Bkash: " +
                      (item?.last_bkash_balance?.last_balance == null
                        ? 0
                        : item?.last_bkash_balance?.last_balance)}
                  </h2>
                  <h2 className="w-[100px] lg:w-fit">
                    {"Nagad: " +
                      (item?.last_nagad_balance?.last_balance == null
                        ? 0
                        : item?.last_nagad_balance?.last_balance)}
                  </h2>
                </td>

                <td className="p-4  flex-1 space-y-2 w-[100px]">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`toggle-${item.id}`}
                      className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${item.active == 1 ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
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
                    <ActionButton
                      id={item.id}
                      setAction={setViewPayoutMethodSms}
                      title={"View"}
                      icon={<FaRegEye />}
                      bgColor={"bg-blue-500 hover:bg-blue-800"}
                    />
                    <ActionButton
                      title={"Edit"}
                      id={item}
                      setAction={setPayoutPaymentMethodEdit}
                      icon={<CiEdit />}
                      bgColor={"bg-green-500 hover:bg-green-800"}
                    />
                    <ActionButton
                      title={"Delete"}
                      id={item.id}
                      setAction={setIsModalOpen}
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
        <PayoutSmsView
          viewPayoutMethodSms={viewPayoutMethodSms}
          setViewPayoutMethodSms={setViewPayoutMethodSms}
        />
        <PayoutPaymentMethodEdit
          setPayoutPaymentMethodEdit={setPayoutPaymentMethodEdit}
          payoutPaymentMethodEdit={payoutPaymentMethodEdit}
          setAllData={setAllData}
        />
        <DeleteItem
          deleteItem={isModalOpen}
          setDeleteItem={setIsModalOpen}
          handleDeleteItem={handleDeleteWithdraw}
          text="payment method"
          loading={loadingDelete}
        />
      </div>
    </section>
  );
}

export default PayoutPaymentMethod;

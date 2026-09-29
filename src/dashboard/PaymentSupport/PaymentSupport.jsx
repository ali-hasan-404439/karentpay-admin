import { useState } from "react";
import SearchInputField from "../../components/SearchInputField";
import TitleDynamic from "../../TitleDynamic";
import { IoMdAdd } from "react-icons/io";
import AddPayment from "./AddPayment";
import useFetchData from "../../utils/useFetchData";
import moment from "moment";
import DeleteItem from "../../components/DeleteItem";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Table from "../../components/Table";
import { MdDelete } from "react-icons/md";
import ActionButton from "../../components/ActionButton";
import TableFooter from "../../components/TableFooter";

function PaymentSupport() {
  const headers = [
    "Date",
    "Payment Icon",
    "Name",
    "Country",
    "Active",
    "Action",
  ];
  const [searchPaymentSupport, setSearchPaymentSupport] = useState("");
  const [paymentSupportDelete, setPaymentSupportDelete] = useState("");

  const [addPayment, setAddPayment] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const { data, setRender } = useFetchData("/admin/payment-gateways");

  const handleStatusChange = async (is_active, item) => {
    if (!item?.id) return;

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("gateway_name", item?.gateway_name);
    formData.append("logo", item?.logo);
    formData.append("country_name", item?.country_name);
    formData.append("is_active", is_active ? 1 : 0);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/payment-gateways/${item.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setRender(true);
      toast.success("Payment support status updated successfully.");
    } catch (error) {
      toast.error(
        "Filed to status updated payment support. please again later. "
      );
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    setLoadingDelete(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/payment-gateways/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setRender(true);
      setPaymentSupportDelete("");
      toast.success("Payment support delete successfully.");
    } catch (error) {
      toast.error("Filed to delete payment support. please again later.");
    }
    setLoadingDelete(false);
  };

  const handleSearchPayment = (array, searchPayment) => {
    let searchPaymentData = array;

    if (searchPayment) {
      searchPaymentData = array?.filter(
        ({ gateway_name }) =>
          gateway_name && gateway_name.toLowerCase().includes(searchPayment.toLowerCase())
      );
    }

    return searchPaymentData;
  };

  const searchPayment = handleSearchPayment(data, searchPaymentSupport);
  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = searchPayment?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchPayment.length / ItemsPerPage);

  return (
    <section className="boxShadow-table bg-white dark:bg-[#1F2836]">
      <TitleDynamic title="Payment Support" />
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-6 pb-8 w-full">
        {/* search merchant email and amount start  */}
        <SearchInputField
          searchText={searchPaymentSupport}
          setSearchText={setSearchPaymentSupport}
          placeholderText="Search Payment Name"
        />
        <button
          onClick={() => setAddPayment(!addPayment)}
          className="button_gradient w-full md:w-auto"
        >
          <IoMdAdd size={20} />
          Add Payment
        </button>
      </div>
      {/* add payment end  */}
      {addPayment && (
        <AddPayment
          addPayment={addPayment}
          setAddPayment={setAddPayment}
          setRender={setRender}
        />
      )}

      <Table headers={headers}>
        {currentItems?.map((item, index) => (
          <tr key={index} className="table_tr">
            <td className="px-6 py-4 whitespace-nowrap">
              {moment(item.updated_at).format("DD MMM YYYY")}
            </td>
            <td className="p-4 whitespace-nowrap">
              {item.logo && (
                <img
                  src={item?.logo}
                  alt={item?.gateway_name}
                  className="w-16  object-fill"
                />
              )}
            </td>
            <td className="p-4 whitespace-nowrap">{item.gateway_name}</td>
            <td className="p-4 ">{item.country_name}</td>
            <td className="p-4">
              <label
                htmlFor={`toggle-${item.id}`}
                className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${item.is_active == 1 ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
              >
                <input
                  type="checkbox"
                  id={`toggle-${item.id}`}
                  className="peer sr-only"
                  checked={item.is_active == 1 ? true : false}
                  onChange={(e) => {
                    handleStatusChange(e.target.checked, item);
                  }}
                />
                <span
                  className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                ></span>
              </label>
            </td>

            <td className="px-6 py-4 w-[100px]">
              <div className="flex items-center gap-2">
                <ActionButton
                  id={item?.id}
                  setAction={setPaymentSupportDelete}
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
        totalItems={searchPayment?.length || 0}
        perPage={ItemsPerPage}
        setPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPages || 0}
      />
      <DeleteItem
        deleteItem={paymentSupportDelete}
        setDeleteItem={setPaymentSupportDelete}
        handleDeleteItem={handleDelete}
        text="Payment Support"
        loading={loadingDelete}
      />
    </section>
  );
}

export default PaymentSupport;

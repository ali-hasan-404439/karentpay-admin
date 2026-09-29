import TitleDynamic from "../../TitleDynamic";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { IoClose } from "react-icons/io5";
import moment from "moment";
import DeleteItem from "../../components/DeleteItem";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import SearchInputField from "../../components/SearchInputField";
import Table from "../../components/Table";
import TableFooter from "../../components/TableFooter";
import ActionButton from "../../components/ActionButton";
import { MdDelete } from "react-icons/md";

moment().format();
function DashboardEmail() {
  const headers = ["Sl", "Date", "Name", "Phone", "Email", "Message", "Action"];

  const [searchReview, setSearchReview] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(null);

  const [total, setTotal] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const [email, setEmail] = useState([]);

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
    getAllEmail();
  }, [currentPage]);
  const getAllEmail = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST
        }/admin/contacts?page=${currentPage}&per_page=${ItemsPerPage}&search=${searchReview}`,
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
      setEmail(response.data?.data);
    } catch (err) {
      // console.log(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    setCurrentPage(1);
    getAllEmail();
  }, [ItemsPerPage, searchReview]);

  const handleDeleteEmail = async (id) => {
    const token = Cookies.get("token");
    setLoadingDelete(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/contacts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/contacts?page=${currentPage}&per_page=${ItemsPerPage}`,
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
        setEmail(response.data?.data);
      } catch (err) {
        // console.log(err);
      }
      toast.success("Email deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete email. Please try again.");
    }
    setLoadingDelete(false);
    setIsModalOpen(null);
  };

  return (
    <div className="boxShadow-table relative overflow-hidden bg-[#FFFFFF] dark:bg-gray-800 rounded-[4px] mb-5 text-black dark:text-white">
      <TitleDynamic title="Email" />

      <div className="flex items-center gap-2 px-5 py-6">
        <SearchInputField
          searchText={searchReview}
          setSearchText={setSearchReview}
          placeholderText="Search Name And Phone..."
        />
      </div>

      <Table headers={headers}>
        {loading
          ? Array.from({ length: ItemsPerPage }).map((_, index) => (
            <tr
              key={index}
              className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <td className="px-4 py-2">
                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="p-4 px-6 py-4 text-sm  text-gray-900 whitespace-nowrap dark:text-white">
                <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
              </td>
              <td className="p-4 px-6 py-4 whitespace-nowrap">
                <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="p-4 px-6 py-4 whitespace-nowrap">
                <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="p-4 px-6 py-4 whitespace-nowrap">
                <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="p-4 px-6 py-4 overflow-hidden whitespace-nowrap text-ellipsis">
                <div className="w-60 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="w-16 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
            </tr>
          ))
          : email.map((item, index) => (
            <tr
              key={index}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="px-6 py-2 w-[50px] whitespace-nowrap">
                {total?.totalItems -
                  ((currentPage - 1) * ItemsPerPage + index)}
              </td>
              <td className="p-4 w-[150px] whitespace-nowrap">
                {item.created_at && moment(new Date(item.created_at)).format("DD MMM YYYY")}
                <br />
                {item.created_at && moment(new Date(item.created_at)).format("h:mm a")}
              </td>
              <td className="p-4 w-[200px]">
                <Link to={`/email/details/${item.id}`}>{item.name}</Link>
              </td>
              <td className="p-4 w-[150px] whitespace-nowrap">
                <Link to={`/email/details/${item.id}`}>{item.phone}</Link>
              </td>
              <td className="p-4">
                <Link to={`/email/details/${item.id}`}>{item.email}</Link>
              </td>

              <td className="p-4" style={{ maxWidth: "400px" }}>
                <Link to={`/email/details/${item.id}`}>
                  {item?.message?.length > 100
                    ? item.message.substring(0, 100) + "..."
                    : item.message}
                </Link>
              </td>

              <td className="p-4 text-center">
                <ActionButton
                  title={"Delete"}
                  id={item.id}
                  setAction={setIsModalOpen}
                  icon={<MdDelete />}
                  bgColor={"bg-red-500 hover:bg-red-800"}
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
        deleteItem={isModalOpen}
        setDeleteItem={setIsModalOpen}
        handleDeleteItem={handleDeleteEmail}
        text="Email"
        loading={loadingDelete}
      />
    </div>
  );
}

export default DashboardEmail;

import TitleDynamic from "../../TitleDynamic";

import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";

import AddReviewModel from "./AddReviewModel";
import ReviewView from "./ReviewView";
import DashboardReviewEdit from "./DashboardReviewEdit";
import SearchInputField from "../../components/SearchInputField";
import Table from "../../components/Table";
import DeleteItem from "../../components/DeleteItem";

//  import time formate package
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import TableFooter from "../../components/TableFooter";
import ActionButton from "../../components/ActionButton";
import { MdDelete } from "react-icons/md";
moment().format();

function DashboardReview() {
  const headers = [
    "Sl",
    "Date",
    "User Info / Merchant Info",
    "Review Details",
    "Status",
    "Action",
  ];
  // search merchant transaction id and Reference store state
  const [search, setSearch] = useState("");
  const [addReview, setAddReview] = useState(false);
  const [reviewEditModalOpen, setReviewEditModalOpen] = useState("");
  const [reviewDeleteModalOpen, setReviewDeleteModalOpen] = useState("");
  const [reviewVieModalOpen, setReviewViewModalOpen] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  const [total, setTotal] = useState({});
  const [data, setData] = useState([]);
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
    setRender(true);
  }, [search, ItemsPerPage]);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        setLoading(true);
        try {
          const response = await axios.get(
            import.meta.env.VITE_API_HOST +
            `/admin/reviews?search=${search}&page=${currentPage}&per_page=${ItemsPerPage}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTotal({
            totalItems: response?.data.total,
            totalPage: response?.data.last_page,
          });
          setData(response.data.data);
        } catch (err) {
          // console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    setRender(false);
    fetchData();
  }, [render, currentPage]);
  const handleDeleteReview = async (id) => {
    setDeleteLoading(true);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/reviews/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_HOST +
          `/admin/reviews?&page=${currentPage}&per_page=${ItemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalItems: response?.data.total,
          totalPage: response?.data.last_page,
        });
        setData(response.data.data);
      } catch (err) {
        // console.error('Error fetching data:', err);
      }
      toast.success("Review deleted successfully.");
    } catch (error) {
      toast.error("Filed to delete review, Please try again.");
    }
    setDeleteLoading(false);
    setReviewDeleteModalOpen(false);
  };

  return (
    <div className="boxShadow-table bg-white dark:bg-[#1F2836]">
      <TitleDynamic title="Review" />

      <div className="flex flex-wrap md:items-center gap-2 px-5 py-6">
        <SearchInputField
          searchText={search}
          setSearchText={setSearch}
          placeholderText="Search Name Or Email..."
        />
        <button
          onClick={() => setAddReview(!addReview)}
          className="button_gradient whitespace-nowrap w-full md:w-auto"
        >
          Add Review
        </button>
        <AddReviewModel
          addReview={addReview}
          setAddReview={setAddReview}
          ItemsPerPage={ItemsPerPage}
          currentPage={currentPage}
          setItemsData={setData}
          setTotal={setTotal}
        />
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
                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </td>
              <td
                className="flex items-center gap-2 px-4 py-2 whitespace-nowrap"
                style={{ width: "250px" }}
              >
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </td>
              <td className="px-4 py-2 ">
                <div className="w-[600px] h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-4 py-2 ">
                <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </td>
            </tr>
          ))
          : data?.map((item, index) => (
            <tr
              key={index}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="py-4 px-6 w-[50px] whitespace-nowrap">

                {total?.totalItems -
                  ((currentPage - 1) * ItemsPerPage + index)}
              </td>
              <td className="p-4 whitespace-nowrap">
                {item.created_at && moment(item.created_at).format("DD MMM YYYY")}
                <br />
                {item.created_at && moment(item.created_at).format("h:mm a")}
              </td>
              <td scope="row" className="p-4 cursor-pointer min-w-[370px]">
                <div
                  onClick={() => setSearch(item.user_name)}
                  className="cursor-pointer flex gap-2 p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold"
                >
                  <img
                    src={item.user_image}
                    alt=""
                    className="w-8 h-8 rounded-full object-fill"
                  />
                  <div>
                    <h2>{item.user_name}</h2>
                    <p className="font-normal">
                      {item.user_email?.length > 30
                        ? item.user_email.slice(0, 30) + ".."
                        : item.user_email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-4 ">
                <h2
                  className="flex items-center w-full"
                  style={{ width: "600px" }}
                >
                  {item.review_details.length > 150
                    ? item.review_details.slice(0, 150) + "...."
                    : item.review_details}
                </h2>
              </td>
              <td className="p-4">
                <div
                  className={`px-2 py-0.5 rounded border border-dotted flex items-center cursor-pointer transition-colors duration-200 gap-2 w-fit ${{
                    approved:
                      "bg-green-600 hover:bg-green-800 text-white border-green-800",
                    pending:
                      "bg-[#ff7654] hover:bg-[#da5737] text-white border-[#ff7654]",
                    failed:
                      "bg-red-600 hover:bg-red-800 text-white border-red-800",
                    rejected:
                      "bg-[#ff1d1d] hover:bg-[#d63737] text-white border-[#ff1d1d]",
                  }[item.status] ||
                    "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400"
                    }`}
                >
                  {item?.status?.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                </div>
              </td>

              <td className="p-4 ">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item}
                    setAction={setReviewViewModalOpen}
                    title={"View"}
                    icon={<FaEye />}
                    bgColor={"bg-blue-500 hover:bg-blue-800"}
                  />
                  <ActionButton
                    id={item}
                    setAction={setReviewEditModalOpen}
                    title={"Edit"}
                    icon={<CiEdit />}
                    bgColor={"bg-green-500 hover:bg-green-800"}
                  />
                  <ActionButton
                    id={item?.id}
                    setAction={setReviewDeleteModalOpen}
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
      <ReviewView
        setReviewViewModalOpen={setReviewViewModalOpen}
        reviewVieModalOpen={reviewVieModalOpen}
      />
      <DashboardReviewEdit
        setReviewEditModalOpen={setReviewEditModalOpen}
        reviewEditModalOpen={reviewEditModalOpen}
        setItemsData={setData}
      />

      <DeleteItem
        deleteItem={reviewDeleteModalOpen}
        setDeleteItem={setReviewDeleteModalOpen}
        handleDeleteItem={handleDeleteReview}
        text="Review"
        loading={deleteLoading}
      />
    </div>
  );
}

export default DashboardReview;

import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

import TitleDynamic from "../../TitleDynamic";
import SearchInputField from "../../components/SearchInputField";
import Table from "../../components/Table";
import AddPost from "./AddPost";
import AllPostEdit from "./AllPostEdit";
import DeleteItem from "../../components/DeleteItem";
import TableFooter from "../../components/TableFooter";
import ActionButton from "../../components/ActionButton";

import moment from "moment";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import FilterStatus from "../../components/FilterStatus";
import useFetchData from "../../utils/useFetchData";

function AllPost() {
  const headers = [
    "Sl",
    "Date",
    "Images",
    "Category",
    "Title",
    "Details",
    "Active",
    "Action",
  ];
  const [addPostModal, setAddPostModal] = useState(false);
  const [searchNews, setSearchNews] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [postDelete, setPostDelete] = useState(null);
  const [newsAllPostViewModalOpen, setNewsAllPostViewModalOpen] =
    useState(null);

  const [showMerchantStatus, setShowMerchantStatus] = useState(false);
  const [searchMerchantStatus, setSearchMerchantStatus] = useState("");
  const token = Cookies.get("token");

  const [render, setRender] = useState(false);
  const [data, setData] = useState([]);

  const [total, setTotal] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

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
    getArticles();
  }, [currentPage]);
  const getArticles = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST
        }/admin/news/articles?page=${currentPage}&per_page=${ItemsPerPage}&search=${searchNews}&category_name=${searchMerchantStatus ? searchMerchantStatus?.name : ""
        }`,
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
      setData(response.data?.data);
    } catch (err) {
      // console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    getArticles();
  }, [ItemsPerPage, searchNews, searchMerchantStatus]);

  const postStatusChange = async (e, item) => {
    if (!token) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_HOST}/admin/news/articles/status/${item.id
        }`,
        {
          status: e === true ? 1 : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) => {
        return prevData.map((data) => {
          if (data.id === item.id) {
            return { ...data, status: e === true ? 1 : 0 };
          }
          return data;
        });
      })
      toast.success("Post status updated successfully");
    } catch (err) {
      toast.error("Failed to update post status");
    }
  };

  const handleDeletePost = async (id) => {
    if (!id && !token) return;
    setDeleteLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/news/articles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/news/articles?page=${currentPage}&per_page=${ItemsPerPage}`,
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
        setData(response.data?.data);
      } catch (err) {
        // console.log(err);
      }
      toast.success("Delete post category success !");
    } catch (error) {
      toast.error("Filed to delete post, Please try again later.");
    }
    setPostDelete(null);
    setDeleteLoading(false);
  };

  const categoriesData = useFetchData("/admin/news/categories");
  const { data: categories } = categoriesData?.data;

  // Close on click outside
  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (!event.target.closest("#setSearchMerchantStatus")) {
        setShowMerchantStatus(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideSearch);
    return () => {
      window.document.removeEventListener("click", handleClickOutsideSearch);
    };
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <TitleDynamic title="All Post" />

      <div className="relative  bg-white  boxShadow-table dark:bg-gray-800 rounded-[4px]">
        <div className="items-center justify-between px-5 py-6 flex flex-wrap gap-y-2 w-full">
          <div className="flex flex-wrap items-center gap-2  w-full md:w-auto">
            <SearchInputField
              searchText={searchNews}
              setSearchText={setSearchNews}
              placeholderText="Search Title And Details..."
            />
            <FilterStatus
              showMerchantStatus={showMerchantStatus}
              setShowMerchantStatus={setShowMerchantStatus}
              setSearchMerchantStatus={setSearchMerchantStatus}
              searchMerchantStatus={
                searchMerchantStatus?.name?.length > 20
                  ? searchMerchantStatus?.name?.slice(0, 20) + "..."
                  : searchMerchantStatus?.name
              }
              id="setSearchMerchantStatus"
              placeholderText="Status..."
            >
              {categories?.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                  onClick={() => setSearchMerchantStatus(item)}
                >
                  <span> {item.name}</span>
                </div>
              ))}
            </FilterStatus>
          </div>

          <AddPost
            addPostModal={addPostModal}
            setAddPostModal={setAddPostModal}
            setTotal={setTotal}
            setData={setData}
            ItemsPerPage={ItemsPerPage}
            currentPage={currentPage}
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
                <td className="p-4">
                  <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                </td>

                <td className="p-4">
                  <div className="w-20 h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>

                <td className="p-4 whitespace-nowrap">
                  <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>

                <td className="p-4">
                  <div className="w-72 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>

                <td className="p-4">
                  <div className="w-96 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-4">
                  <div className="w-10 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>

                <td className="px-4 py-2 text-center flex items-center gap-2 flex-1">
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))
            : data.map((item, index) => (
              <tr
                key={item.id}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="px-6 w-[50px] py-4">
                  {total?.totalItems -
                    ((currentPage - 1) * ItemsPerPage + index)}
                </td>

                <td className="p-4 whitespace-nowrap">
                  {item.created_at && moment(new Date(item.created_at)).format("DD MMM YYYY")}
                  <br />
                  {item.created_at && moment(new Date(item.created_at)).format("h:mm a")}
                </td>


                <td className="p-4">
                  <img
                    src={item?.featured_image}
                    alt={item?.title}
                    className="w-24 object-fill"
                  />
                </td>
                <td className="p-4  whitespace-nowrap">
                  {item?.category?.name}
                </td>

                <td className="p-4 min-w-[300px]">
                  {item.title?.length > 100
                    ? item.title.slice(0, 100) + "..."
                    : item.title}
                </td>
                <td className="p-4 min-w-[400px]">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        item?.content?.length > 200
                          ? item?.content.slice(0, 200) + "..."
                          : item.content,
                    }}
                  ></div>
                </td>
                <td className="p-4">
                  <label
                    className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${item.status === 1 ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={item.status === 1}
                      onChange={(e) => {
                        postStatusChange(e.target.checked, item);
                      }}
                    />
                    <span
                      className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                    ></span>
                  </label>
                </td>
                <td className="p-4">
                  <div className=" flex items-center gap-2">
                    <ActionButton
                      id={item}
                      setAction={setNewsAllPostViewModalOpen}
                      title={"Edit"}
                      icon={<CiEdit />}
                      bgColor={"bg-green-500 hover:bg-green-800"}
                    />
                    <ActionButton
                      id={item?.id}
                      setAction={setPostDelete}
                      title={"Delete"}
                      icon={<MdDelete />}
                      bgColor={"bg-red-500 hover:bg-red-800"}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </Table>

        <AllPostEdit
          setNewsAllPostViewModalOpen={setNewsAllPostViewModalOpen}
          newsAllPostViewModalOpen={newsAllPostViewModalOpen}
          setData={setData}
        />
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
        text="Post"
        deleteItem={postDelete}
        setDeleteItem={setPostDelete}
        handleDeleteItem={handleDeletePost}
        loading={deleteLoading}
      />
    </section>
  );
}

export default AllPost;

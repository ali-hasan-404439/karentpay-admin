import { useEffect, useState } from "react";

import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

import TitleDynamic from "../../TitleDynamic";
import SearchInputField from "../../components/SearchInputField";
import Table from "../../components/Table";
import ActionButton from "../../components/ActionButton";
import PostCategoriesAdd from "./PostCategoriesAdd";
import PostCategoriesEdit from "./PostCategoriesEdit";
import DeleteItem from "../../components/DeleteItem";
import TableFooter from "../../components/TableFooter";

import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

function PostCategories() {
  const headers = ["Sl", "Date", "Category Name", "Action"];
  // search merchant transaction id and Reference store state
  const [searchPostCategories, setSearchPostCategories] = useState("");
  const [deletePost, setDeletePost] = useState(null);
  const [addPostModal, setAddPostModal] = useState(false);
  const [postCategoryEdit, setPostCategoryEdit] = useState("");
  const [loadingItem, setLoadingItem] = useState(false);

  const [total, setTotal] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const [postCategories, setPostCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);

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
    getPostCategories();
  }, [ItemsPerPage, searchPostCategories]);

  useEffect(() => {
    getPostCategories();
  }, [currentPage]);

  const getPostCategories = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST
        }/admin/news/categories?page=${currentPage}&per_page=${ItemsPerPage}&name=${searchPostCategories}`,
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
      setPostCategories(response.data?.data);
    } catch (err) {
      // console.log(err);
    }
    setLoading(false);
  };
  // delete category function
  const handlePostCategoryDelete = async (id) => {
    if (!id && !token) return;
    setLoadingItem(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/news/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/news/categories?page=${currentPage}&per_page=${ItemsPerPage}`,
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
        setPostCategories(response.data?.data);
      } catch (err) {
        // console.log(err);
      }
      toast.success("Post category deleted successfully!");
    } catch (error) {
      toast.success("Filed to delete post category, Please try again later.");
    }
    setDeletePost(null);
    setLoadingItem(false);
  };

  return (
    <section>
      <div className=" bg-white dark:bg-gray-800 rounded-[4px] mb-5">
        <TitleDynamic title="Post Category" />

        <div className="flex items-center flex-wrap  gap-2 py-6 px-5 md:mb-0">
          <SearchInputField
            searchText={searchPostCategories}
            setSearchText={setSearchPostCategories}
            placeholderText="Search Category Name..."
          />
          <button
            onClick={() => setAddPostModal(!addPostModal)}
            className="button_gradient whitespace-nowrap w-full md:w-fit"
          >
            Add New Category
          </button>
          <PostCategoriesAdd
            setAddPostModal={setAddPostModal}
            addPostModal={addPostModal}
            setPostCategories={setPostCategories}
            setTotal={setTotal}
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
                <td className="px-6 py-4">
                  <div className="w-10 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-4">
                  <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                </td>
                <td className="p-4">
                  <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
                <td className="p-4 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))
            : postCategories?.map((item, index) => (
              <tr
                key={item.id}
                data-testid="table-row-element"
                className="table_tr"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {total?.totalItems -
                    ((currentPage - 1) * ItemsPerPage + index)}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {item.created_at
                    ? moment(new Date(item.created_at)).format("DD MMM YYYY")
                    : ""}
                  <br />
                  {item.created_at
                    ? moment(new Date(item.created_at)).format("h:mm a")
                    : ""}
                </td>
                <td className="p-4 whitespace-nowrap">{item?.name}</td>
                <td className="p-4 flex-1">
                  <div className=" flex items-center gap-2">
                    <ActionButton
                      id={item}
                      setAction={setPostCategoryEdit}
                      title={"Edit"}
                      icon={<CiEdit />}
                      bgColor={"bg-green-500 hover:bg-green-800"}
                    />
                    <ActionButton
                      id={item?.id}
                      setAction={setDeletePost}
                      title={"Delete"}
                      icon={<MdDelete />}
                      bgColor={"bg-red-500 hover:bg-red-800"}
                    />
                  </div>

                  <PostCategoriesEdit
                    editPostModal={postCategoryEdit}
                    setEditPostModal={setPostCategoryEdit}
                    setPostCategories={setPostCategories}
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
      </div>

      <DeleteItem
        deleteItem={deletePost}
        setDeleteItem={setDeletePost}
        handleDeleteItem={handlePostCategoryDelete}
        loading={loadingItem}
        text="post category"
      />
    </section>
  );
}

export default PostCategories;

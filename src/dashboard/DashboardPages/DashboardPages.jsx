import { useEffect, useState } from "react";

import { MdDelete } from "react-icons/md";

import TitleDynamic from "../../TitleDynamic";
import AddPage from "./AddPage";
import EditPage from "./EditPage";
import SearchInputField from "../../components/SearchInputField";

import moment from "moment";
import Table from "../../components/Table";
import DeleteItem from "../../components/DeleteItem";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import ActionButton from "../../components/ActionButton";
import { CiEdit } from "react-icons/ci";
import { useLocation } from "react-router-dom";
import TableFooter from "../../components/TableFooter";

function DashboardPages() {
  const headers = ["Sl", "Date", "Page Name", "Description", "Action"];

  const [search, setSearch] = useState("");
  const [addPageModal, setAddPageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(false);

  const [editPageModalOpen, setEditPageModalOpen] = useState(null);
  // handle delete page function start

  const [pagesDeleteModalOpen, setPagesDeleteModalOpen] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
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
            `/admin/pages?search=${search}&page=${currentPage}&per_page=${ItemsPerPage}`,
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

  const handleeDeletePage = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/pages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_HOST +
          `/admin/pages?page=${currentPage}&per_page=${ItemsPerPage}`,
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
      setPagesDeleteModalOpen(null);
      toast.success("Delete page successfully!");

    } catch (error) {
      toast.error("Filed to delete page. Please try again.");
    }
    setDeleteLoading(false);
  };

  return (
    <div className="text-black bg-white boxShadow-table dark:bg-gray-800 dark:text-white">
      <TitleDynamic title="Pages" />
      <div className="items-center gap-2 px-5 py-6 flex flex-wrap">
        <SearchInputField
          searchText={search}
          setSearchText={setSearch}
          placeholderText="Search Page Name.."
        />
        <AddPage
          addPageModal={addPageModal}
          setAddPageModal={setAddPageModal}
          currentPage={currentPage}
          ItemsPerPage={ItemsPerPage}
          setData={setData}
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
              {/* Skeleton loader for row index */}
              <td className="py-2 pl-6 pr-4 whitespace-nowrap">
                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for date and time */}
              <td className="p-4 whitespace-nowrap">
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </td>
              {/* Skeleton loader for page name */}
              <td className="p-4">
                <div className="w-[150px] h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for content */}
              <td className="p-4">
                <div className="w-[150px] h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for action buttons */}
              <td className="p-4 flex-1 w-[150px]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </td>
            </tr>
          ))
          : data?.map((item, index) => (
            <tr
              key={item.id}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="py-4 px-6 w-[50px] whitespace-nowrap">
                {total?.totalItems -
                  ((currentPage - 1) * ItemsPerPage + index)}
              </td>
              <td className="p-4 whitespace-nowrap">
                {item.created_at
                  ? moment(new Date(item.created_at)).format("DD MMM YYYY")
                  : "--"}
                <br />
                {item.created_at
                  ? moment(new Date(item.created_at)).format("h:mm a")
                  : "--"}
              </td>
              <td className="p-4 whitespace-nowrap">
                {item.page_name}
              </td>
              <td className="p-4 min-w-[400px] md:w-[700px]">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      item.content.length > 300
                        ? item.content.slice(0, 300) + "..."
                        : item.content,
                  }}
                ></div>
              </td>

              <td className="p-4 flex-1 w-[150px]">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item}
                    setAction={setEditPageModalOpen}
                    title={"Edit"}
                    icon={<CiEdit />}
                    bgColor={"bg-green-500 hover:bg-green-800"}
                  />
                  <ActionButton
                    id={item?.id}
                    setAction={setPagesDeleteModalOpen}
                    title={"Delete"}
                    icon={<MdDelete />}
                    bgColor={"bg-red-500 hover:bg-red-800"}
                  />
                </div>
              </td>
            </tr>
          ))}
      </Table>
      <EditPage
        editPageModalOpen={editPageModalOpen}
        setEditPageModalOpen={setEditPageModalOpen}
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

      <DeleteItem
        deleteItem={pagesDeleteModalOpen}
        setDeleteItem={setPagesDeleteModalOpen}
        handleDeleteItem={handleeDeletePage}
        text="Page"
        loading={deleteLoading}
      />
    </div>
  );
}
export default DashboardPages;

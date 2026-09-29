import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";

import AddDocumentation from "./AddDocumentation";
import DocumentationEdit from "./DocumentationEdit";
import SearchInputField from "../../components/SearchInputField";
import axios from "axios";
import Cookies from "js-cookie";
import Table from "../../components/Table";
import DeleteItem from "../../components/DeleteItem";
import { toast } from "react-toastify";
import TitleDynamic from "../../TitleDynamic";
import { useLocation } from "react-router-dom";
import TableFooter from "../../components/TableFooter";
import { MdDelete } from "react-icons/md";
import ActionButton from "../../components/ActionButton";
import Auth from "../../utils/Auth";

function Documentation() {
  const headers = ["Sl", "Title", "Description", "Action"];
  const { ApiRequest } = Auth();
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(null);
  const [documentationModel, setDocumentationModel] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const token = Cookies.get("token");

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
    fetchData();
  }, [search, ItemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);
  const fetchData = async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_HOST +
          `/merchant/get_documentation_admin?search=${search}&page=${currentPage}&per_page=${ItemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalItems: response?.data?.data.total,
          totalPage: response?.data?.data.last_page,
        });
        setData(response.data.data.data);
      } catch (err) {
        // console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteDoc = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/documentation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_HOST +
          `/merchant/get_documentation_admin?page=${currentPage}&per_page=${ItemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalItems: response?.data?.data.total,
          totalPage: response?.data?.data.last_page,
        });
        setData(response.data.data.data);
      } catch (err) {
        // console.error('Error fetching data:', err);
      }
      toast.success("Documentation deleted successfully");
    } catch (error) {
      toast.error("Filed to delete documentation. please try again later.");
    }
    setDeleteModalOpen(false);
    setDeleteLoading(false);
  };

  const getSingleDocumentation = async (id) => {
    try {
      const response = await ApiRequest({
        url: `/get_documentation/${id}`,
        method: "GET",
      });
      setEditModalOpen(response?.data);
    } catch (error) {
      // console.error("Error fetching documentation:", error);
    }
  };
  return (
    <div className="boxShadow-table relative bg-white dark:bg-gray-800 rounded-[4px] mb-4">
      <TitleDynamic title="Documentation" />
      <div className="px-5 py-6">
        <div className="flex flex-wrap items-center gap-2 w-full">
          <SearchInputField
            searchText={search}
            setSearchText={setSearch}
            placeholderText="Search Title..."
          />

          <AddDocumentation
            documentationModel={documentationModel}
            setDocumentationModel={setDocumentationModel}
            setData={setData}
            setTotal={setTotal}
            ItemsPerPage={ItemsPerPage}
            currentPage={currentPage}
          />
        </div>
      </div>

      <Table headers={headers}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
            <tr
              key={index}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="relative p-4 px-6 py-4 whitespace-nowrap">
                <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="p-4 px-6 py-4 overflow-hidden text-base text-gray-900 truncate dark:text-white xl:max-w-screen-md 2xl:max-w-screen-lg">
                <div className="w-72 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              <td className="relative p-4 px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
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
              <td className="px-6 w-[50px] py-4 whitespace-nowrap ">
                {total?.totalItems -
                  ((currentPage - 1) * ItemsPerPage + index)}
              </td>
              <td className="relative p-4">{item.title}</td>

              <td className="p-4 " style={{ width: "60rem" }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      item?.description?.length > 200
                        ? item?.description.slice(0, 200) + "..."
                        : item.description,
                  }}
                ></div>
              </td>

              <td className="relative p-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item?.id}
                    setAction={getSingleDocumentation}
                    title={"Edit"}
                    icon={<CiEdit />}
                    bgColor={"bg-green-500 hover:bg-green-800"}
                  />
                  <ActionButton
                    id={item?.id}
                    setAction={setDeleteModalOpen}
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
      <DocumentationEdit
        setEditModalOpen={setEditModalOpen}
        editModalOpen={editModalOpen}
        setData={setData}
      />
      <DeleteItem
        deleteItem={deleteModalOpen}
        setDeleteItem={setDeleteModalOpen}
        handleDeleteItem={handleDeleteDoc}
        text="Documentation"
        loading={deleteLoading}
      />
    </div>
  );
}

export default Documentation;

import React, { useEffect, useState } from "react";
import TitleDynamic from "../../../TitleDynamic";
import { CiEdit } from "react-icons/ci";
//  import time formate package
import moment from "moment";
import WhyEdit from "./WhyEdit";
import WhyAdd from "./WhyAdd";
import SearchInputField from "../../../components/SearchInputField";
import Table from "../../../components/Table";
import DeleteItem from "../../../components/DeleteItem";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import TableFooter from "../../../components/TableFooter";
import ActionButton from "../../../components/ActionButton";
import { MdDelete } from "react-icons/md";
moment().format();

function Whyus() {
  const hearers = ["Sl", "Image", "Title", "Description", "Action"];
  const [searchWhy, setSearchWhy] = useState("");

  const [whyAddedModalOpen, setWhyAddedModalOpen] = useState(false);
  const [whyEditModalOpen, setWhyEditModalOpen] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [whyDeleteModalOpen, setWhyDeleteModalOpen] = useState("");

  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whyUsData, setWhyUsData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const token = Cookies.get("token");
  useEffect(() => {
    getWhyUsData();
  }, []);
  const getWhyUsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/payment-feature-showcases`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWhyUsData(response?.data);
    } catch (err) {
      // console.error("Error fetching data:", err);
    }
    setLoading(false);
  }
  useEffect(() => {
    setCurrentPage(1);
  }, [ItemsPerPage, searchWhy]);
  // search function  review start
  function handleSearchWhyFunction(data, searchWhy) {
    let searchWhyFunction = data;

    if (searchWhy) {
      searchWhyFunction = data?.filter(
        ({ title }) =>
          title && title.toLowerCase().includes(searchWhy.toLowerCase())
      );
    }

    return searchWhyFunction;
  }
  const searchWhyFunction = handleSearchWhyFunction(whyUsData, searchWhy);

  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = searchWhyFunction?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(searchWhyFunction.length / ItemsPerPage);

  const handleDeleteWhy = async (id) => {
    if (!id && !token) return;
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST
        }/admin/payment-feature-showcases/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/admin/payment-feature-showcases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWhyUsData(response?.data);
      } catch (err) {
        // console.error("Error fetching data:", err);
      }
      toast.success("Why us delete successfully!");
    } catch (error) {
      toast.error("Filed to delete why us. Please try again");
    }
    setDeleteLoading(false);
    setWhyDeleteModalOpen("");
  };

  return (
    <div className="boxShadow-table bg-white dark:bg-[#1F2836] relative">
      <TitleDynamic title="Why us" />
      <div className="flex flex-wrap w-full items-center gap-2 px-5 py-6">
        <SearchInputField
          searchText={searchWhy}
          setSearchText={setSearchWhy}
          placeholderText="Search Title..."
        />

        <button
          onClick={() => setWhyAddedModalOpen(!whyAddedModalOpen)}
          className="button_gradient whitespace-nowrap w-full md:w-auto"
        >
          Add Why choose
        </button>

        <WhyAdd
          whyAddedModalOpen={whyAddedModalOpen}
          setWhyAddedModalOpen={setWhyAddedModalOpen}
          setWhyUsData={setWhyUsData}
        />

        <WhyEdit
          setWhyEditModalOpen={setWhyEditModalOpen}
          whyEditModalOpen={whyEditModalOpen}
          setWhyUsData={setWhyUsData}
        />
      </div>
      <Table headers={hearers}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
            <tr
              key={index}
              data-testid="table-row-element"
              className="table_tr"
            >
              {/* Skeleton loader for row index */}
              <td className="p-4 whitespace-nowrap">
                <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for image */}
              <td className="p-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </td>
              {/* Skeleton loader for title */}
              <td className="p-4">
                <div className="w-48 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for description */}
              <td className="p-4">
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for buttons */}
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </td>
            </tr>
          ))
          : currentItems?.map((item, index) => (
            <tr
              key={index}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="px-6 py-4 w-[50px] whitespace-nowrap">
                {searchWhyFunction?.length -
                  ((currentPage - 1) * ItemsPerPage + index)}</td>
              <td className="p-4 ">
                <img
                  className="w-10 h-10 rounded-md"
                  src={
                    item.image
                      ? item.image
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1SUJxGrRAinWDNX-bL1hYT9OSHsaTJZaErw&s"
                  }
                  alt="logo"
                />
              </td>
              <td className="p-4 whitespace-nowrap" style={{ width: "250px" }}>
                {item.title}
              </td>
              <td className="p-4 " style={{ minWidth: "400px", maxWidth: "700px" }}>
                <h2 className="flex items-center w-full">
                  {item.description.length > 380
                    ? item.description.slice(0, 380) + "...."
                    : item.description}
                </h2>
              </td>
              <td className="p-4 ">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item}
                    setAction={setWhyEditModalOpen}
                    title={"Edit"}
                    icon={<CiEdit />}
                    bgColor={"bg-green-500 hover:bg-green-800"}
                  />
                  <ActionButton
                    id={item?.id}
                    setAction={setWhyDeleteModalOpen}
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
        totalItems={searchWhyFunction?.length || 0}
        perPage={ItemsPerPage}
        setPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPages || 0}
      />
      <DeleteItem
        deleteItem={whyDeleteModalOpen}
        setDeleteItem={setWhyDeleteModalOpen}
        handleDeleteItem={handleDeleteWhy}
        text="Why Us"
        loading={deleteLoading}
      />
    </div>
  );
}

export default Whyus;

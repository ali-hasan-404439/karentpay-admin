import { useEffect, useState } from "react";

import { FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import moment from "moment";

import useFetchData from "../../../utils/useFetchData";
import TitleDynamic from "../../../TitleDynamic";
import AddPrice from "./AddPrice";
import EditPrice from "./EditPrice";
import ViewPrice from "./ViewPrice";
import SearchInputField from "../../../components/SearchInputField";
import Table from "../../../components/Table";
import DeleteItem from "../../../components/DeleteItem";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { CiEdit } from "react-icons/ci";
import ActionButton from "../../../components/ActionButton";
import TableFooter from "../../../components/TableFooter";

function Pricing() {
  const headers = ["Sl", "Date", "Title", "Percentage", "Action"];
  // Fetch all price data
  const { data, setRender } = useFetchData("/admin/pricing-items");

  const [addPriceModal, setAddPriceModal] = useState(false);
  const [editPriceModalOpen, setEditPriceModalOpen] = useState(null);
  const [viewPriceModalOpen, setViewPriceModalOpen] = useState(null);
  const [pricesDeleteModalOpen, setPricesDeleteModalOpen] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchPrices, setSearchPrices] = useState("");
  const [pricingData, setPricingData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  const token = Cookies.get("token");

  useEffect(() => {
    getPricingData();
  }, []);
  const getPricingData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/pricing-items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPricingData(response?.data);
    } catch (err) {
      // console.error("Error fetching data:", err);
    }
    setLoading(false);
  }
  useEffect(() => {
    setCurrentPage(1);
  }, [ItemsPerPage, searchPrices]);


  const handleSearchPrice = (array, searchPrices) => {
    let searchPriceData = array;

    if (searchPrices) {
      searchPriceData = array?.filter(
        ({ name }) =>
          name && name.toLowerCase().includes(searchPrices.toLowerCase())
      );
    }

    return searchPriceData;
  };

  const searchPrice = handleSearchPrice(pricingData, searchPrices);

  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = searchPrice?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchPrice?.length / ItemsPerPage);

  const handleDeletePrices = async (id) => {
    setDeleteLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/pricing-items/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/admin/pricing-items`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPricingData(response?.data);
      } catch (err) {
        // console.error("Error fetching data:", err);
      }
      toast.success("Delete price success!");
    } catch (error) {
      toast.error("Failed to delete price!");
    }
    setPricesDeleteModalOpen(false);
    setDeleteLoading(false);
  };

  return (
    <div className="text-black bg-white boxShadow-table dark:bg-gray-800 dark:text-white">
      <TitleDynamic title="Prices" />
      <div className="items-center justify-between gap-2 px-5 py-6 flex flex-wrap">
        <SearchInputField
          searchText={searchPrices}
          setSearchText={setSearchPrices}
          placeholderText="Search  Title..."
        />

        <AddPrice
          addPriceModal={addPriceModal}
          setAddPriceModal={setAddPriceModal}
          setPricingData={setPricingData}
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
              {/* Skeleton loader for date */}
              <td className="p-4 whitespace-nowrap">
                <div className="space-y-1">
                  <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </td>
              {/* Skeleton loader for name */}
              <td className="p-4">
                <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for percentage */}
              <td className="p-4">
                <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for buttons */}
              <td className="p-4 flex-1 w-[150px]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </td>
            </tr>
          ))
          : currentItems.map((item, index) => (
            <tr
              key={item.id}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                {searchPrice?.length -
                  ((currentPage - 1) * ItemsPerPage + index)}
              </td>
              <td className="p-4 whitespace-nowrap">
                {item.created_at && moment(new Date(item.created_at)).format("DD MMM YYYY")}
                <br />
                {item.created_at && moment(new Date(item.created_at)).format("h:mm a")}
              </td>
              <td className="p-4 ">
                <h2 className="w-[150px] lg:w-fit">{item.name}</h2>
              </td>
              <td className="p-4">
                <h2 className="w-[150px] lg:w-fit">
                  {item.charge_percentage} %
                </h2>
              </td>

              <td className="p-4 flex-1 w-[150px]">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item}
                    setAction={setViewPriceModalOpen}
                    title={"View"}
                    icon={<FaRegEye />}
                    bgColor={"bg-blue-500 hover:bg-blue-800"}
                  />
                  <ActionButton
                    id={item}
                    setAction={setEditPriceModalOpen}
                    title={"Edit"}
                    icon={<CiEdit />}
                    bgColor={"bg-green-500 hover:bg-green-800"}
                  />
                  <ActionButton
                    id={item?.id}
                    setAction={setPricesDeleteModalOpen}
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
        totalItems={searchPrice?.length || 0}
        perPage={ItemsPerPage}
        setPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPages || 0}
      />

      <ViewPrice
        viewPriceModalOpen={viewPriceModalOpen}
        setViewPriceModalOpen={setViewPriceModalOpen}
      />

      <EditPrice
        editPriceModalOpen={editPriceModalOpen}
        setEditPriceModalOpen={setEditPriceModalOpen}
        setPricingData={setPricingData}
      />

      <DeleteItem
        deleteItem={pricesDeleteModalOpen}
        setDeleteItem={setPricesDeleteModalOpen}
        handleDeleteItem={handleDeletePrices}
        text="Pricing"
        loading={deleteLoading}
      />
    </div>
  );
}

export default Pricing;

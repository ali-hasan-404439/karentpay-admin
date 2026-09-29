import { useEffect, useState } from "react";

import TitleDynamic from "../../../TitleDynamic";
import { CiEdit } from "react-icons/ci";

import FaqEdit from "./FaqEdit";
import FaqAdd from "./FaqAdd";
import SearchInputField from "../../../components/SearchInputField";
import Table from "../../../components/Table";
import DeleteItem from "../../../components/DeleteItem";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import TableFooter from "../../../components/TableFooter";
import ActionButton from "../../../components/ActionButton";
import { MdDelete } from "react-icons/md";

function Faq() {
  const headers = ["Sl", "Question", "Answer", "Action"];
  const [searchFaq, setSearchFaq] = useState("");

  const [faqAddedModalOpen, setFaqAddedModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [faqDeleteModalOpen, setFaqDeleteModalOpen] = useState("");
  const [faqData, setFaqData] = useState([]);
  const [render, setRender] = useState(false);
  const [loading, setLoading] = useState(false);

  // faq edit function start
  const [faqEditModalOpen, setFaqEditModalOpen] = useState("");
  const token = Cookies.get("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getFaqData();
  }, []);
  const getFaqData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/faqs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFaqData(response.data);
    } catch (err) {
      // console.error("Error fetching data:", err);
    }
    setLoading(false);
  }
  useEffect(() => {
    setCurrentPage(1);
  }, [ItemsPerPage, searchFaq]);
  // search function  review start
  function handleSearchFaqFunction(data, searchFaq) {
    let searchFaqFunction = data;

    if (searchFaq) {
      searchFaqFunction = data?.filter(
        ({ question }) =>
          question && question.toLowerCase().includes(searchFaq.toLowerCase())
      );
    }

    return searchFaqFunction;
  }
  const searchFaqFunction = handleSearchFaqFunction(faqData, searchFaq);
  // pagination function start
  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = searchFaqFunction?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(searchFaqFunction.length / ItemsPerPage);

  // pagination function end

  const handleDeleteFaq = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/faqs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/admin/faqs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFaqData(response.data);
      } catch (err) {
        // console.error("Error fetching data:", err);
      }
      toast.success("Faq delete successfully!");
    } catch (error) {
      toast.error("Failed to delete faq");
    }
    setDeleteLoading(false);
    setFaqDeleteModalOpen("");
  };
  return (
    <div className="boxShadow-table bg-white dark:bg-[#1F2836]">
      <TitleDynamic title="FAQ" />

      <div className="flex flex-wrap items-center gap-2 px-5 py-6">
        <SearchInputField
          searchText={searchFaq}
          setSearchText={setSearchFaq}
          placeholderText="Search Question..."
        />

        <button
          onClick={() => setFaqAddedModalOpen(!faqAddedModalOpen)}
          className="button_gradient w-full md:w-auto"
        >
          Add Faq
        </button>
        <FaqAdd
          faqAddedModalOpen={faqAddedModalOpen}
          setFaqAddedModalOpen={setFaqAddedModalOpen}
          setFaqData={setFaqData}
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
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for question */}
              <td className="px-4">
                <div className="w-[250px] lg:w-full h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for answer */}
              <td className="px-4">
                <div className="w-[600px] h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="w-[600px] h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for buttons */}
              <td className="px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </td>
            </tr>
          ))
          : currentItems?.reverse().map((item, index) => (
            <tr
              key={index}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="p-4 px-6 w-[50px] whitespace-nowrap">
                {searchFaqFunction?.length -
                  ((currentPage - 1) * ItemsPerPage + index)}
              </td>
              <td className="p-4" style={{ minWidth: "300px" }}>
                <h2 className="flex items-center">{item.question}</h2>
              </td>
              <td className="p-4" style={{ maxWidth: "500px", minWidth: "500px" }}>
                <h2 className="flex items-center">
                  {item.answer.length > 200
                    ? item.answer.slice(0, 200) + "...."
                    : item.answer}
                </h2>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item}
                    setAction={setFaqEditModalOpen}
                    title={"Edit"}
                    icon={<CiEdit />}
                    bgColor={"bg-green-500 hover:bg-green-800"}
                  />
                  <ActionButton
                    id={item?.id}
                    setAction={setFaqDeleteModalOpen}
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
        totalItems={searchFaqFunction?.length || 0}
        perPage={ItemsPerPage}
        setPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPages || 0}
      />
      <FaqEdit
        setFaqEditModalOpen={setFaqEditModalOpen}
        faqEditModalOpen={faqEditModalOpen}
        setFaqData={setFaqData}
      />
      <DeleteItem
        deleteItem={faqDeleteModalOpen}
        setDeleteItem={setFaqDeleteModalOpen}
        handleDeleteItem={handleDeleteFaq}
        text="FAQ"
        loading={deleteLoading}
      />
    </div>
  );
}

export default Faq;

import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";

import DashboardContactView from "./DashboardContactEdit";
import AddContactModel from "./AddContactModel";

import TitleDynamic from "../../../TitleDynamic";
import SearchInputField from "../../../components/SearchInputField";
import Table from "../../../components/Table";
import DeleteItem from "../../../components/DeleteItem";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import ActionButton from "../../../components/ActionButton";
import { MdDelete } from "react-icons/md";
import TableFooter from "../../../components/TableFooter";

function DashboardContact() {
  const headers = ["Sl", "Image", "Branch Name", "Phone", "Address", "Action"];
  const [searchContact, setSearchContact] = useState("");
  const [addContact, setAddContact] = useState(false);
  const [contactEditModalOpen, setContactEditModalOpen] = useState("");
  const [contactDeleteModalOpen, setContactDeleteModalOpen] = useState("");
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    getWhyUsData();
  }, []);
  const getWhyUsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/contact-page-locations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContactData(response?.data);
    } catch (err) {
      // console.error("Error fetching data:", err);
    }
    setLoading(false);
  }

  // search function  contact start
  function handleSearchAndFilterContact(data, searchContact) {
    let searchAndFilterContact = data;

    if (searchContact) {
      searchAndFilterContact = data?.filter(
        ({ BranchOfficeName }) =>
          BranchOfficeName &&
          BranchOfficeName.toLowerCase().includes(searchContact.toLowerCase())
      );
    }

    return searchAndFilterContact;
  }
  const searchAndFilterContact = handleSearchAndFilterContact(
    contactData,
    searchContact
  );
  // handle delete contact function start

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchAndFilterContact?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(searchAndFilterContact.length / itemsPerPage);
  // search function  contact end

  const handleDeleteContact = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/contact-page-locations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/admin/contact-page-locations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setContactData(response?.data);
      } catch (err) {
        // console.error("Error fetching data:", err);
      }
      toast.success("Delete contact Success!");
    } catch (error) {
      toast.error("Failed to add contact");
    }
    setDeleteLoading(false);
    setContactDeleteModalOpen(null);
  };

  return (
    <div className="boxShadow-table bg-white dark:bg-[#1F2836] relative">
      <TitleDynamic title="Contact" />
      <div className="flex flex-wrap items-center gap-2 px-5 py-6">
        <SearchInputField
          searchText={searchContact}
          setSearchText={setSearchContact}
          placeholderText="Search Branch Name..."
        />

        <button
          onClick={() => setAddContact(!addContact)}
          className="button_gradient w-full md:w-auto"
        >
          Add Branch
        </button>
        <AddContactModel
          addContact={addContact}
          setAddContact={setAddContact}
          setContactData={setContactData}
        />

        <DashboardContactView
          setContactEditModalOpen={setContactEditModalOpen}
          contactEditModalOpen={contactEditModalOpen}
          setContactData={setContactData}
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
              {/* Skeleton loader for checkbox */}
              <td className="pl-6 pr-2">
                <div className="w-12 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for image */}
              <td className="p-4 whitespace-nowrap">
                <div className="w-14 h-14 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
              </td>
              {/* Skeleton loader for text */}
              <td className="p-4 whitespace-nowrap">
                <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for address */}
              <td className="p-4 whitespace-nowrap">
                <div className="w-48 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="w-48 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for phone numbers */}
              <td className="p-4 whitespace-nowrap">
                <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
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
              <td className="px-6 py-4 whitespace-nowrap">
                {searchAndFilterContact?.length -
                  ((currentPage - 1) * itemsPerPage + index)}
              </td>
              <td className="p-4 whitespace-nowrap">
                <img
                  src={item?.BranchOfficeImage}
                  alt=""
                  className="rounded w-24 object-fill"
                />
              </td>
              <td className="p-4 whitespace-nowrap">
                <h2>{item?.BranchOfficeName}</h2>
              </td>
              <td className="p-4 whitespace-nowrap">
                <h2>{item?.BranchOfficePhone1}</h2>
                <h2>{item?.BranchOfficePhone2}</h2>
                <h2>{item?.BranchOfficePhone3}</h2>
              </td>
              <td className="p-4 whitespace-nowrap">
                <h2>{item?.BranchOfficeAddress1}</h2>
                <h2>{item?.BranchOfficeAddress2}</h2>
              </td>
              <td className="p-4 ">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item}
                    setAction={setContactEditModalOpen}
                    title={"Edit"}
                    icon={<CiEdit />}
                    bgColor={"bg-green-500 hover:bg-green-800"}
                  />
                  <ActionButton
                    id={item?.id}
                    setAction={setContactDeleteModalOpen}
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
        totalItems={searchContact?.length || 0}
        perPage={itemsPerPage}
        setPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPages || 0}
      />
      <DeleteItem
        deleteItem={contactDeleteModalOpen}
        setDeleteItem={setContactDeleteModalOpen}
        handleDeleteItem={handleDeleteContact}
        text="Contact"
        loading={deleteLoading}
      />
    </div>
  );
}

export default DashboardContact;

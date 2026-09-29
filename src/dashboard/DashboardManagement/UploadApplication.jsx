import { useEffect, useState } from "react";
import TitleDynamic from "../../TitleDynamic";
import moment from "moment";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import AddApplication from "./AddApplication";
import DeleteItem from "../../components/DeleteItem";
import useFetchData from "../../utils/useFetchData";
import EditApplication from "./EditApplication";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import Table from "../../components/Table";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import ActionButton from "../../components/ActionButton";

function UploadApplication() {
  const headers = ["Sl", "Date", "Name", "Version", "Details", "Devices", "Actions"];
  const [showModal, setShowModal] = useState(false);
  const [applicationEdit, setApplicationEdit] = useState(null);
  const [applicationDelete, setApplicationDelete] = useState(null);
  const [data, setData] = useState([]);
  const token = Cookies.get("token");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    downloadFileData();
  }, []);

  const downloadFileData = async () => {
    if (!token) return toast.error("You need to login first.");
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_API_HOST + "/admin/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response?.data);
    } catch (error) {
      toast.error("Failed to download file. Please try again.");
    }
    setLoading(false);
  }

  const handleDelete = async (id) => {
    if (!token) return toast.error("You need to login first.");
    setLoadingDelete(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(import.meta.env.VITE_API_HOST + "/admin/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response?.data);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
      toast.success("Application deleted successfully.");
      setApplicationDelete(null);
    } catch (error) {
      toast.error("Failed to delete application. Please try again.");
    }
    setLoadingDelete(false);
  };

  return (
    <div className="boxShadow-table bg-white dark:bg-[#1F2836] relative text-[16px]">
      <TitleDynamic title="Upload Application" />

      <div className="p-6 space-y-5">
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(!showModal)}
            className="button_gradient w-full md:w-auto"
          >
            <IoMdAdd size={20} />
            Add Application
          </button>
        </div>
      </div>

      {/* Add Application Modal */}
      <AddApplication
        showModal={showModal}
        setShowModal={setShowModal}
        setData={setData}
      />

      {/* Table */}
      <Table headers={headers}>
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
            <tr
              key={index}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="px-6 py-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-24 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-32 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-32 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-20 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-48 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-48 animate-pulse"></div>
              </td>
              <td className="p-4 w-[100px]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
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
              <td className="px-6 py-4 whitespace-nowrap">
                {data?.length - index}
              </td>
              <td className="p-4 whitespace-nowrap">
                {moment(item.created_at).format("DD MMM YYYY")}
              </td>
              <td className="p-4 whitespace-nowrap">
                {item.name.length > 20
                  ? `${item.name.slice(0, 20)}...`
                  : item.name}
              </td>
              <td className="p-4 whitespace-nowrap">v{item.version}</td>
              <td className="p-4 ">
                <h2 style={{ maxWidth: "450px", minWidth: "350px" }}>
                  {item.details.length > 100
                    ? `${item.details.slice(0, 100)}...`
                    : item.details}
                </h2>
              </td>
              <td className="p-4 whitespace-nowrap">
                {item?.icon && (
                  <img
                    src={item?.icon}
                    alt="icon"
                    className="w-8 h-8 object-cover rounded-full"
                  />
                )}
              </td>

              <td className="px-6 py-3 w-[100px]">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item}
                    setAction={setApplicationEdit}
                    title={"Edit"}
                    icon={<CiEdit />}
                    bgColor={"bg-green-500 hover:bg-green-800"}
                  />
                  <ActionButton
                    id={item?.id}
                    setAction={setApplicationDelete}
                    title={"Delete"}
                    icon={<MdDelete />}
                    bgColor={"bg-red-500 hover:bg-red-800"}
                  />
                </div>
              </td>
            </tr>
          ))}
      </Table>
      <EditApplication
        applicationEdit={applicationEdit}
        setApplicationEdit={setApplicationEdit}
        setData={setData}
      />

      <DeleteItem
        deleteItem={applicationDelete}
        setDeleteItem={setApplicationDelete}
        handleDeleteItem={handleDelete}
        text="Application"
        loading={loadingDelete}
      />
    </div>
  );
}

export default UploadApplication;

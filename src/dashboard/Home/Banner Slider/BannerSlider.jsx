import { useEffect, useState } from "react";

import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Fill } from "react-icons/ri";

import useFetchData from "../../../utils/useFetchData";
import TitleDynamic from "../../../TitleDynamic";
import BannerSliderAdded from "./BannerSliderAdded";
import BannerEdit from "./BannerEdit";
import Table from "../../../components/Table";
import DeleteItem from "../../../components/DeleteItem";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { MdDelete } from "react-icons/md";
import ActionButton from "../../../components/ActionButton";
import TableFooter from "../../../components/TableFooter";

function BannerSlider() {
  const headers = [
    "Sl",
    "Banner",
    "Button First",
    "Button Second",
    "Description",
    "Action",
  ];
  const [bannerEdit, setBannerEdit] = useState("");
  const [bannerSliderAdd, setBannerSliderAdd] = useState(false);
  const [bannerDeleteModalOpen, setBannerDeleteModalOpen] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const token = Cookies.get("token");

  useEffect(() => {
    getBannerSlider();
  }, [])

  const getBannerSlider = async () => {
    setLoading(true);
    const response = await axios.get(
      `${import.meta.env.VITE_API_HOST}/admin/home-image-sliders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLoading(false);
    setData(response.data);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [ItemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * ItemsPerPage;
  const indexOfFirstItem = indexOfLastItem - ItemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data?.length / ItemsPerPage);
  // showing item length
  const itemIndex = indexOfFirstItem + 1;
  // pagination function end

  const handleDeleteBanner = async (id) => {
    setDeleteLoading(true);
    const token = Cookies.get("token");

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/home-image-sliders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/home-image-sliders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data);
      toast.success("Delete banner successfully");
    } catch (error) {
      toast.error("Filed to delete banner. Please try again");
    }
    setDeleteLoading(false);
    setBannerDeleteModalOpen("");
  };

  return (
    <div className="boxShadow-table bg-white dark:bg-[#1F2836]">
      <TitleDynamic title="Banner Slider" />

      <div className="flex items-center gap-2 px-5 py-6">
        <button
          onClick={() => setBannerSliderAdd(!bannerSliderAdd)}
          className="button_gradient w-full md:w-auto"
        >
          Add Banner Slider
        </button>
        <BannerSliderAdded
          bannerSliderAdd={bannerSliderAdd}
          setBannerSliderAdd={setBannerSliderAdd}
          setData={setData}
        />
      </div>
      <Table headers={headers}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className="table_tr">
              {/* Skeleton loader for row index */}
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for banner image */}
              <td className="p-4">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for ButtonText1 */}
              <td className="p-4">
                <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for ButtonText2 */}
              <td className="p-4">
                <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for BannerText */}
              <td className="p-4">
                <div className="w-[600px] h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </td>
              {/* Skeleton loader for action buttons */}
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
              <td className="py-4 pl-6 whitespace-nowrap">{index + 1}</td>
              <td className="p-4 ">
                <img
                  src={item.BannerImage}
                  alt=""
                  className="w-24 object-fill"
                />
              </td>
              <td className="p-4 whitespace-nowrap">
                <h2 className="flex items-center w-full">
                  {item.ButtonText1}
                </h2>
              </td>
              <td className="p-4 whitespace-nowrap">
                <h2 className="flex items-center w-full">
                  {item.ButtonText2}
                </h2>
              </td>
              <td className="p-4">
                <h2
                  className="flex items-center w-full"
                  style={{ width: "500px" }}
                >
                  {item.BannerText}
                </h2>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item}
                    setAction={setBannerEdit}
                    title={"Edit"}
                    icon={<CiEdit />}
                    bgColor={"bg-green-500 hover:bg-green-800"}
                  />
                  <ActionButton
                    id={item?.id}
                    setAction={setBannerDeleteModalOpen}
                    title={"Delete"}
                    icon={<MdDelete />}
                    bgColor={"bg-red-500 hover:bg-red-800"}
                  />
                </div>
              </td>
            </tr>
          ))}
      </Table>

      <BannerEdit
        bannerEdit={bannerEdit}
        setBannerEdit={setBannerEdit}
        setData={setData}
      />
      <TableFooter
        totalItems={data?.length || 0}
        perPage={ItemsPerPage}
        setPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={totalPages || 0}
      />
      <DeleteItem
        deleteItem={bannerDeleteModalOpen}
        setDeleteItem={setBannerDeleteModalOpen}
        handleDeleteItem={handleDeleteBanner}
        text="Banner"
        loading={deleteLoading}
      />
    </div>
  );
}

export default BannerSlider;

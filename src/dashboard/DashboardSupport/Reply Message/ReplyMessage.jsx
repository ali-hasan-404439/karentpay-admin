import { useEffect, useState } from "react";

//  import time formate package
import moment from "moment";
import { FaEllipsis } from "react-icons/fa6";
import { VscScreenFull } from "react-icons/vsc";
import ReplyMessageEdit from "./ReplyMessageEdit";
import useFetchData from "../../../utils/useFetchData";
import DeleteItem from "../../../components/DeleteItem";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { IoMdClose } from "react-icons/io";
moment().format();

function ReplyMessage({ replySuccess, supportValidId }) {
  const { data, setRender } = useFetchData(
    `/admin/tickets/${supportValidId?.id}/replies`
  );
  const [replyMessageDelete, setReplyMessageDelete] = useState("");
  const [replyMessageEdit, setReplyMessageEdit] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showImage, setShowImage] = useState(null);

  useEffect(() => {
    setRender(true);
  }, [replySuccess, replyMessageEdit]);

  const [modalEdit, setModalEdit] = useState("");
  const handelOpenRight = (id) => {
    const findModalData = data.find((findModalData) => findModalData.id === id);
    if (findModalData) {
      setModalEdit(findModalData.id);
    }
  };

  // outlet click close the toggle function
  useEffect(() => {
    const handleClickOutsideUsersFilter = (event) => {
      if (!event.target.closest("#setModalEdit")) {
        setModalEdit("");
      }
    };
    window.document.addEventListener("click", handleClickOutsideUsersFilter);
    return () => {
      window.document.removeEventListener(
        "click",
        handleClickOutsideUsersFilter
      );
    };
  }, []);

  const handleDeleteReplyMessage = async (id) => {
    const token = Cookies.get("token");
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST}/admin/delete_reply/${supportValidId?.id
        }/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRender(true);
      toast.success("Delete reply message successfully");
    } catch (error) {
      toast.error("Failed to delete reply message. Please try again.");
    }
    setDeleteLoading(false);
    setReplyMessageDelete("");
  };
  return (
    <>
      {data.length > 0 && (
        <div className="mt-3 ">
          {data?.map((item, index) => (
            <div key={index} className="p-3 mb-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8">
                    {item.user.avatar ? (
                      <img
                        src={item.user.avatar}
                        alt=""
                        className="w-8 rounded-full"
                      />
                    ) : (
                      <h2 className="flex items-center justify-center w-10 h-10 uppercase border rounded-full">
                        {item.user.name.slice(0, 1)}
                      </h2>
                    )}
                  </div>
                  <p className="text-lg ">{item.user.name}</p>
                </div>
                <div className="relative">
                  <div
                    onClick={() => handelOpenRight(item.id)}
                    id="setModalEdit"
                    className="py-[2px] px-3 rounded-[4px] hover:bg-white dark:hover:bg-slate-600"
                  >
                    <FaEllipsis className="text-2xl" />
                  </div>

                  {modalEdit === item.id && (
                    <div
                      className={`z-[1000] absolute top-8 right-10 bg-white rounded-[4px] w-32 dark:bg-gray-700 dark:text-white boxShadow-table`}
                    >
                      <div
                        onClick={() => setReplyMessageEdit(item)}
                        className="block px-4 py-2 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer rounded-t-[4px] border-b dark:border-b-[#1f2937]"
                      >
                        Edit
                      </div>
                      <div
                        onClick={() => setReplyMessageDelete(item.id)}
                        className="block px-4 py-2 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer rounded-b-[4px]"
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full ms-14">
                <p className="text-[14px] flex flex-wrap w-[95%]">
                  {item.message}
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-3  w-[95%]">
                  {item.attachment_image &&
                    JSON.parse(item.attachment_image).map(
                      (imageUrl, imageIndex) => (
                        <div key={imageIndex} className="p-3 border rounded">
                          <img
                            src={imageUrl}
                            s
                            alt={` attachment`}
                            className="rounded object-fill  "
                          />
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          ))}
          <ReplyMessageEdit
            replyMessageEdit={replyMessageEdit}
            setReplyMessageEdit={setReplyMessageEdit}
            supportValidId={supportValidId}
            setRender={setRender}
          />
        </div>
      )}
      <DeleteItem
        handleDeleteItem={handleDeleteReplyMessage}
        loading={deleteLoading}
        deleteItem={replyMessageDelete}
        setDeleteItem={setReplyMessageDelete}
        text="Reply Message"
      />
    </>
  );
}

export default ReplyMessage;

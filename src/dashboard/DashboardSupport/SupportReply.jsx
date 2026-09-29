import { useEffect, useState } from "react";
import {
  FaLeftLong,
  FaEllipsis,
  FaSpinner,
} from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import useFetchData from "../../utils/useFetchData";
import axios from "axios";
import { toast } from "react-toastify";
import ReplyMessage from "./Reply Message/ReplyMessage";
import Cookies from "js-cookie";
import InputField from "../../components/InputField";

function SupportReply() {
  const { data, setRender } = useFetchData("/admin/tickets");
  const { track_id } = useParams();

  const [replayMessage, setReplayMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [replySuccess, setReplySuccess] = useState(false);
  const [modalEdit, setModalEdit] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");

  const supportValidId = data?.data?.find(
    (ticket) => ticket.track_id === track_id
  );

  useEffect(() => {
    setRender(true);
  }, [updatedStatus]);

  const handleFileChange = async (event) => {
    setReplySuccess(true);
    const files = Array.from(event.target.files);
    if (files) {
      const formData = new FormData();
      if (files) {
        files.forEach((file) => {
          formData.append("files[]", file);
        });
      }
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_HOST}/admin/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setSelectedFiles((prevFiles) => [
          ...prevFiles,
          ...(response?.data?.file_urls || []),
        ]);
      } catch (error) {
        // console.error(error);
      }
      setReplySuccess(false);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSupportReply = async () => {
    setReplySuccess(true);
    const formData = new FormData();
    formData.append("ticket_id", track_id);
    formData.append("message", replayMessage);
    if (selectedFiles?.length > 0) {
      formData.append("attachment_image", JSON.stringify(selectedFiles));
    }
    const token = Cookies.get("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/add_reply/${supportValidId?.id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.status === 201) {
        setReplayMessage("");
        setSelectedFiles([]);
        setReplySuccess(false);
        toast.success("Support reply added successfully");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Failed to add support reply");
      }
      setReplySuccess(false);
    }
  };

  const handleSupportStatusUpdate = async (status) => {
    const formData = new FormData();
    formData.append("status", status);
    formData.append("_method", "PUT");

    const token = Cookies.get("token");

    if (supportValidId?.status !== status) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_HOST}/admin/tickets/${supportValidId.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response?.status === 200) {
          setUpdatedStatus(status);
          toast.success("Support status updated successfully");
        }
      } catch (error) {
        toast.error("Failed to update support status");
      }
    } else {
      toast.error(`Support status is already ${status}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#setModalEdit")) {
        setModalEdit("");
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="text-black dark:text-white p-6 bg-white dark:bg-gray-800 rounded-[4px] boxShadow-table">
      <div className="items-center justify-between block p-4 bg-gray-50 dark:bg-gray-800 sm:flex">
        <div className="flex items-center divide-x divide-gray-50 dark:divide-gray-700">
          <div className="pr-3">
            <Link
              to="/support"
              className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <FaLeftLong />
            </Link>
          </div>
          <div className="mb-2 inline-block text-sm  sm:text-base">
            Reply Message
          </div>
        </div>
        <div className="relative">
          <div
            onClick={() => setModalEdit(supportValidId.id)}
            id="setModalEdit"
            className="py-[2px] px-3 rounded-[4px] hover:bg-white dark:hover:bg-slate-600"
          >
            <FaEllipsis className="text-2xl" />
          </div>
          {modalEdit && (
            <div
              className={`z-[1000] absolute top-8 right-10 bg-white rounded-[4px] w-32 dark:bg-gray-700 dark:text-white boxShadow-table`}
            >
              <div
                onClick={() => handleSupportStatusUpdate("open")}
                className="block px-4 py-2 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer rounded-t-[4px] border-b dark:border-b-[#1f2937]"
              >
                Open
              </div>
              <div
                onClick={() => handleSupportStatusUpdate("closed")}
                className="block px-4 py-2 hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white cursor-pointer rounded-b-[4px]"
              >
                Close
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 mb-5 ms-3">
        <div className="flex gap-4 md:space-y-0">
          <div className="w-10">
            {supportValidId?.user_avatar ? (
              <img
                src={supportValidId?.user_avatar}
                alt=""
                className="rounded-full"
              />
            ) : (
              <h2 className="flex items-center justify-center w-10 h-10 uppercase border rounded-full">
                {supportValidId?.name.slice(0, 1)}
              </h2>
            )}
          </div>
          <div className="w-full">
            <h4 className=" md:text-left">{supportValidId?.name}</h4>
            <p>
              <span className="font-semibold">Subject : </span>
              {supportValidId?.subject}
            </p>
            <p>
              <span className="font-semibold">Message : </span>
              {supportValidId?.message}
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-3">
              {supportValidId?.image &&
                JSON.parse(supportValidId?.image).map(
                  (imageUrl, imageIndex) => (
                    <div key={imageIndex} className="p-3 border rounded">
                      <img
                        src={imageUrl}
                        s
                        alt={`${supportValidId?.name} attachment`}
                        className="rounded object-fill  "
                      />
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
      <ReplyMessage
        replySuccess={replySuccess}
        supportValidId={supportValidId}
      />

      <div className="w-full pt-1 mx-auto my-0">
        <div className="relative text-black dark:text-white space-y-3">
          <InputField
            type="textarea"
            label="Reply Message"
            value={replayMessage}
            onChange={setReplayMessage}
            id="message"
            required={true}
          />

          <div>
            <h2 className="mb-2 inline-block text-sm sm:text-base">
              Choose Files
            </h2>
            <input
              onChange={handleFileChange}
              className="block w-full text-gray-900 border border-gray-300 rounded-[4px] cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              multiple
            />
          </div>
          {selectedFiles.length > 0 && (
            <div className="mt-1">
              <div className="flex gap-2 flex-wrap mt-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-32 h-32 border rounded-md overflow-hidden"
                  >
                    <img
                      src={file}
                      alt="Preview"
                      className="w-32  object-fill rounded shadow"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSupportReply}
              type="button"
              className="button_gradient"
              disabled={replySuccess}
            >
              {replySuccess ? (
                <>
                  <FaSpinner className="animate-spin" /> Loading...
                </>
              ) : (
                <>Send Reply</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportReply;

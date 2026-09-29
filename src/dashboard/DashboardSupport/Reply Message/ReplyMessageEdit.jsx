import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

function ReplyMessageEdit({
  replyMessageEdit,
  setReplyMessageEdit,
  supportValidId,
  setRender,
}) {
  const [loading, setLoading] = useState(false);
  const [replayMessage, setReplayMessage] = useState("");
  const [chooseFiles, setChooseFiles] = useState([]);

  const handleChooseFileChange = async (event) => {
    setLoading(true);
    const files = Array.from(event.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("files[]", file));

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
      setChooseFiles((prevFiles) => [
        ...prevFiles,
        ...(response?.data?.file_urls || []),
      ]);
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setChooseFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleEditReplyMessage = async (id) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("message", replayMessage);
    formData.append("_method", "PUT");
    if (chooseFiles.length > 0) {
      formData.append("attachment_image", JSON.stringify(chooseFiles));
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/update_reply/${supportValidId?.id}/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response?.status === 200) {
        setRender(true);
        toast.success("Reply message updated successfully");
        setReplyMessageEdit(null);
      }
    } catch (error) {
      toast.error("Failed to update reply message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (replyMessageEdit) {
      setChooseFiles(JSON.parse(replyMessageEdit?.attachment_image || "[]"));
      setReplayMessage(replyMessageEdit?.message || "");
    }
  }, [replyMessageEdit]);

  return (
    <>
      {replyMessageEdit && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/20">
          <div className="relative w-full max-w-3xl max-h-full">
            <div className="relative p-10 bg-white rounded shadow dark:bg-gray-700">
              <div className="relative space-y-5 text-black dark:text-white">
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm sm:text-base"
                  >
                    Reply Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={replayMessage}
                    onChange={(e) => setReplayMessage(e.target.value)}
                    id="message"
                    rows="8"
                    className="block p-3 w-full text-gray-900 border rounded dark:bg-gray-700"
                    placeholder="Write your message..."
                  ></textarea>
                </div>
                <div>
                  <h2 className="mb-2 text-sm sm:text-base">
                    Choose Files
                  </h2>
                  <input
                    onChange={handleChooseFileChange}
                    type="file"
                    multiple
                    className="block w-full text-gray-900 border rounded dark:bg-gray-700"
                  />
                  <div className="flex flex-wrap gap-3 mt-5">
                    {chooseFiles?.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={file}
                          alt={`Preview ${index + 1}`}
                          className="w-32  object-fill rounded shadow"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditReplyMessage(replyMessageEdit.id)}
                    className="button_gradient"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Loading...
                      </>
                    ) : (
                      <>
                        Send <IoIosSend />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setReplyMessageEdit(null)}
                    className="button_cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReplyMessageEdit;

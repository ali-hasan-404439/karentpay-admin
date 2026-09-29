import { useEffect, useState } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import SaneEditor from "../../SaneEditor";
import InputField from "../../components/InputField";

function EditPage({ editPageModalOpen, setEditPageModalOpen, setData }) {
  const [pageName, setPageName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!editPageModalOpen) return;
    setPageName(editPageModalOpen?.page_name);
    setContent(editPageModalOpen?.content);
  }, [editPageModalOpen]);

  const validateFields = () => {
    const errors = {};
    if (!pageName.trim()) errors.pageName = "Page name is required.";
    if (!content.trim()) errors.content = "Content is required.";
    return errors;
  };
  const documentationsData = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("admin_user"));

    const formData = new FormData();
    formData.append("page_name", pageName);
    formData.append("content", content);
    formData.append("status", "published");
    formData.append("user_id", user.id);
    formData.append("_method", "PUT");
    const token = Cookies.get("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/pages/${editPageModalOpen?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData((prv) => {
        return prv.map((item) => {
          if (item.id === editPageModalOpen?.id) {
            return {
              ...item,
              page_name: pageName,
              content: content,
            };
          }
          return item;
        });
      })
      toast.success("Page updated successfully!");
    } catch (error) {
      toast.error("Failed to add page. Please try again.");
    }
    setLoading(false);
    setEditPageModalOpen(false);
  };

  function editorContent(text) {
    setContent(text);
  }

  return (
    <>
      {editPageModalOpen && (
        <div
          id="default-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full p-5 bg-opacity-50 bg-black/20"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto m-5 text-black dark:text-white">
            <div className="relative p-10 space-y-5 bg-white rounded dark:bg-gray-700">
              <InputField
                type="text"
                name="title"
                value={pageName}
                onChange={setPageName}
                placeholder="Page Name"
                label="Page Name"
                error={errors.pageName}
                required={true}
              />
              <div className="relative ">
                <label
                  htmlFor="Documentation"
                  className="mb-2 inline-block text-sm  sm:text-base"
                >
                  Documentation  <span className="text-red-600">*</span>
                </label>
                <SaneEditor
                  editorContent={editorContent}
                  initialContent={content}
                />
                {
                  errors.content && (
                    <span className="text-red-500 text-sm">
                      {errors.content}
                    </span>
                  )
                }
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={documentationsData}
                  className="button_gradient"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Loading...
                    </>
                  ) : (
                    <>
                      Update
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditPageModalOpen(false)}
                  className="button_cancel"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default EditPage;

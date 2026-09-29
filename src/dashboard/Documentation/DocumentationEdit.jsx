import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import Auth from "../../utils/Auth";
import { FaSpinner } from "react-icons/fa6";
import SaneEditor from "../../SaneEditor";
import InputField from "../../components/InputField";

function DocumentationEdit({ setEditModalOpen, editModalOpen, setData }) {
  const { ApiRequest } = Auth();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [errors, setErrors] = useState({});

  function editorContent(content) {
    setDesc(content);
  }

  useEffect(() => {
    if (editModalOpen) {
      setTitle(editModalOpen?.title);
      setDesc(editModalOpen?.description);
    }
  }, [editModalOpen]);

  const validateFields = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required.";
    if (!desc.trim()) errors.desc = "Description is required.";
    return errors;
  };
  const documentationsData = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const requestData = {
        title: title,
        description: desc,
      };

      await ApiRequest({
        url: `/documentation/${editModalOpen?.id}`,
        method: "PUT",
        formdata: requestData,
      });

      toast.success("Documentation updated successfully");
      setData((prevData) => {
        return prevData.map((data) => {
          if (data.id === editModalOpen?.id) {
            return { ...data, title: title, description: desc };
          }
          return data;
        });
      });
    } catch (error) {
      toast.error("Error updating documentation");
    }
    setEditModalOpen(false);
    setLoading(false);
  };

  return (
    <>
      {editModalOpen && (
        <div
          id="default-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 p-5"
        >
          <div className="relative m-5 w-full max-w-3xl max-h-full overflow-y-auto text-black dark:text-white">
            <div className="relative p-10 space-y-5 bg-white rounded-[4px] shadow dark:bg-gray-700">
              <InputField
                type="text"
                name="title"
                value={title}
                onChange={setTitle}
                placeholder="Title"
                label="Title"
                error={errors.title}
                required={true}
              />
              <div className="relative ">
                <label
                  htmlFor="Documentation"
                  className="mb-2 inline-block text-sm  sm:text-base"
                >
                  Documentation <span className="text-red-600">*</span>
                </label>
                <SaneEditor
                  editorContent={editorContent}
                  initialContent={editModalOpen?.description}
                />
                {errors.desc && <p className="text-red-600">{errors.desc}</p>}
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
                    <>Update</>
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditModalOpen(false);
                    setTitle("");
                    setDesc("");
                  }}
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

export default DocumentationEdit;

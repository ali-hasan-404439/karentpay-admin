import { useState } from "react";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

import Auth from "../../utils/Auth";
import SaneEditor from "../../SaneEditor";
import InputField from "../../components/InputField";
import axios from "axios";
import Cookies from "js-cookie";

function AddDocumentation({
  documentationModel,
  setDocumentationModel,
  setTotal,
  setData,
  ItemsPerPage,
  currentPage,
}) {
  const { ApiRequest } = Auth();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  function editorContent(text) {
    setDesc(text);
  }
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
        description: desc,
        title: title,
      };

      const response = await ApiRequest({
        url: "/set_documentation",
        formdata: requestData,
      });
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_HOST +
          `/merchant/get_documentation_admin?page=${currentPage}&per_page=${ItemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalItems: response?.data?.data.total,
          totalPage: response?.data?.data.last_page,
        });
        setData(response.data.data.data);
      } catch (err) {
        // console.log(err);
      }
      toast.success("Success added the documentation");
    } catch (error) {
      toast.error(error.message);
    }
    setDocumentationModel(false);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setDocumentationModel(!documentationModel)}
        className="button_gradient w-full md:w-auto whitespace-nowrap"
      >
        <FaPlus /> Add Documentation
      </button>

      {documentationModel && (
        <div
          id="default-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 p-5"
        >
          <div className="relative m-5 w-full max-w-3xl max-h-[90vh] overflow-y-auto text-black dark:text-white">
            <div className="relative p-10 space-y-5 bg-white rounded shadow dark:bg-gray-700">
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
                <SaneEditor editorContent={editorContent} />
                {errors.desc && (
                  <p className="text-red-500 text-sm">{errors.desc}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={documentationsData}
                  className="button_gradient"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Loading...
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </button>
                <button
                  onClick={() => setDocumentationModel(false)}
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
export default AddDocumentation;

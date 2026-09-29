import { useEffect, useRef, useState } from "react";
import { IoIosSend, IoMdClose } from "react-icons/io";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import ProgressUpload from "./ProgressUploade";
import { FaSpinner } from "react-icons/fa";

function AddApplication({ showModal, setShowModal, setData }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [app_file, setAppFile] = useState("");

  const newsImageRef = useRef(null);

  const token = Cookies.get("token");

  useEffect(() => {
    if (showModal) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [showModal]);

  const [data, setFormData] = useState({
    name: "",
    version: "",
    icon: "",
    details: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0] || "";
    if (file) {
      const formData = new FormData();
      formData.append("files[]", file);
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: response.data.file_urls,
        }));
      }
      else {
        toast.error("Failed to upload file. Please try again.");
      }
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const clearNewsImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      icon: "",
    }));
    if (newsImageRef.current) {
      newsImageRef.current.value = "";
    }
  };
  const validateForm = () => {
    const validationErrors = {};
    if (!data.name.trim()) {
      validationErrors.name = "Application Name is required.";
    }
    if (!data.version.trim()) {
      validationErrors.version = "Version is required.";
    }
    if (!data.details.trim()) {
      validationErrors.details = "details are required.";
    }
    if (!data.icon) {
      validationErrors.icon = "Icon is required.";
    }
    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }
    if (!token) return toast.error("You need to login first.");
    if (!app_file) return toast.error("Application file is required.");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("version", data.version);
      formData.append("icon", data.icon);
      formData.append("details", data.details);
      formData.append("app_file", app_file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/applications`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        try {
          const response = await axios.get(import.meta.env.VITE_API_HOST + "/admin/applications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(response?.data);
        } catch (error) {
          // toast.error("Failed to download file. Please try again.");
        }
        toast.success("Application added successfully.");
        setShowModal(false);
        setErrors({});
        setFormData({
          name: "",
          version: "",
          icon: "",
          details: "",
          app_file: "",
        });
        setAppFile('');
      }
    } catch (err) {
      if (err.response.data.message) {
        setLoading(false);
        return toast.error(err.response.data.message);
      }
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <>
      {isVisible && (
        <div
          id="popup-modal"
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${showModal ? "opacity-100" : "opacity-0"
            }`}
        >
          <div
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-[4px] shadow dark:bg-gray-700 transition-transform duration-300 transform ${showModal ? "translate-y-0" : "-translate-y-20"
              }`}
          >
            <div className="p-10 space-y-5">
              {/* Application Name Field */}
              <div className="relative">
                <label
                  htmlFor="Name"
                  className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white"
                >
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="block w-full p-3 text-gray-900 border border-gray-300 rounded cursor-text bg-gray-50 focus:outline-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name}</span>
                )}
              </div>

              {/* Version Field */}
              <div className="relative">
                <label
                  htmlFor="version"
                  className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white"
                >
                  Version <span className="text-red-600">*</span>
                </label>
                <input
                  id="version"
                  name="version"
                  value={data.version}
                  onChange={handleChange}
                  placeholder="Version"
                  className="block w-full p-3 text-gray-900 border border-gray-300 rounded cursor-text bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                />
                {errors.version && (
                  <span className="text-red-500">{errors.version}</span>
                )}
              </div>

              {/* details Field */}
              <div className="relative">
                <label
                  htmlFor="details"
                  className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white"
                >
                  Details <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={data.details}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Details"
                  className="block w-full p-3 text-gray-900 border border-gray-300 rounded cursor-text bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.details && (
                  <span className="text-red-500">{errors.details}</span>
                )}
              </div>

              {/* Icon Upload Field */}
              <div className="relative">
                <label
                  htmlFor="icon"
                  className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white"
                >
                  Icon <span className="text-red-600">*</span>
                </label>
                <input
                  ref={newsImageRef}
                  id="icon"
                  name="icon"
                  onChange={handleFileChange}
                  className="block w-full text-gray-900 border border-gray-300 rounded cursor-text bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="file"
                />
                {errors.icon && (
                  <span className="text-red-500">{errors.icon}</span>
                )}
                {data.icon && (
                  <div className="relative w-fit">
                    <img
                      src={data.icon}
                      alt="icon"
                      className="w-20 h-20 object-fill rounded mt-2"
                    />
                    <div
                      onClick={() => {
                        clearNewsImage();
                        // Reset the file input field
                        const fileInput = document.getElementById("icon");
                        if (fileInput) {
                          fileInput.value = "";
                        }
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-red-600 flex items-center justify-center text-3xl cursor-pointer"
                    >
                      <IoMdClose />
                    </div>
                  </div>
                )}
              </div>

              {/* Application File Upload */}
              <ProgressUpload setAppFile={setAppFile} />

              {/* Submit Button */}
              <div className="flex items-center gap-3 pt-4">
                <button onClick={handleSubmit} className="button_gradient">
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="button_cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddApplication;

import { useState, useRef, useEffect } from "react";
import { MdClose } from "react-icons/md";

import TitleDynamic from "../../TitleDynamic";
import useFetchData from "../../utils/useFetchData";
import InputField from "../../components/InputField";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";

function DownlandPage() {
  const token = Cookies.get("token");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { data: downloadPage, setRender } = useFetchData(
    "/admin/settings/download-page"
  );

  const fileInputRef = useRef(null);

  const [data, setFormData] = useState({
    title: "",
    description: "",
    uploadFile: null,
  });

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle file input changes
  const handleFileChange = async (e) => {
    const { files } = e.target;
    const file = files[0] || "";
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/media-upload`,
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
          uploadFile: response.data.file_url,
        }));
      }
      setErrors((prev) => ({ ...prev, uploadFile: "" }));
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    // Clear the file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setFormData((prevState) => ({
      ...prevState,
      uploadFile: null, // Remove the image preview
    }));
  };

  // Validate form data
  const validateForm = () => {
    let formErrors = {};
    if (!data.title) formErrors.title = "Title is required.";
    if (!data.description) formErrors.description = "Description is required.";
    if (!data.uploadFile) formErrors.uploadFile = "Upload file is required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("download_page_title", data.title);
    formData.append("download_page_description", data.description);
    formData.append("download_page_image", data.uploadFile);

    if (!token) return toast.error("You need to login first.");
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/settings/download-page`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Download page updated successfully.");
        setRender(true);
      }
    } catch (error) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update download page");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (downloadPage) {
      setFormData({
        title: downloadPage?.settings?.download_page_title || "",
        description: downloadPage?.settings?.download_page_description || "",
        uploadFile: downloadPage?.settings?.download_page_image || "",
      });
    }
  }, [downloadPage]);

  return (
    <div className="boxShadow-table bg-white dark:bg-[#1F2836] relative text-[16px]">
      <TitleDynamic title="Download" />

      <div className="p-6 space-y-5">
        {/* Title Field */}
        <InputField
          type="text"
          name="title"
          value={data?.title}
          onChange={handleChange}
          placeholder="Title"
          label="Title"
          error={errors.title}
          required={true}
        />
        <InputField
          type="textarea"
          name="description"
          value={data?.description}
          onChange={handleChange}
          placeholder="Description"
          label="Description"
          error={errors.description}
          required={true}
        />

        <InputField
          type="file"
          name="uploadFile"
          image={data?.uploadFile}
          onChange={handleFileChange}
          close={handleRemoveFile}
          placeholder="Upload File"
          label="Upload File"
          refState={fileInputRef}
          error={errors.uploadFile}
          required={true}
        />

        {/* Submit Button */}
        <div className="flex items-center gap-3 ">
          <button onClick={handleSubmit} className="button_gradient">
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Loading...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DownlandPage;

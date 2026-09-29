import { useState, useRef } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";
import InputField from "../../../components/InputField";

function WhyAdd({ whyAddedModalOpen, setWhyAddedModalOpen, setWhyUsData }) {

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [imgLink, setImgLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const token = Cookies.get("token");

  const handleBannerImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("files[]", file);
      try {
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
        setImgLink(response.data.file_urls[0]);
      } catch (error) {
        // console.log(error);
      }
    }
  };

  const handleImageDeselect = () => {
    setImgLink("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!imgLink) newErrors.imgLink = "Image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhyAdded = () => {
    if (!validateForm()) return;
    setLoading(true);

    const formData = new FormData();
    if (imgLink) {
      formData.append("image", imgLink);
    }
    formData.append("title", title);
    formData.append("description", description);


    axios
      .post(
        `${import.meta.env.VITE_API_HOST}/admin/payment-feature-showcases`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        if (response?.status === 201) {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_HOST}/admin/payment-feature-showcases`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setWhyUsData(response?.data);
          } catch (err) {
            // console.error("Error fetching data:", err);
          }
          toast.success(
            "Why choose our payment system feature added successfully"
          );
          setWhyAddedModalOpen("");
          setDescription("");
          setTitle("");
          setImgLink('');
        }
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to add feature");
        setLoading(false);
      });
  };

  return (
    <>
      {whyAddedModalOpen && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/20"
        >
          <div className="relative w-full max-w-3xl max-h-full overflow-y-auto">
            <div className="relative p-10 bg-white rounded-[4px] shadow dark:bg-gray-700">
              <div className="relative space-y-5 text-black dark:text-white">
                <InputField
                  label="Title"
                  value={title}
                  onChange={setTitle}
                  id="title"
                  error={errors.title}
                  required={true}
                />
                <InputField
                  label="Description"
                  value={description}
                  onChange={setDescription}
                  id="description"
                  type="textarea"
                  error={errors.description}
                  required={true}
                />

                <InputField
                  type="file"
                  name="BannerImage"
                  image={imgLink}
                  onChange={handleBannerImage}
                  close={handleImageDeselect}
                  placeholder="Choose Image"
                  label="Choose Image"
                  refState={fileInputRef}
                  error={errors.imgLink}
                  required={true}
                />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <button
                  disabled={loading}
                  onClick={handleWhyAdded}
                  type="button"
                  className="button_gradient"
                >
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
                  onClick={() => {
                    setWhyAddedModalOpen(!whyAddedModalOpen);
                  }}
                  type="button"
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

export default WhyAdd;

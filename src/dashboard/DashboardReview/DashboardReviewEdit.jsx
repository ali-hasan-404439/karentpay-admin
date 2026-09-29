import { useEffect, useRef, useState } from "react";

import { LuCheck } from "react-icons/lu";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa6";
import InputField from "../../components/InputField";

function DashboardReviewEdit({
  setReviewEditModalOpen,
  reviewEditModalOpen,
  setItemsData,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [message, setMessage] = useState("");
  const [designation, setDesignation] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const newsImageRef = useRef(null);

  const token = Cookies.get("token");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (reviewEditModalOpen) {
      setName(reviewEditModalOpen.user_name || "");
      setEmail(reviewEditModalOpen.user_email || "");
      setData(reviewEditModalOpen.date || "");
      setMessage(reviewEditModalOpen.review_details || "");
      setStatus(reviewEditModalOpen.status || "");
      setImageURL(reviewEditModalOpen.user_image || "");
      setDesignation(reviewEditModalOpen.position || "");
    }
  }, [reviewEditModalOpen]);

  const handleNewsImage = async (event) => {
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
        setImageURL(response.data.file_urls[0]);
      } catch (error) {
        // console.log(error);
      }
    }
  };
  const clearNewsImage = () => {
    setImageURL("");
    if (newsImageRef.current) {
      newsImageRef.current.value = "";
    }
  };

  const validateFields = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!designation.trim()) errors.designation = "Designation is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      errors.email = "A valid email is required.";
    if (!status.trim()) errors.status = "Status is required.";
    if (!imageURL.trim()) errors.imageURL = "Image is required.";
    if (!message.trim()) errors.message = "Review details are required.";
    if (!data) errors.date = "Date is required.";
    return errors;
  };

  const handleReview = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("user_name", name);
    formData.append("position", designation);
    formData.append("user_email", email);
    formData.append("status", status);
    formData.append("_method", 'PUT');
    if (imageURL) {
      formData.append("user_image", imageURL);
    }
    formData.append("review_details", message);
    formData.append("date", data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/reviews/${reviewEditModalOpen?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setItemsData((prv) => {
        return prv.map((item) => {
          if (item.id === reviewEditModalOpen.id) {
            return { ...item, user_name: name, position: designation, user_email: email, status: status, user_image: imageURL, review_details: message, date: data }
          }
          return item
        })
      })
      toast.success("Review added successfully");
      setName("");
      setImageURL("");
      setStatus("");
      setDesignation("");
      setMessage("");
      setData("");
      setEmail("");
      setErrors({});
    } catch (error) {
      if (error?.response.data.message) {
        toast.error(error?.response.data.message);
      } else {
        toast.error("Failed to add review");
      }
    }
    setReviewEditModalOpen("");
    setLoading(false);
  };

  return (
    <>
      {reviewEditModalOpen && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/40"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto ">
            <div className="relative p-10 bg-white rounded-[4px] shadow dark:bg-gray-700">
              <div className="relative space-y-5 text-black dark:text-white">
                <InputField
                  type="text"
                  name="title"
                  value={name}
                  onChange={setName}
                  placeholder="Name"
                  label="Name"
                  error={errors.name}
                  id="title"
                  required={true}
                />
                <InputField
                  type="text"
                  name="designation"
                  value={designation}
                  onChange={setDesignation}
                  placeholder="Designation"
                  label="Designation"
                  error={errors.designation}
                  id="designation"
                  required={true}
                />
                <InputField
                  type="email"
                  name="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Email"
                  label="Email"
                  error={errors.email}
                  id="email"
                  required={true}
                />

                <div className="relative">
                  <label
                    htmlFor="Youtube"
                    className="mb-2 inline-block text-sm  sm:text-base"
                  >
                    Status <span className="text-red-600">*</span>
                  </label>
                  <select
                    onChange={(e) => setStatus(e.target.value)}
                    type="text"
                    id="Youtube"
                    name="siteUrl"
                    className={` border   text-gray-900 rounded-[4px] ${status
                      ? "border-green-500 dark:border-green-500 "
                      : "border-gray-300"
                      } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                    placeholder="Your Youtube"
                    defaultValue={status}
                    required
                  >
                    <option>Choose Status</option>
                    <option>pending</option>
                    <option>approved </option>
                  </select>
                  {status && (
                    <span className="absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
                      <LuCheck />
                    </span>
                  )}
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                  )}
                </div>
                <InputField
                  type="text"
                  name="imageURL"
                  value={imageURL}
                  onChange={setImageURL}
                  placeholder="Image URL"
                  label="Image URL"
                  error={errors.imageURL}
                />
                <InputField
                  type="file"
                  name="imageURL"
                  image={imageURL}
                  onChange={handleNewsImage}
                  close={clearNewsImage}
                  placeholder="Banner Image"
                  label="Banner Image"
                  refState={newsImageRef}
                  error={errors.imageURL}
                  required={true}
                />

                <InputField
                  type="textarea"
                  name="Review"
                  value={message}
                  onChange={setMessage}
                  placeholder="Review Details"
                  label="Review Details"
                  error={errors.message}
                  id="Review"
                  required={true}
                />
                <div className="relative">
                  <label
                    htmlFor="Host"
                    className="mb-2 inline-block text-sm  sm:text-base"
                  >
                    Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={(e) => setData(e.target.value)}
                    type="date"
                    id="Host"
                    name="siteUrl"
                    className={` border   text-gray-900 rounded-[4px] ${data
                      ? "border-green-500 dark:border-green-500 "
                      : "border-gray-300"
                      } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                    placeholder="Email"
                    required
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 ">
                  <button
                    onClick={handleReview}
                    type="button"
                    className="button_gradient"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>Updated</>
                    )}
                  </button>
                  <button
                    onClick={() => setReviewEditModalOpen("")}
                    type="button"
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

export default DashboardReviewEdit;

import { useState, useRef } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";
import InputField from "../../../components/InputField";

function BannerSliderAdded({ bannerSliderAdd, setBannerSliderAdd, setData }) {
  const [loading, setLoading] = useState(false);
  const [bannerDescription, setBannerDescription] = useState("");
  const [buttonFirst, setButtonFirst] = useState("");
  const [buttonFirstLink, setButtonFirstLink] = useState("");
  const [buttonSecond, setButtonSecond] = useState("");
  const [buttonSecondLink, setButtonSecondLink] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const token = Cookies.get("token");

  const validateFields = () => {
    const newErrors = {};
    if (!bannerDescription.trim()) newErrors.bannerDescription = "Banner description is required.";
    if (!buttonFirst.trim()) newErrors.buttonFirst = "First button text is required.";
    if (!buttonSecond.trim()) newErrors.buttonSecond = "Second button text is required.";
    if (!bannerImage) newErrors.bannerImage = "Banner image is required.";
    return newErrors;
  };

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
        setBannerImage(response.data.file_urls[0]);
      } catch (error) {
        toast.error("Failed to upload image.");
      }
    }
  };

  const handleImageDeselect = () => {
    setBannerImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFaqAdded = async () => {
    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("BannerImage", bannerImage);
    formData.append("BannerText", bannerDescription);
    formData.append("ButtonText1", buttonFirst);
    formData.append("ButtonText1Link", buttonFirstLink);
    formData.append("ButtonText2", buttonSecond);
    formData.append("ButtonText2Link", buttonSecondLink);

    axios
      .post(
        `${import.meta.env.VITE_API_HOST}/admin/home-image-sliders`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        if (response?.status === 201) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_HOST}/admin/home-image-sliders`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setData(res.data);
          toast.success("Banner successfully added");
          setBannerSliderAdd("");
          setLoading(false);
          setBannerImage("");
          setBannerDescription("");
          setButtonFirst("");
          setButtonFirstLink("");
          setButtonSecond("");
          setButtonSecondLink("");
          setErrors({});
        }
      })
      .catch(() => {
        toast.error("Failed to add banner");
        setLoading(false);
      });
  };

  return (
    <>
      {bannerSliderAdd && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/30"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative p-10 bg-white rounded-[4px] shadow dark:bg-gray-700">
              <div className="relative space-y-5 text-black dark:text-white">
                <InputField
                  label="Button First Text"
                  value={buttonFirst}
                  onChange={setButtonFirst}
                  id="ButtonFirst"
                  required={true}
                  error={errors.buttonFirst}
                />
                <InputField
                  label="Button First Link"
                  value={buttonFirstLink}
                  onChange={setButtonFirstLink}
                  id="ButtonFirstLink"
                  type="url"
                />
                <InputField
                  label="Button Second Text"
                  value={buttonSecond}
                  onChange={setButtonSecond}
                  id="ButtonSecond"
                  required={true}
                  error={errors.buttonSecond}
                />
                <InputField
                  label="Button Second Link"
                  value={buttonSecondLink}
                  onChange={setButtonSecondLink}
                  id="ButtonSecondLink"
                  type="url"
                />
                <InputField
                  label="Banner Title"
                  value={bannerDescription}
                  onChange={setBannerDescription}
                  id="BannerDescription"
                  type="textarea"
                  required={true}
                  error={errors.bannerDescription}
                />
                <InputField
                  label="Image URL"
                  value={bannerImage}
                  onChange={setBannerImage}
                  id="BannerImageURL"
                  type="url"
                  error={errors.bannerImage}
                />
                <InputField
                  type="file"
                  name="BannerImage"
                  image={bannerImage}
                  onChange={handleBannerImage}
                  close={handleImageDeselect}
                  placeholder="Banner Image"
                  label="Banner Image"
                  refState={fileInputRef}
                  required={true}
                  error={errors.bannerImage}
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFaqAdded}
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
                      <>Add Banner</>
                    )}
                  </button>
                  <button
                    onClick={() => setBannerSliderAdd("")}
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

export default BannerSliderAdded;

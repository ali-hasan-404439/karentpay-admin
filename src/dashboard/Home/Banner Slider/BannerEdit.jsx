import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import InputField from "../../../components/InputField";

function BannerEdit({ bannerEdit, setBannerEdit, setData }) {
  const [bannerDescription, setBannerDescription] = useState("");
  const [buttonFirst, setButtonFirst] = useState("");
  const [buttonFirstLink, setButtonFirstLink] = useState("");
  const [buttonSecond, setButtonSecond] = useState("");
  const [buttonSecondLink, setButtonSecondLink] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const token = Cookies.get("token");

  // Handle image file selection
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
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image");
      }
    }
  };

  const handleImageDeselect = () => {
    setBannerImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!bannerDescription) newErrors.bannerDescription = "Banner description is required";
    if (!buttonFirst) newErrors.buttonFirst = "First button text is required";
    if (!buttonSecond) newErrors.buttonSecond = "Second button text is required";
    if (!bannerImage && !bannerImageURL) {
      newErrors.bannerImage = "Either an uploaded image or an image URL is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleBannerSliderEdit = () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    if (bannerImage) formData.append("BannerImage", bannerImage);
    formData.append("BannerText", bannerDescription);
    formData.append("ButtonText1", buttonFirst);
    formData.append("ButtonText1Link", buttonFirstLink);
    formData.append("ButtonText2", buttonSecond);
    formData.append("ButtonText2Link", buttonSecondLink);
    formData.append("_method", "PUT");

    axios
      .post(
        `${import.meta.env.VITE_API_HOST}/admin/home-image-sliders/${bannerEdit?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response?.status === 200) {
          setData((prev) => {
            return prev.map((item) => {
              if (item.id === bannerEdit.id) {
                return {
                  ...item,
                  BannerText: bannerDescription,
                  ButtonText1: buttonFirst,
                  ButtonText1Link: buttonFirstLink,
                  ButtonText2: buttonSecond,
                  ButtonText2Link: buttonSecondLink,
                  BannerImage: bannerImage,
                };
              }
              return item;
            });
          });
          toast.success("Banner successfully edited");
          setBannerEdit("");
        }
      })
      .catch(() => {
        toast.error("Failed to edit banner");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (bannerEdit) {
      setBannerDescription(bannerEdit.BannerText || "");
      setButtonFirst(bannerEdit.ButtonText1 || "");
      setButtonFirstLink(bannerEdit.ButtonText1Link || "");
      setButtonSecond(bannerEdit.ButtonText2 || "");
      setButtonSecondLink(bannerEdit.ButtonText2Link || "");
      setBannerImage(bannerEdit.BannerImage || "");
    }
  }, [bannerEdit]);

  return (
    <>
      {bannerEdit && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/10"
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
                  error={errors.bannerImage}
                  required={true}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBannerSliderEdit}
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
                      <>Updated Banner</>
                    )}
                  </button>
                  <button
                    onClick={() => setBannerEdit(!bannerEdit)}
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

export default BannerEdit;

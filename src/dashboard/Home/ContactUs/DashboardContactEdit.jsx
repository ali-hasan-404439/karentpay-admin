import { useEffect, useState, useRef } from "react";

import useFetchData from "../../../utils/useFetchData";

import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import InputField from "../../../components/InputField";

function DashboardContactView({
  setContactEditModalOpen,
  contactEditModalOpen,
  setContactData,
}) {
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [imgLink, setImgLink] = useState("");
  const [isDesible, setIsDesible] = useState(false);

  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  const token = Cookies.get("token");
  useEffect(() => {
    if (contactEditModalOpen) {
      setName(contactEditModalOpen.BranchOfficeName || "");
      setAddress1(contactEditModalOpen.BranchOfficeAddress1 || "");
      setAddress2(contactEditModalOpen.BranchOfficeAddress2 || "");
      setPhone1(contactEditModalOpen.BranchOfficePhone1 || "");
      setPhone2(contactEditModalOpen.BranchOfficePhone2 || "");
      setPhone3(contactEditModalOpen.BranchOfficePhone3 || "");
      setImgLink(contactEditModalOpen.BranchOfficeImage || "");
    }
  }, [contactEditModalOpen]);

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
  const validateFields = () => {
    const validationErrors = {};

    if (!name.trim()) validationErrors.name = "Name is required.";
    if (!address1.trim()) validationErrors.address1 = "Address 1 is required.";
    if (!phone1.trim()) {
      validationErrors.phone1 = "Phone 1 is required.";
    }
    if (!imgLink) validationErrors.imgLink = "Image is required.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleContactEdit = () => {
    if (!validateFields()) return;

    setIsDesible(true);
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("BranchOfficeName", name);
    formData.append("BranchOfficeAddress1", address1);
    formData.append("BranchOfficeAddress2", address2);
    formData.append("BranchOfficePhone1", phone1);
    formData.append("BranchOfficePhone2", phone2);
    formData.append("BranchOfficePhone3", phone3);
    if (imgLink) {
      formData.append("BranchOfficeImage", imgLink);
    }

    axios
      .post(
        `${import.meta.env.VITE_API_HOST}/admin/contact-page-locations/${contactEditModalOpen.id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response?.status === 200) {
          setContactData((prv) => {
            return prv.map((item) => {
              if (item.id === contactEditModalOpen.id) {
                return {
                  ...item,
                  BranchOfficeName: name,
                  BranchOfficeAddress1: address1,
                  BranchOfficeAddress2: address2,
                  BranchOfficePhone1: phone1,
                  BranchOfficePhone2: phone2,
                  BranchOfficePhone3: phone3,
                  BranchOfficeImage: imgLink
                };
              }
              return item;
            })
          });
          toast.success("Contact updated successfully");
          setContactEditModalOpen("");
        }
        setIsDesible(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        setIsDesible(false);
      });
  };
  return (
    <>
      {contactEditModalOpen && (
        <div
          id="popup-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black/10"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="relative p-5 bg-white rounded-[4px] shadow dark:bg-gray-700">
              <div className="relative p-10 space-y-5 text-black dark:text-white">
                {/* here */}
                <InputField
                  label="Name"
                  value={name}
                  onChange={setName}
                  id="Name"
                  error={errors.name}
                  required={true}
                />
                <InputField
                  label="Address 1"
                  value={address1}
                  onChange={setAddress1}
                  id="Address1"
                  error={errors.address1}
                  required={true}
                />
                <InputField
                  label="Address 2"
                  value={address2}
                  onChange={setAddress2}
                  id="Address2"
                />
                <InputField
                  label="Phone 1"
                  value={phone1}
                  onChange={setPhone1}
                  id="Phone1"
                  error={errors.phone1}
                  required={true}
                />
                <InputField
                  label="Phone 2"
                  value={phone2}
                  onChange={setPhone2}
                  id="Phone2"
                />
                <InputField
                  label="Phone 3"
                  value={phone3}
                  onChange={setPhone3}
                  id="Phone3"
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
                <div className="flex items-center gap-2">
                  <button
                    disabled={isDesible}
                    onClick={() => handleContactEdit(contactEditModalOpen.id)}
                    type="button"
                    className="button_gradient"
                  >
                    {isDesible ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>Updated</>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setImgLink('');
                      setContactEditModalOpen("");
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
        </div>
      )}
    </>
  );
}

export default DashboardContactView;

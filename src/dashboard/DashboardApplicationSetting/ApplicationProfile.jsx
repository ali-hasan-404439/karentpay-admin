import { useState, useEffect, useContext } from "react";

import { LuCheck } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

import { toast } from "react-toastify";

import TitleDynamic from "../../TitleDynamic";
import Auth from "../../utils/Auth";
import { FaSpinner } from "react-icons/fa";
import { contextAuth } from "../../pages/ContextProvider";

function ApplicationProfile() {
  const { setUser } = useContext(contextAuth);
  const { ApiRequest } = Auth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [presentRole, setPresentRole] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploadImage, setUploadImage] = useState("");
  const [userData, setUserData] = useState({});
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    setLoadingData(true);
    const response = await ApiRequest({
      url: "/admin/profile",
      method: "get",
    });

    if (response?.status === 200) {
      setUser(response.data);
      localStorage.setItem("admin_user", JSON.stringify(response.data));
      setUserData(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
      setPresentRole(response.data.phone);
      if (response.data.avatar) {
        setUploadImage(response.data.avatar);
      }
    } else {
      toast.error(response?.message);
    }
    setLoadingData(false);
  };

  const submit = async () => {
    setLoading(true);
    var formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("phone", presentRole);
    formdata.append("oldPassword", oldPassword);
    formdata.append("newPassword", newPassword);
    formdata.append("confirmPassword", confirmPassword);
    formdata.append("avatar", avatar ? avatar : "");

    try {
      const response = await ApiRequest({
        url: "/admin/update_profile",
        formdata: formdata,
        type: "multipart/form-data",
      });
      getProfile();
      window.location.reload();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <TitleDynamic title="Profile Setting" />

      <div className="relative">
        <label
          htmlFor="name"
          className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white "
        >
          Name
        </label>

        <input
          onChange={(e) => setName(e.target.value || userData.name)}
          type="text"
          id="name"
          name="siteUrl"
          defaultValue={userData.name}
          className={`border  text-gray-900 rounded-[4px]  block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${name ? "focus:ring-green-500  border-green-500" : "border-gray-300 "
            }`}
          placeholder="Your Name"
          required
        />

        {name && (
          <span className="absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
            <LuCheck />
          </span>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="email"
          className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white "
        >
          Email
        </label>

        <input
          onChange={(e) => setEmail(userData.email)}
          type="emial"
          id="email"
          name="siteUrl"
          className={`border  text-gray-900 rounded-[4px]  block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${email
            ? "focus:ring-green-500  border-green-500"
            : "border-gray-300 "
            }`}
          defaultValue={userData.email}
          placeholder="Your Email"
        />

        {email && (
          <span className="absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
            <LuCheck />
          </span>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="role"
          className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white "
        >
          Phone
        </label>

        <input
          onChange={(e) => setPresentRole(e.target.value)}
          type="number"
          id="role"
          name="siteUrl"
          className={`border  text-gray-900 rounded-[4px]  block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${presentRole
            ? "focus:ring-green-500  border-green-500"
            : "border-gray-300 "
            }`}
          placeholder="Your Present Role"
          defaultValue={userData.phone}
          required
        />

        {presentRole && (
          <span className="absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
            <LuCheck />
          </span>
        )}
      </div>

      <hr className="mt-5 text-green-500 " />

      <div className="relative">
        <label
          htmlFor="old"
          className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white "
        >
          Old Password *
        </label>

        <input
          onChange={(e) => setOldPassword(e.target.value)}
          type="text"
          id="old"
          name="siteUrl"
          className={`border  text-gray-900 rounded-[4px]  block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${oldPassword
            ? "focus:ring-green-500  border-green-500"
            : "border-gray-300 "
            }`}
          placeholder="Your Old Password"
          required
        />

        {oldPassword && (
          <span className="absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
            <LuCheck />
          </span>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="New"
          className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white "
        >
          New Password (optional)
        </label>

        <input
          onChange={(e) => setNewPassword(e.target.value)}
          type="text"
          id="New"
          name="siteUrl"
          className={`border  text-gray-900 rounded-[4px]  block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${newPassword
            ? "focus:ring-green-500  border-green-500"
            : "border-gray-300 "
            }`}
          placeholder="Your New Password"
          required
        />

        {newPassword && (
          <span className="absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
            <LuCheck />
          </span>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="Confirm"
          className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white "
        >
          Confirm New Password (optional)
        </label>

        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="text"
          id="Confirm"
          name="siteUrl"
          className={`border  text-gray-900 rounded-[4px]  block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${confirmPassword
            ? "focus:ring-green-500  border-green-500"
            : "border-gray-300 "
            }`}
          placeholder="Your Confirm Password"
          required
        />

        {confirmPassword && (
          <span className="absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
            <LuCheck />
          </span>
        )}
      </div>

      <div>
        <h2 className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white ">
          Upload Image
        </h2>
        <input
          onChange={handleUploadImage}
          accept=".jpg"
          className="block w-full text-gray-900 border border-gray-300 rounded-[4px] cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-40"
          id="file_input"
          type="file"
        />

        {loadingData ? (
          <div className="relative mt-2 max-w-[300px] max-h-[300px] flex items-center justify-center">
            {/* Skeleton Loader */}
            <div className="w-full h-[200px] bg-gray-300 animate-pulse rounded-md">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500 text-xl"></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={uploadImage}
              alt="background"
              className="mt-3 relative max-w-[200px] max-h-[200px] rounded-md"
            />
            {uploadImage && (
              <span
                onClick={() => setUploadImage("")}
                className="absolute top-1 left-[210px] flex justify-center items-center  w-7 h-7 rounded-[50%] text-center bg-red-600 text-white dark:bg-gray-500"
              >
                <RiDeleteBin6Line />
              </span>
            )}
          </div>
        )}
      </div>

      <button
        onClick={submit}
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
          " Update New"
        )}
      </button>
    </div>
  );
}

export default ApplicationProfile;

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";

function ProgressUpload({ setAppFile, appFile }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0);
    }
  };

  const postFile = () => {
    if (!file || !token) return;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "exe") {
      return toast.error(
        "The file type .exe is not supported. Please select a different file."
      );
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const request = new XMLHttpRequest();
    request.open("POST", `${import.meta.env.VITE_API_HOST}/admin/media-upload`);
    request.setRequestHeader("Authorization", `Bearer ${token}`);

    request.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    });

    request.onload = () => {
      const data = JSON.parse(request.responseText);
      if (request.status === 200 && data.file_url) {
        setUploadedFile(data.file_url);
        toast.success("File uploaded successfully!");
        setLoading(false);
      } else if (data.message) {
        toast.error(data.message);
        setLoading(false);
      }
    };

    request.onerror = () => {
      toast.error("File upload failed. Please try again.");
      setLoading(false);
    };

    request.send(formData);
  };

  useEffect(() => {
    if (uploadedFile) {
      setAppFile(uploadedFile);
    }
  }, [uploadedFile]);

  useEffect(() => {
    if (appFile) {
      setUploadedFile(appFile);
    }
  }, [appFile]);

  return (
    <div className="relative">
      <label
        htmlFor="app_file"
        className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white"
      >
        Application File <span className="text-red-600">*</span>
      </label>
      <input
        name="app_file"
        value={uploadedFile || ""}
        onChange={(e) => setUploadedFile(e.target.value)}
        placeholder="Application url"
        className="block w-full text-sm p-3 text-gray-900 border border-gray-300 rounded cursor-text bg-gray-50 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        type="text"
      />
      <input
        id="app_file"
        name="app_file"
        onChange={handleFileChange}
        className="block w-full text-gray-900 border border-gray-300 rounded cursor-text bg-gray-50 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 mt-2"
        type="file"
      />
      {file && progress && (
        <div className="w-full bg-gray-200 rounded dark:bg-gray-700 my-2">
          <div
            className="bg-green-500 text-blue-100 text-center text-sm p-0.5 leading-none rounded"
            style={{ width: `${progress}%` }}
          >
            {progress > 1 ? `${progress}%` : ""}
          </div>
        </div>
      )}
      {file && (
        <button type="button" onClick={postFile} className="button_gradient">
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Loading...
            </>
          ) : (
            "Upload File"
          )}
        </button>
      )}
    </div>
  );
}

export default ProgressUpload;

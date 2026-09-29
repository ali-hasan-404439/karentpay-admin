import { useState } from "react";

import { FaSpinner } from "react-icons/fa";

import InputField from "../../components/InputField";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function PostCategoriesAdd({ addPostModal, setAddPostModal, setTotal, setPostCategories, ItemsPerPage, currentPage }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  const addPost = async () => {
    if (!title.trim()) return toast.error("Category name is required!");
    const data = {
      name: title,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/news/categories`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/news/categories?page=${currentPage}&per_page=${ItemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTotal({
          totalItems: response?.data?.total,
          totalPage: response?.data?.last_page,
        });
        setPostCategories(response.data?.data);
      } catch (err) {
        // console.log(err);
      }
      toast.success("Post category added successfully!");
      setTitle("");
    } catch (error) {
      toast.error("Failed to add post category!");
    } finally {
      setAddPostModal(false);
      setLoading(false);
    }
  };

  return (
    <>
      {addPostModal && (
        <div
          id="default-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative w-full max-w-3xl max-h-full p-4 text-black dark:text-white">
            <div className="relative bg-white rounded-[4px] shadow dark:bg-gray-700">
              <div className="p-10 space-y-5">
                <InputField
                  label="Category Name"
                  value={title}
                  onChange={setTitle}
                  id="name"
                  required={true}
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={addPost}
                    disabled={loading}
                    className="button_gradient"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Add Category"
                    )}
                  </button>
                  <button
                    onClick={() => setAddPostModal(false)}
                    className="button_cancel"
                  >
                    Close
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

export default PostCategoriesAdd;

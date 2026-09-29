import { useEffect, useState } from "react";

import { FaSpinner } from "react-icons/fa";

import InputField from "../../components/InputField";

import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function PostCategoriesEdit({ editPostModal, setEditPostModal, setPostCategories }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  useEffect(() => {
    setTitle(editPostModal.name);
  }, [editPostModal]);

  const EditCategories = async () => {
    if (!title.trim()) return toast.error("Category name is required!");
    const data = {
      name: title,
    };
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_HOST}/admin/news/categories/${editPostModal.id
        }`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPostCategories((prv) => {
        return prv.map((item) => {
          if (item.id === editPostModal.id) {
            return { ...item, name: title };
          }
          return item;
        });
      });
      toast.success("Category updated successfully!");
    } catch (error) {
      toast.error("Failed to update category!");
    } finally {
      setEditPostModal("");
      setLoading(false);
    }
  };

  return (
    <>
      {editPostModal && (
        <div
          id="default-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50 bg-black/10"
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
                    onClick={EditCategories}
                    disabled={loading}
                    className="button_gradient"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" /> Loading...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                  <button
                    onClick={() => setEditPostModal(false)}
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

export default PostCategoriesEdit;

import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

import useFetchData from "../../utils/useFetchData";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";
import SaneEditor from "../../SaneEditor";
import InputField from "../../components/InputField";

function AllPostEdit({
  newsAllPostViewModalOpen,
  setNewsAllPostViewModalOpen,
  setData,
}) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showCategoryList, setShowCategoryList] = useState(false);

  const [errors, setErrors] = useState({});
  const [newsImage, setNewsImage] = useState("");
  const newsImageRef = useRef(null);

  const token = Cookies.get("token");

  const handleNewsImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('files[]', file);
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_HOST}/admin/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        setNewsImage(response.data.file_urls[0]);
      }
      catch (error) {
        // console.log(error);
      }
    }
  };
  const clearNewsImage = () => {
    setNewsImage("")
    if (newsImageRef.current) {
      newsImageRef.current.value = '';
    }
  };

  const categoriesData = useFetchData("/admin/news/categories");
  const { data: categories } = categoriesData?.data;

  useEffect(() => {
    setTitle(newsAllPostViewModalOpen?.title);
    setDescription(newsAllPostViewModalOpen?.content);
    setCategoryId(newsAllPostViewModalOpen?.category);
    setNewsImage(newsAllPostViewModalOpen?.featured_image);
  }, [newsAllPostViewModalOpen]);

  function editorContent(content) {
    setDescription(content);
  }
  const validateFields = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required.";
    if (!newsImage.trim()) errors.newsImage = "Image is required.";
    if (!description.trim()) errors.description = "Description is required.";
    if (!categoryId?.id) errors.categoryId = "Category is required.";
    return errors;
  };
  const handleUpdatePost = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("category_id", categoryId?.id);
    formData.append("user_id", newsAllPostViewModalOpen?.user_id);
    formData.append("title", title);
    formData.append("content", description);
    formData.append("_method", "PUT");
    if (newsImage) {
      formData.append("featured_image", newsImage);
    }

    const token = Cookies.get("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST
        }/admin/news/articles/${newsAllPostViewModalOpen?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Post updated successfully!");
      setData((pre) => {
        return pre.map((item) => {
          if (item.id === newsAllPostViewModalOpen?.id) {
            return {
              ...item,
              title,
              content: description,
              category_id: categoryId?.id,
              user_id: newsAllPostViewModalOpen?.user_id,
              featured_image: newsImage,
            };
          }
          return item;
        });
      });

      // Toggle the modal state
      setLoading(false);
      setNewsAllPostViewModalOpen("");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to add post. Please try again.");
    }
  };

  return (
    <>
      {newsAllPostViewModalOpen && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-50"
        >
          <div className="relative w-full max-w-3xl mx-auto my-0 max-h-[90vh] overflow-y-auto text-black dark:text-white bg-white rounded-[4px] shadow dark:bg-gray-700 ">
            <div className="relative p-10">
              <form className="space-y-5 text-left">
                <InputField
                  type="text"
                  name="title"
                  value={title}
                  onChange={setTitle}
                  placeholder="Title"
                  label="Title"
                  error={errors.title}
                  required={true}
                />

                <div className="relative ">
                  <label
                    htmlFor="Description"
                    className="mb-2 inline-block text-sm  sm:text-base"
                  >
                    Description <span className="text-red-600">*</span>
                  </label>
                  <SaneEditor
                    editorContent={editorContent}
                    initialContent={newsAllPostViewModalOpen?.content}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div className="relative ">
                  <label
                    htmlFor="Description"
                    className="mb-2 inline-block text-sm  sm:text-base"
                  >
                    Category <span className="text-red-600">*</span>
                  </label>
                  <div
                    id="showCategoryList"
                    onClick={() => setShowCategoryList(!showCategoryList)}
                    className="relative rounded-[4px] w-full"
                  >
                    <div className="flex items-center">
                      <h3
                        className={`border  text-gray-900  ${showCategoryList
                          ? "rounded-t-[4px] "
                          : "rounded-[4px] "
                          }  block w-full p-3 bg-gray-50 dark:bg-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:border-none  ${categoryId
                            ? " focus:border-green-500 border-green-500"
                            : "border-gray-300 "
                          }`}
                      >
                        {categoryId
                          ? categoryId.name
                          : "Select Post Category..."}
                      </h3>
                      <div className="absolute top-4 right-2">
                        <svg
                          className={`w-2.5 h-2.5 ms-3 text-gray-400 transition-transform transform ${showCategoryList ? "rotate-180" : ""
                            }`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </div>
                    </div>

                    {categoryId && (
                      <div
                        onClick={() => setCategoryId("")}
                        className="absolute top-[13px] right-[.3rem] p-1 rounded-full bg-gradient-to-r from-[#395BEF] to-[#5C28D5] text-white"
                      ><IoMdClose onClick={() => setShowCategoryList(false)} />
                      </div>
                    )}
                    {errors.categoryId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.categoryId}
                      </p>
                    )}

                    {showCategoryList && (
                      <div
                        id="showCategoryList"
                        className="absolute top-[3.2rem] left-0 right-0 bg-gray-50 rounded-b-md z-10 max-h-[400px] overflow-y-auto dark:bg-[#374151]"
                      >
                        {categories &&
                          categories.map((cat) => (
                            <div
                              key={cat.id}
                              className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                              onClick={() => {
                                setCategoryId(cat);
                                setShowCategoryList(!showCategoryList);
                              }}
                            >
                              <span>{cat?.name}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <InputField
                  type="file"
                  name="newsImage"
                  image={newsImage}
                  onChange={handleNewsImage}
                  close={clearNewsImage}
                  placeholder="News Image"
                  label="News Image"
                  refState={newsImageRef}
                  error={errors.newsImage}
                  required={true}
                />
              </form>

              <div className="flex items-center gap-2 mt-5">
                <button
                  type="submit"
                  onClick={handleUpdatePost}
                  className="button_gradient"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Update Post"
                  )}
                </button>

                <button
                  onClick={() => setNewsAllPostViewModalOpen("")}
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

export default AllPostEdit;

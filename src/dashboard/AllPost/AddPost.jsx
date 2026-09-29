import { useEffect, useRef, useState } from "react";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import useFetchData from "../../utils/useFetchData";
import SaneEditor from "../../SaneEditor";
import InputField from "../../components/InputField";

function AddPost({ addPostModal, setAddPostModal, setData, setTotal, currentPage, ItemsPerPage }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryList, setShowCategoryList] = useState("");
  const [loading, setLoading] = useState(false);

  const newsImageRef = useRef(null);
  const [newsImage, setNewsImage] = useState("");
  const [error, setError] = useState({});

  const token = Cookies.get("token");

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
        setNewsImage(response.data.file_urls[0]);
      } catch (error) {
        // console.log(error);
      }
    }
  };

  const clearNewsImage = () => {
    setNewsImage("");
    if (newsImageRef.current) {
      newsImageRef.current.value = "";
    }
  };

  // Fetch all categories
  const categoriesData = useFetchData("/admin/news/categories");
  const { data: categories } = categoriesData?.data;

  // Validation function
  const validateFields = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required.";
    if (!newsImage.trim()) errors.newsImage = "Image is required.";
    if (!description.trim()) errors.description = "Description is required.";
    if (!category?.id) errors.category = "Category is required.";
    return errors;
  };

  // Add post method function
  const handleAddPost = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("admin_user"));

    const formData = new FormData();
    formData.append("category_id", category?.id);
    formData.append("user_id", user?.id);
    formData.append("title", title);
    formData.append("content", description);
    if (newsImage) {
      formData.append("featured_image", newsImage);
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/news/articles`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST
          }/admin/news/articles?page=${currentPage}&per_page=${ItemsPerPage}`,
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
        setData(response?.data?.data);
      } catch (err) {
        // console.log(err);
      }
      toast.success("Post added successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      clearNewsImage();
      setNewsImage("");
    } catch (error) {
      // console.log(error);
      toast.error("Failed to add post. Please try again.");
    }
    setLoading(false);
    setAddPostModal(!addPostModal);
  };

  function editorContents(text) {
    setDescription(text);
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (!event.target.closest("#showCategoryList")) {
        setShowCategoryList(false);
      }
    };
    window.document.addEventListener("click", handleClickOutsideSearch);
    return () => {
      window.document.removeEventListener("click", handleClickOutsideSearch);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setAddPostModal(!addPostModal)}
        className="button_gradient w-full md:w-auto whitespace-nowrap"
      >
        <FaPlus />
        Add Post
      </button>
      {addPostModal && (
        <div
          id="default-modal"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full overflow-y-auto bg-black bg-opacity-50"
        >
          <div className="relative w-full max-w-3xl mx-auto my-0">
            <div className="relative text-black dark:text-white bg-white rounded-[4px] shadow dark:bg-gray-700 p-10 w-full max-h-[90vh] overflow-y-auto">
              <form className="space-y-5">
                <InputField
                  type="text"
                  name="title"
                  value={title}
                  onChange={setTitle}
                  placeholder="Title"
                  label="Title"
                  error={error.title}
                  required={true}
                />

                <div className="relative ">
                  <label
                    htmlFor="Description"
                    className="mb-2 inline-block text-sm  sm:text-base"
                  >
                    Description <span className="text-red-600">*</span>
                  </label>
                  <SaneEditor editorContent={editorContents} />
                  {error.description && (
                    <p className="text-red-500">{error.description}</p>
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
                          }  block w-full p-3 bg-gray-50 dark:bg-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:border-none  ${category
                            ? " focus:border-green-500 border-green-500"
                            : "border-gray-300 "
                          }`}
                      >
                        {category ? category.name : "Select Post Category..."}
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

                    {category && (
                      <div
                        onClick={() => setCategory("")}
                        className="absolute top-[13px] right-[.3rem] p-1 rounded-full bg-gradient-to-r from-[#395BEF] to-[#5C28D5] text-white"
                      >
                        <IoMdClose onClick={() => setShowCategoryList(false)} />
                      </div>
                    )}
                    {error.category && (
                      <p className="text-red-500 text-sm">{error.category}</p>
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
                                setCategory(cat);
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
                  error={error.newsImage}
                  required={true}
                />
              </form>

              <div className="flex items-center gap-2 mt-5">
                <button
                  onClick={handleAddPost}
                  className="button_gradient"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Loading...
                    </>
                  ) : (
                    <>Add Post</>
                  )}
                </button>

                <button
                  onClick={() => setAddPostModal(!addPostModal)}
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

export default AddPost;

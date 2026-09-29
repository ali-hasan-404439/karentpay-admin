import { FaPlus, FaMinus, FaSpinner } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";

import moment from "moment";
import { toast } from "react-toastify";
import Auth from "../../utils/Auth";

function ManagePaymentMerchant({
  managePayment,
  setManagePayment,
  item,
  ItemsPerPage,
  currentPage,
  setMerchant,
}) {
  const { ApiRequest } = Auth();
  const [amount, setAmount] = useState("");
  const [manageType, setManageType] = useState("");
  const [note, setNote] = useState("");

  const [manageHistry, setManageHistry] = useState([]);
  const [manageHistryDelete, setManageHistryDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleAddManageHistry = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Amount should be greater than 0.");
      return;
    }
    if (!manageType) {
      toast.error("Manage type (Credit/Debit) is required.");
      return;
    }
    if (!note.trim()) {
      toast.error("Note is required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", managePayment);
    formData.append("note", note);
    formData.append("amount", amount);
    formData.append("manage_type", manageType);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/admin/custom-payment-manage/store`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      if (response?.data?.status === 200) {
        managePaymentHestry();
        try {
          const response = await ApiRequest({
            url: `/admin/merchant?page=${currentPage}&per_page=${ItemsPerPage}`,
            method: "get",
          });
          setMerchant(response.data.data);
        } catch (error) {
          // console.log(error);
        }
        setLoading(false);
        setNote("");
        setManageType("");
        setAmount("");
        toast.success("Debit/Credit history added Successfully!");
      }
      if (response?.data?.status === 500) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error("Failed to add Debit/Credit history. Please try again.");
    }
  };

  const handleManagePlus = () => {
    setAmount((preview) => parseInt(preview) + 20);
  };

  const handleManageMinus = () => {
    setAmount((prevAmount) => {
      const currentAmount = parseInt(prevAmount);
      if (currentAmount <= 20) {
        return currentAmount;
      } else {
        return currentAmount - 20;
      }
    });
  };

  useEffect(() => {
    managePaymentHestry();
  }, [managePayment]);

  const token = Cookies.get("token");

  const managePaymentHestry = async () => {
    if (!managePayment) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST
        }/admin/custom-payment-manage/${managePayment}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.status === 200) {
        setManageHistry(response.data.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleDeleteManageHistry = async (id) => {
    setLoadingDelete(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_HOST
        }/admin/custom-payment-manage/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.status === 500) {
        setManageHistryDelete(null);
        setLoadingDelete(false);
        return toast.error(response?.data?.message);
      }
      try {
        const response = await ApiRequest({
          url: `/admin/merchant?page=${currentPage}&per_page=${ItemsPerPage}`,
          method: "get",
        });
        setMerchant(response.data.data);
      } catch (error) {
        // console.log(error);
      }
      managePaymentHestry();
      setManageHistryDelete(null);
      toast.success(
        `Debit/Credit history entry has been successfully deleted.`
      );
    } catch (error) {
      // console.log(error);
    } finally {
      setLoadingDelete(false);
    }
  };
  return (
    <>
      {managePayment === item?.id && (
        <div
          id="popup-modal"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/50 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-[4px] shadow dark:bg-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="p-10 space-y-3">
                <h3 className="text-xl text-blue-600 dark:text-white">
                  Available Balance : <span>{item?.balance}</span>
                </h3>
                <div className="p-5 bg-gray-50 dark:bg-gray-600 rounded space-y-3">
                  <div className="flex items-center w-full gap-2">
                    <div className="relative w-full">
                      <h2 className="">Balance</h2>
                      <input
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                        type="number"
                        id="default-search"
                        className="border border-blue-500 text-gray-900  rounded-[4px]  block w-full p-2.5 bg-white  dark:bg-gray-700  dark:border-gray-600 dark:placeholder-white dark:text-white"
                        placeholder="Balance..."
                        required
                      />

                      <div className="absolute text-xl end-2 bottom-[9px] flex items-center gap-1">
                        <button
                          onClick={handleManageMinus}
                          type="submit"
                          className=" text-white border border-gray-50 bg-blue-500 hover:bg-blue-600 focus:outline-none rounded-[4px]  inline-flex items-center p-[6px] text-center"
                        >
                          <FaMinus />
                        </button>
                        <button
                          onClick={handleManagePlus}
                          type="submit"
                          className=" text-white border border-gray-50 bg-blue-500 hover:bg-blue-600 focus:outline-none rounded-[4px]  inline-flex items-center p-[6px] text-center"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    {/*   <div className="w-[200px] mt-5">
                      <select
                        onChange={(e) => setManageType(e.target.value)}
                        value={manageType}
                        id="countries"
                        className="border border-blue-500 text-gray-900  rounded-[4px]  block w-full p-2.5 bg-white  dark:bg-gray-700  dark:border-gray-600 dark:placeholder-white dark:text-white"
                      >
                        <option selected>Choose Option</option>
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                      </select>
                    </div> */}
                    <div className="w-[200px] mt-5">
                      <select
                        onChange={(e) => setManageType(e.target.value)}
                        value={manageType}
                        id="countries"
                        className="border border-blue-500 text-gray-900 rounded-[4px] block w-full p-2.5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white"
                      >
                        <option value="">Choose Option</option>
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                      </select>
                    </div>

                  </div>

                  <textarea
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                    id="message"
                    rows="3"
                    className="border border-blue-500 text-gray-900  rounded-[4px]  block w-full p-2.5 bg-white  dark:bg-gray-700  dark:border-gray-600 dark:placeholder-white dark:text-white"
                    placeholder="Description..."
                  ></textarea>

                  <button
                    onClick={handleAddManageHistry}
                    type="button"
                    className="text-white bg-blue-500 w-full flex justify-center gap-2 hover:bg-blue-600 focus:outline-none rounded-[4px] items-center px-5 py-3 text-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Increment"
                    )}
                  </button>
                </div>
                {/* Add your modal content here */}
                <div className="absolute top-0 right-3">
                  <button
                    onClick={() => setManagePayment(null)}
                    type="button"
                    className="p-1 rounded-full text-2xl  text-blue-700 focus:outline-none  bg-gray-100 dark:bg-gray-800 "
                  >
                    <IoMdClose />
                  </button>
                </div>
                {manageHistry.length > 0 && (
                  <div className="overflow-x-auto p-5 bg-gray-50 dark:bg-gray-600 rounded">
                    <table className="w-full text-left text-black dark:text-white">
                      <thead className="text-xs uppercase bg-blue-50 dark:bg-gray-700 ">
                        <tr>
                          <th scope="col" className="px-3 py-3">
                            <h2 className="w-[40px] lg:w-fit">Sl</h2>
                          </th>
                          <th scope="col" className="px-3 py-3  text-center">
                            <h2>Date</h2>
                          </th>

                          <th scope="col" className="px-4 py-3  text-center">
                            Amount/Description
                          </th>

                          <th scope="col" className="px-4 py-3 text-center">
                            Action
                          </th>
                          <th scope="col" className="px-4 py-3 text-center">
                            Method /Type
                          </th>
                          <th scope="col" className="px-4 py-3 text-end">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {manageHistry?.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 odd:bg-white odd:dark:bg-gray-600 even:bg-gray-50 even:dark:bg-gray-500"
                          >
                            <td className="px-3 py-2">{manageHistry?.length - index}</td>
                            <td className="px-3 py-2 text-center">
                              <h2>
                                {item.created_at
                                  ? moment(item.created_at).format(
                                    "DD MMM YYYY"
                                  )
                                  : "--"}
                                ,
                              </h2>
                              <h2>
                                {item.created_at
                                  ? moment(item.created_at).format("h:mm a")
                                  : "--"}
                              </h2>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <div className="flex items-center justify-center flex-col">
                                <h2>{item.amount}</h2>
                                <p className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700">
                                  {item.note.length > 20
                                    ? item.note.slice(0, 20) + "..."
                                    : item.note}
                                </p>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <h2>{item.manage_type}</h2>
                            </td>
                            <td className="px-3 py-2  text-center">
                              <h2>{item.action_by.name}</h2>
                            </td>
                            <td className="px-3 py-2  text-end">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setManageHistryDelete(item.id)}
                                  className="text-white bg-red-500 w-fit flex justify-center hover:bg-red-600 focus:outline-none rounded-[4px] items-center p-2 text-center"
                                >
                                  <MdDeleteForever />
                                </button>
                              </div>
                              {manageHistryDelete === item.id && (
                                <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
                                  <div className="relative p-4 w-full max-w-md max-h-full">
                                    <div className="relative bg-white rounded-[4px] shadow dark:bg-gray-700">
                                      {/* Modal content */}
                                      <div className="p-4 pr-10 md:p-5 text-center">
                                        <div className="flex justify-center items-center text-[60px] text-red-600">
                                          <MdDeleteForever />
                                        </div>
                                        <h3 className="mb-5 text-black dark:text-white">
                                          Are you sure you want to delete?
                                          <b> {item.name} </b>
                                        </h3>
                                        {/* Add your modal content here */}
                                        <div className="flex items-center justify-center gap-2">
                                          <button
                                            onClick={() =>
                                              handleDeleteManageHistry(
                                                manageHistryDelete
                                              )
                                            }
                                            type="button"
                                            className="text-white bg-red-500 hover:bg-red-600 focus:outline-none rounded-[4px]  px-5 py-3 text-center flex items-center justify-center gap-2"
                                            disabled={loadingDelete}
                                          >
                                            {loadingDelete ? (
                                              <>
                                                <FaSpinner className="animate-spin" />
                                                Loading...
                                              </>
                                            ) : (
                                              "Yes I'm Sure"
                                            )}
                                          </button>
                                          <button
                                            onClick={() =>
                                              setManageHistryDelete(null)
                                            }
                                            type="button"
                                            className="py-3 px-5 text-gray-900 focus:outline-none  rounded-[4px] bg-gray-100 hover:bg-gray-200  dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-gray-400  dark:hover:text-white"
                                          >
                                            No, cancel
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManagePaymentMerchant;

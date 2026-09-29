import { useState, useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import Auth from "../../utils/Auth";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import Table from "../../components/Table";
import DeleteItem from "../../components/DeleteItem";
import { FaSpinner } from "react-icons/fa";
import TitleDynamic from "../../TitleDynamic";
import ActionButton from "../../components/ActionButton";
import { MdDelete } from "react-icons/md";

function Currency() {
  const { ApiRequest } = Auth();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  const [isModalOpen, setModalOpen] = useState("");

  const [currencylist, setCurrencylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const response = await ApiRequest({
      url: "/admin/currency_setting",
      method: "get",
    });
    if (response?.status === 200) {
      setCurrencylist(response.data);
    } else {
      // toast.success(response?.message);
    }
    setLoading(false);
  };
  // Validation function
  const validateFields = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!country.trim()) errors.country = "Country is required.";
    return errors;
  };

  const handleSubmitFormData = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    setAddLoading(true);
    const data = {
      network: name,
      method: country,
    };
    const response = await ApiRequest({
      url: "/admin/currency_setting_add",
      formdata: data,
    });
    if (response?.status === 200) {
      toast.success("Added successfully");
      setName("");
      setCountry("");
      try {
        const response = await ApiRequest({
          url: "/admin/currency_setting",
          method: "get",
        });
        setCurrencylist(response.data);
      } catch (error) {
        // console.log(error);
      }
    } else {
      toast.error(response?.message);
    }
    setAddLoading(false);
  };

  const handleDeleteCurrency = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await ApiRequest({
        url: "/admin/currency_setting_delete/" + id,
        method: "delete",
      });
      try {
        const response = await ApiRequest({
          url: "/admin/currency_setting",
          method: "get",
        });
        setCurrencylist(response.data);
      } catch (error) {
        // console.log(error);
      }
      toast.success("Currency deleted successfully");
    } catch (error) {
      toast.error("Failed to delete currency");
    }
    setDeleteLoading(false);
    setModalOpen("");
  };
  return (
    <div className="w-full bg-white dark:bg-[#1F2836]  rounded-[4px]">
      <TitleDynamic title="Currency" />
      <Table headers={["Sl", "Currency", "Wallet Name", "Action"]}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
            <tr
              key={index}
              data-testid="table-row-skeleton"
              className="table_tr "
            >
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="h-4 bg-gray-300 rounded animate-pulse dark:bg-gray-600 w-6"></div>
              </td>
              <td className="p-4 whitespace-nowrap">
                <div className="h-4 bg-gray-300 rounded animate-pulse dark:bg-gray-600 w-24"></div>
              </td>
              <td className="p-4 whitespace-nowrap">
                <div className="h-4 bg-gray-300 rounded animate-pulse dark:bg-gray-600 w-32"></div>
              </td>
              <td className="p-4 flex-1 ">
                <div className="h-8 w-8 bg-gray-300 rounded animate-pulse dark:bg-gray-600"></div>
              </td>
            </tr>
          ))
          : currencylist?.map((item, index) => (
            <tr
              key={index + 1}
              data-testid="table-row-element"
              className="table_tr"
            >
              <td className="py-4 px-6 whitespace-nowrap">{currencylist.length - index}</td>
              <td className="p-4 whitespace-nowrap">{item.method}</td>
              <td className="p-4 whitespace-nowrap">{item.network}</td>
              <td className="p-4 flex-1 w-[150px]">
                <div className="flex items-center gap-2">
                  <ActionButton
                    id={item?.id}
                    setAction={setModalOpen}
                    title={"Delete"}
                    icon={<MdDelete />}
                    bgColor={"bg-red-500 hover:bg-red-800"}
                  />
                </div>
              </td>
            </tr>
          ))}
      </Table>

      {/* added currency start  */}
      <form className="p-6 space-y-5">
        <div className="relative">
          <label
            htmlFor="Country"
            className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
          >
            Withdraw Currency <span className="text-red-600">*</span>
          </label>
          <select
            onChange={(e) => setCountry(e.target.value)}
            type="text"
            id="Country"
            name="currency"
            className={`border text-gray-900 rounded-[4px] ${country
              ? "border-green-500 dark:border-green-500"
              : "border-gray-300"
              } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
            required
          >
            <option value="">Choose Your Country</option>
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
          </select>
          {country && (
            <div className="absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
              <LuCheck />
            </div>
          )}
          {error.country && (
            <p className="text-red-600 text-sm">{error.country}</p>
          )}
        </div>

        <div className="relative">
          <label
            htmlFor="name"
            className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
          >
            Wallet Name <span className="text-red-600">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            name="name"
            className={`border text-gray-900 rounded-[4px] ${name
              ? "border-green-500 dark:border-green-500"
              : "border-gray-300"
              } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
            placeholder="Wallet Name"
            required
          />
          {name && (
            <span className="absolute top-[3rem] right-2 w-[20px] h-[20px] rounded-full bg-green-500 text-white flex items-center justify-center">
              <LuCheck />
            </span>
          )}
          {error.name && <p className="text-red-600 text-sm">{error.name}</p>}
        </div>

        <button
          onClick={handleSubmitFormData}
          type="button"
          className="button_gradient"
          disabled={addLoading}
        >
          {addLoading ? (
            <>
              <FaSpinner className="animate-spin" /> Loading...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
      {/* delete currency reusable component */}
      <DeleteItem
        deleteItem={isModalOpen}
        setDeleteItem={setModalOpen}
        handleDeleteItem={handleDeleteCurrency}
        text="currency"
        loading={deleteLoading}
      />
    </div>
  );
}

export default Currency;

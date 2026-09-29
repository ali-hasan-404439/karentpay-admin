import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import InputField from "../../../../components/InputField";
import Table from "../../../../components/Table";
import UpayPaymentAdd from "./UpayPaymentAdd";
import ActionButton from "../../../../components/ActionButton";
import { MdDelete } from "react-icons/md";
import FilterStatus from "../../../../components/FilterStatus";

function UpayPaymentMethod() {
  const headers = [
    "Sl",
    "Upay User Name",
    "Upay Password",
    "Upay Public Key",
    "Upay Private Key",
    "Total Amount",
    "Limit Amount",
    "Message",
    "Active",
    "Action",
  ];

  const [upaykey, setUpaykey] = useState("");
  const [userName, setUserName] = useState("");
  const [upaySecret, setUpaySecret] = useState("");
  const [upayPassword, setUpayPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [dropdownModel, setDropdownModel] = useState(false);


  const [searchMerchantStatus, setSearchMerchantStatus] = useState('');
  const [showMerchantStatus, setShowMerchantStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    const newErrors = {};

    if (!userName.trim()) {
      newErrors.userName = "User Name is required.";
    }

    if (!upaykey.trim()) {
      newErrors.upaykey = "Upay Key is required.";
    }

    if (!upaySecret.trim()) {
      newErrors.upaySecret = "Upay Secret is required.";
    }

    if (!upayPassword.trim()) {
      newErrors.upayPassword = "Upay Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const isValid = validateInputs();
    if (isValid) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutShowMerchantStatus = (event) => {
      if (!event.target.closest("#handleClickOutShowMerchantStatus")) {
        setShowMerchantStatus(false);
      }
    };
    window.document.addEventListener("click", handleClickOutShowMerchantStatus);

    return () => {
      window.document.removeEventListener("click", handleClickOutShowMerchantStatus);
    };
  }, []);
  return (
    <>
      <div className="px-6 space-y-5 py-5">
        <InputField
          label="User Name"
          value={userName}
          onChange={setUserName}
          id="userName"
          error={errors.userName}
        />

        <InputField
          label="Upay Public Key"
          value={upaykey}
          onChange={setUpaykey}
          id="upayKey"
          error={errors.upaykey}
        />

        <InputField
          label="Upay Private Key"
          value={upaySecret}
          onChange={setUpaySecret}
          id="upaySecret"
          error={errors.upaySecret}
        />

        <InputField
          label="Upay Password"
          value={upayPassword}
          onChange={setUpayPassword}
          id="upayPassword"
          error={errors.upayPassword}
        />
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSubmit}
            className='button_gradient'
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className='animate-spin' /> Loading...
              </>
            ) : (
              'Update Test Credentials'
            )}
          </button>
          <FilterStatus
            showMerchantStatus={showMerchantStatus}
            setShowMerchantStatus={setShowMerchantStatus}
            setSearchMerchantStatus={setSearchMerchantStatus}
            searchMerchantStatus={searchMerchantStatus}
            id="handleClickOutShowMerchantStatus"
            placeholderText="Activitey..."
          >
            {['Active', 'Inactive']?.map((item, index) => (
              <div
                key={index}
                className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                onClick={() => setSearchMerchantStatus(item)}
              >
                <span> {item}</span>
              </div>
            ))}
          </FilterStatus>
        </div>
      </div>

      {/* Live Credentials*/}
      <Table headers={headers}>
        <tr data-testid="table-row-element" className="table_tr">
          <td className="w-4 px-6 py-4">1</td>

          <td className="p-4">
            <h2 style={{ width: "150px" }}>kdjsgfdgdgg</h2>
          </td>

          <td className="p-4 whitespace-nowrap">
            <h2 style={{ width: "150px" }}>
              {
                /* item?.password? item?.password.slice(0,2) + "******": */ "********"
              }
            </h2>
          </td>

          <td className="p-4 whitespace-nowrap">fhrt75645gbfhj</td>
          <td className="p-4 whitespace-nowrap">fhrt75645gbfhj</td>
          <td className="p-4 whitespace-nowrap">70</td>
          <td className="p-4 whitespace-nowrap">7000</td>
          <td className="p-4 whitespace-nowrap"></td>

          <td className="p-4 whitespace-nowrap flex items-center gap-1">
            <label
              htmlFor="AcceptConditions"
              className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-blue-600"
            >
              <input
                type="checkbox"
                id="AcceptConditions"
                className="peer sr-only"
              />

              <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"></span>
            </label>
          </td>

          <td className="p-4  flex-1">
            <div className="flex items-center gap-2">
              <ActionButton
                id={'edit'}
                setAction={setDropdownModel}
                title={"Edit"}
                icon={<CiEdit />}
                bgColor={"bg-green-500 hover:bg-green-800"}
              />
              <ActionButton
                title={"Delete"}
                icon={<MdDelete />}
                bgColor={"bg-red-500 hover:bg-red-800"}
              />
            </div>
          </td>
        </tr>
      </Table>

      <div className="py-5 pl-6">
        <button
          id="handleClickOutsideOperator"
          onClick={() => setDropdownModel(!dropdownModel)}
          className="button_gradient"
        >
          <FaPlus />
          Add Payment
        </button>
      </div>
      {dropdownModel && <UpayPaymentAdd setDropdownModel={setDropdownModel} />}
    </>
  );
}

export default UpayPaymentMethod;

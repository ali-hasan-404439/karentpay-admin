import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaPlus, FaSpinner } from "react-icons/fa";
import RocketPaymentAdd from "./RocketPaymentAdd";
import Table from "../../../../components/Table";
import InputField from "../../../../components/InputField";
import { MdDelete } from "react-icons/md";
import ActionButton from "../../../../components/ActionButton";
import FilterStatus from "../../../../components/FilterStatus";

function RocketPaymentMethod() {
  const headers = [
    "Sl",
    "Rocket User Name",
    "Rocket Password",
    "Rocket Public Key",
    "Rocket Private Key",
    "Total Amount",
    "Limit Amount",
    "Message",
    "Active",
    "Action",
  ];

  const [rocketKey, setRocketKey] = useState("");
  const [userName, setUserName] = useState("");
  const [rocketSecret, setRocketSecret] = useState("");
  const [rocketPassword, setRocketPassword] = useState("");

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

    if (!rocketKey.trim()) {
      newErrors.rocketKey = "Rocket Key is required.";
    }

    if (!rocketSecret.trim()) {
      newErrors.rocketSecret = "Rocket Secret is required.";
    }

    if (!rocketPassword.trim()) {
      newErrors.rocketPassword = "Rocket Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRocket = () => {
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
      <div className="py-5 px-6 space-y-5">
        <InputField
          label="User Name"
          value={userName}
          onChange={setUserName}
          id="userName"
          error={errors.userName}
        />
        <InputField
          label="Rocket Public Key"
          value={rocketKey}
          onChange={setRocketKey}
          id="rocketKey"
          error={errors.rocketKey}
        />
        <InputField
          label="Rocket Private Key"
          value={rocketSecret}
          onChange={setRocketSecret}
          id="rocketSecret"
          error={errors.rocketSecret}
        />
        <InputField
          label="Rocket Password"
          value={rocketPassword}
          onChange={setRocketPassword}
          id="rocketPassword"
          error={errors.rocketPassword}
        />
        {/*  <button onClick={handleSubmitRocket} className="button_gradient">
          Update Test Credentials
        </button> */}

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSubmitRocket}
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

      {/* Live Credentials */}
      <Table headers={headers}>
        <tr data-testid="table-row-element" className="table_tr">
          <td className="w-4 px-6 py-4">1</td>
          <td className="p-4">
            <h2 style={{ width: "150px" }}>kdjsgfdgdgg</h2>
          </td>
          <td className="p-4 whitespace-nowrap">
            <h2 style={{ width: "150px" }}>{"********"}</h2>
          </td>
          <td className="p-4 whitespace-nowrap">fhrt75645gbfhj</td>
          <td className="p-4 whitespace-nowrap">fhrt75645gbfhj</td>
          <td className="p-4 whitespace-nowrap">55</td>
          <td className="p-4 whitespace-nowrap">40000</td>
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
          <td className="p-4 flex-1">
            <div className="flex items-center gap-2">
              <ActionButton
                title={"Edit"}
                id={"edit"}
                setAction={setDropdownModel}
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
      {dropdownModel && (
        <RocketPaymentAdd setDropdownModel={setDropdownModel} />
      )}
    </>
  );
}

export default RocketPaymentMethod;

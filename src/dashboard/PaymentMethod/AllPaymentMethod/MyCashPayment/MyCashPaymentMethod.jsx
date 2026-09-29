import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Table from "../../../../components/Table";
import MyCashAdd from "./MyCashAdd";
import InputField from "../../../../components/InputField";
import ActionButton from "../../../../components/ActionButton";
import FilterStatus from "../../../../components/FilterStatus";

function MyCashPaymentMethod() {
  const headers = [
    "Sl",
    "My Cash User Name",
    "My Cash Password",
    "My Cash Public Key",
    "My Cash Private Key",
    "Total Amount",
    "Limit Amount",
    "Message",
    "Active",
    "Action",
  ];
  const [myCashkey, setMyCashkey] = useState("");
  const [userName, setUserName] = useState("");
  const [myCashSecret, setMyCashSecret] = useState("");
  const [myCashPassword, setMyCashPassword] = useState("");

  const [dropdownModel, setDropdownModel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myCashPaymentView, setMyCashPaymentView] = useState(false);
  const [searchMerchantStatus, setSearchMerchantStatus] = useState('');
  const [showMerchantStatus, setShowMerchantStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    if (!userName.trim()) {
      newErrors.userName = "User Name is required.";
    }

    if (!myCashkey.trim()) {
      newErrors.myCashkey = "My Cash Key is required.";
    }

    if (!myCashSecret.trim()) {
      newErrors.myCashSecret = "My Cash Secret is required.";
    }

    if (!myCashPassword.trim()) {
      newErrors.myCashPassword = "My Cash Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitMyCash = () => {
    const isValid = validateInputs();
    if (isValid) {
      // console.log("User Name:", userName);
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
      <div className="px-6 py-5 space-y-5">
        <InputField
          label="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          error={errors.userName}
        />

        <InputField
          label="My Cash Public key"
          value={myCashkey}
          onChange={(e) => setMyCashkey(e.target.value)}
          error={errors.myCashkey}
        />

        <InputField
          label="My Cash Private Key"
          value={myCashSecret}
          onChange={(e) => setMyCashSecret(e.target.value)}
          error={errors.myCashSecret}
        />

        <InputField
          label="My Cash Password"
          value={myCashPassword}
          onChange={(e) => setMyCashPassword(e.target.value)}
          error={errors.myCashPassword}
        />

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSubmitMyCash}
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
            <h2 style={{ width: "150px" }}>{"********"}</h2>
          </td>

          <td className="p-4 whitespace-nowrap">fhrt75645gbfhj</td>
          <td className="p-4 whitespace-nowrap">fhrt75645gbfhj</td>
          <td className="p-4 whitespace-nowrap">20</td>
          <td className="p-4 whitespace-nowrap">50000</td>
          <td className="p-4 whitespace-nowrap"></td>

          <td className="p-4 whitespace-nowrap flex items-center gap-1">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </td>

          <td className="p-4  flex-1">
            <div className="flex items-center gap-2">
              <ActionButton
                id={"edit"}
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
      {dropdownModel && <MyCashAdd setDropdownModel={setDropdownModel} />}
    </>
  );
}

export default MyCashPaymentMethod;

import { useEffect, useState } from "react";
import { LuCheck } from "react-icons/lu";
import { toast } from "react-toastify";
import Auth from "../../utils/Auth";
import { FaSpinner } from "react-icons/fa6";
import InputField from "../../components/InputField";

function AllMerchantEdit({ modalOpen, closeModal, item, setMerchant }) {
  const [loading, setLoading] = useState(false);

  const { ApiRequest } = Auth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [balance, setBalance] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName(item.merchant.name);
    setEmail(item.merchant.email);
    setPhone(item.merchant.phone);
    setBalance(item.balance);
  }, [item]);

  const handleAccept = async () => {
    const userData = {
      name: name || item.merchant.name,
      email: email || item.merchant.email,
      phone: phone || item.merchant.phone,
      balance: balance || item.balance,
      password: password,
    };
    setLoading(true);
    const response = await ApiRequest({
      url: "/admin/merchant_update/" + item.id,
      formdata: userData,
    });
    if (response?.status === 200) {
      setMerchant((prev) => prev.map((items) => {
        if (items.id === item.id) {
          return {
            ...items,
            merchant: {
              ...items.merchant,
              name: name,
              email: email,
              phone: phone,
            },
            balance: balance || item.balance,
          };
        }
        return item;
      }));
      toast.success("Merchant updated successfully");
    } else {
      toast.error(response?.message);
    }
    setLoading(false);
    closeModal();
  };

  return (
    <>
      {modalOpen === item?.id && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative w-full max-w-2xl p-4 mx-auto my-0">
            <div className="relative bg-white rounded-[4px] shadow dark:bg-gray-700">
              <form className="px-10 pt-10 space-y-5">
                <InputField
                  type="text"
                  name="title"
                  value={name}
                  onChange={setName}
                  placeholder="Name"
                  label="Name"
                  id="title"
                  required={true}
                />
                <InputField
                  type="text"
                  name="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Email"
                  label="Email"
                  id="email"
                  required={true}
                />
                <InputField
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder="Phone"
                  label="Phone"
                  id="phone"
                  required={true}
                />
                <InputField
                  type="text"
                  name="balance"
                  value={balance}
                  onChange={setBalance}
                  placeholder="Balance"
                  label="Balance"
                  id="balance"
                  required={true}
                />
                <InputField
                  type="text"
                  name="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter New Password"
                  label="Password (Leave Empty if you don't want to change)"
                  id="password"
                />
              </form>

              <div className="flex items-center gap-2 px-10 py-5 mt-5 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleAccept}
                  type="submit"
                  className="button_gradient"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Update Now"
                  )}
                </button>
                <button
                  onClick={closeModal}
                  type="submit"
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

export default AllMerchantEdit;

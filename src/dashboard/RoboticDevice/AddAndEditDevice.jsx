import { FaSpinner } from "react-icons/fa";
import InputField from "../../components/InputField";
import { useEffect, useState } from "react";
import { TfiReload } from "react-icons/tfi";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function AddAndEditDevice({ setAddDevice, addDevice, setAllDevice, setTotal, ItemsPerPage, currentPage }) {
    const [deviceName, setDeviceName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerPhone, setOwnerPhone] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const token = Cookies.get("token");
    useEffect(() => {
        if (addDevice?.id) {
            setDeviceName(addDevice.device_name);
            setOwnerName(addDevice.owner_name);
            setOwnerPhone(addDevice.owner_phone);
            setDeviceId(addDevice.device_id);
            setSecretKey(addDevice.device_secret);
        }
    }, [addDevice]);

    function generateSecretKey() {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let secretKey = "";
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            secretKey += characters[randomIndex];
        }
        return secretKey;
    }

    const validateForm = () => {
        const errors = {};
        if (!ownerName.trim()) {
            errors.ownerName = "Owner Name is required";
        }
        if (!ownerPhone.trim()) {
            errors.ownerPhone = "Owner Phone is required";
        }
        if (!deviceName.trim()) {
            errors.deviceName = "Device Name is required";
        }
        if (!deviceId.trim()) {
            errors.deviceId = "Device ID is required";
        }
        if (!secretKey.trim()) {
            errors.secretKey = "Secret Key is required. Please generate it.";
        }
        return errors;
    };

    const handleAddDevice = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append("device_name", deviceName);
        formData.append("device_id", deviceId);
        formData.append("device_secret", secretKey);
        formData.append("owner_name", ownerName);
        formData.append("owner_phone", ownerPhone);
        formData.append("status", "active");
        if (addDevice?.id) {
            formData.append("_method", 'PUT');
            formData.append("last_online_at", addDevice.last_online_at ? addDevice.last_online_at : '');
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_HOST}/admin/manual-cash-in-robotic-devices${addDevice?.id ? `/${addDevice.id}` : ''}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_HOST}/admin/manual-cash-in-robotic-devices?&per_page=${ItemsPerPage}&page=${currentPage}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setTotal({
                    totalPage: response?.data?.data?.last_page,
                    totalItems: response?.data?.data?.total,
                });
                setAllDevice(response?.data?.data?.data);
            } catch (error) {
                // console.log(error);
            }

            toast.success(addDevice?.id ? 'Device updated successfully' : 'Device added successfully');
            setAddDevice(false);
            setDeviceName("");
            setOwnerName("");
            setOwnerPhone("");
            setDeviceId("");
            setSecretKey("");
        } catch (error) {
            if (error?.response?.data?.message) {
                setLoading(false);
                return toast.error(error?.response?.data?.message);
            }
            toast.error(addDevice?.id ? 'Failed to update device. Please try again' : 'Failed to add device. Please try again');
        }
        setLoading(false);
    };

    const cancelModal = () => {
        setAddDevice(false);
        setDeviceName("");
        setOwnerName("");
        setOwnerPhone("");
        setDeviceId("");
        setSecretKey("");
    }
    return (
        <div>
            {addDevice && (
                <div
                    id="popup-modal"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
                >
                    <div className="relative w-full p-10 rounded bg-white dark:bg-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="relative space-y-5">
                            <InputField
                                label="Owner Name"
                                value={ownerName}
                                onChange={setOwnerName}
                                id="owner-name"
                                required={true}
                                error={errors.ownerName}
                            />
                            <InputField
                                label="Owner Number"
                                value={ownerPhone}
                                onChange={setOwnerPhone}
                                id="owner-phone"
                                required={true}
                                error={errors.ownerPhone}
                            />
                            <InputField
                                label="Device Name"
                                value={deviceName}
                                onChange={setDeviceName}
                                id="device-name"
                                required={true}
                                error={errors.deviceName}
                            />
                            <InputField
                                label="Device ID"
                                value={deviceId}
                                onChange={setDeviceId}
                                id="device-id"
                                required={true}
                                error={errors.deviceId}
                            />
                            <div>
                                <label
                                    htmlFor="secret_key"
                                    className="mb-2 inline-block text-sm sm:text-base cursor-pointer dark:text-white text-[#09090B]"
                                >
                                    Secret Key <span className="text-red-600">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="secret_key"
                                        value={secretKey}
                                        type="text"
                                        className={`border text-gray-900 rounded-[4px] ${secretKey ? "border-green-500 dark:border-green-500" : "border-gray-300"
                                            } block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                                        placeholder="Secret Key"
                                        readOnly
                                    />
                                    <button
                                        className="flex items-center justify-center p-2.5 ml-2 text-2xl font-medium text-white bg-blue-700 rounded border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                        onClick={() => setSecretKey(generateSecretKey())}
                                        type="Generate Secret Key"
                                    >
                                        <TfiReload />
                                    </button>
                                </div>
                                {errors.secretKey && (
                                    <p className="text-red-600 text-sm">{errors.secretKey}</p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="button_gradient"
                                    disabled={loading}
                                    onClick={handleAddDevice}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin" /> Loading...
                                        </>
                                    ) : (
                                        "Add Device"
                                    )}
                                </button>
                                <button
                                    className="button_cancel"
                                    onClick={cancelModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddAndEditDevice;

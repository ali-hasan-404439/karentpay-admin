import { useEffect, useState } from "react";
import SearchInputField from "../../components/SearchInputField";
import TitleDynamic from "../../TitleDynamic";
import { FaPlus, FaRegEye } from "react-icons/fa";
import AddAndEditDevice from "./AddAndEditDevice";
import Cookies from "js-cookie";
import axios from "axios";
import Table from "../../components/Table";
import moment from "moment";
import ActionButton from "../../components/ActionButton";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { TextCopy } from "../../components/Textcopy";
import TableFooter from "../../components/TableFooter";
import DeleteItem from "../../components/DeleteItem";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import RoboticSmsView from "./RoboticSmsView";

function RoboticDevice() {
    const headers = ["Sl", "Date", "Owner Info", "Device Name", "Device ID", "Device Secret", "Last Online At", "Active", "Action"];
    const [searchDevice, setSearchDevice] = useState("");
    const [addDevice, setAddDevice] = useState(false);
    const [allDevice, setAllDevice] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [ItemsPerPage, setItemsPerPage] = useState(10);
    const [deleteDevice, setDeleteDevice] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [viewDeviceSms, setViewDeviceSms] = useState('');


    const pathName = useLocation().pathname;
    useEffect(() => {
        const perPage = localStorage.getItem("perPage");
        const parsedPerPage = perPage ? JSON.parse(perPage) : {};

        if (
            parsedPerPage[pathName] &&
            typeof parsedPerPage[pathName] === "number"
        ) {
            setItemsPerPage(parsedPerPage[pathName]);
        }
    }, []);

    const token = Cookies.get("token");

    useEffect(() => {
        handleGetManualPayment();
    }, [currentPage]);
    const handleGetManualPayment = async () => {

        console.log(searchDevice);
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_HOST}/admin/manual-cash-in-robotic-devices?&per_page=${ItemsPerPage}&page=${currentPage}&search=${searchDevice}`,
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        handleGetManualPayment();
    }, [searchDevice, ItemsPerPage,]);

    const handleStatusChange = async (id, e) => {
        const fromData = new FormData();
        fromData.append('status', e == true ? 'active' : 'inactive');
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_HOST
                }/admin/manual-cash-in-robotic-devices/status/${id}`,
                {
                    status: e == true ? 'active' : 'inactive',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAllDevice((prev) =>
                prev.map((item) => {
                    if (item.id === id) {
                        return { ...item, status: e == true ? 'active' : 'inactive' }
                    }
                    return item
                })
            );
            toast.success("Status updated successfully!");

        } catch (error) {
            // console.log(error);
        }
    };

    const handleDeleteDevice = async (id) => {
        setLoadingDelete(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_HOST
                }/admin/manual-cash-in-robotic-devices/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_HOST
                    }/admin/manual-cash-in-robotic-devices?&per_page=${ItemsPerPage}&page=${currentPage}`,
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
            setDeleteDevice('');
            toast.success("Device delete successfully!");
        } catch (error) {
            // console.log(error);
        } finally {
            setLoadingDelete(false);

        }
    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900 ">
            <TitleDynamic title="Robotic Device" />
            <div>
                <div className="boxShadow-table  bg-white dark:bg-gray-800 rounded-[4px] mb-4">
                    <div className="flex items-center flex-wrap gap-2 py-6 px-5">
                        <SearchInputField
                            searchText={searchDevice}
                            setSearchText={setSearchDevice}
                            placeholderText="Search Owner Number, Secret Key"
                        />

                        <button
                            onClick={() => setAddDevice(!addDevice)}
                            className="button_gradient w-full md:w-auto"
                        >
                            <FaPlus />
                            Add Device
                        </button>
                    </div>
                    <Table headers={headers}>
                        {loading ? Array.from({ length: 10 }).map((_, index) => (
                            <tr
                                key={index}
                                className="table_tr bg-gray-100 dark:bg-gray-800"
                            >
                                <td className="px-6 py-4 w-[50px]">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                                </td>
                                <td className="p-4 w-[150px]">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-[200px] mb-2"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded w-[150px]"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded mb-2"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-6 w-11 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-full"></div>
                                </td>
                                <td className="p-4 flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                                        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
                                    </div>
                                </td>
                            </tr>
                        )) : allDevice?.map((item, index) => (
                            <tr
                                key={index}
                                data-testid="table-row-element"
                                className="table_tr"
                            >
                                <td className="px-6 py-4 text-left w-[50px]">
                                    {total?.totalItems -
                                        ((currentPage - 1) * ItemsPerPage + index)}
                                </td>

                                <td className="p-4 w-[150px] whitespace-nowrap">
                                    {item.created_at && moment(item.created_at).format("DD MMM YYYY")}
                                    <br />
                                    {item.created_at && moment(item.created_at).format("h:mm a")}
                                </td>

                                <td className="p-4 whitespace-nowrap">
                                    <h2 onClick={() => setSearchDevice(item.owner_phone)} className="cursor-pointer flex items-center p-1 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold w-[250px]">
                                        {item.owner_name && <>{item.owner_name.charAt(0).toUpperCase() +
                                            item.owner_name.slice(1).toLowerCase()}<br /></>}
                                        {item.owner_phone && <>{item.owner_phone} <br /></>}
                                    </h2>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    {item.device_name}
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    {item.device_id}
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    {item.device_secret && <TextCopy text={item.device_secret} />}
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    {item.last_online_at && moment(item.last_online_at).format("DD MMM YYYY")}<br />
                                    {item.last_online_at && moment(item.last_online_at).format("h:mm a")}
                                </td>

                                <td className="p-4">
                                    <label
                                        htmlFor={`toggle-${item.id}`}
                                        className={`relative inline-block h-8 w-14 cursor-pointer rounded-full ${item.status == 'active' ? "bg-blue-600" : "bg-gray-300"} transition [-webkit-tap-highlight-color:_transparent]`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`toggle-${item.id}`}
                                            className="peer sr-only"
                                            checked={item.status == "active" ? true : false}
                                            onChange={(e) => {
                                                handleStatusChange(item.id, e.target.checked,);
                                            }}
                                        />
                                        <span
                                            className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
                                        ></span>
                                    </label>
                                </td>
                                <td className="p-4  flex-1">
                                    <div className="flex items-center gap-2">
                                        <ActionButton
                                            id={item.id}
                                            setAction={setViewDeviceSms}
                                            title={"View"}
                                            icon={<FaRegEye />}
                                            bgColor={"bg-blue-500 hover:bg-blue-800"}
                                        />
                                        <ActionButton
                                            title={"Edit"}
                                            id={item}
                                            setAction={setAddDevice}
                                            icon={<CiEdit />}
                                            bgColor={"bg-green-500 hover:bg-green-800"}
                                        />
                                        <ActionButton
                                            title={"Delete"}
                                            id={item.id}
                                            setAction={setDeleteDevice}
                                            icon={<MdDelete />}
                                            bgColor={"bg-red-500 hover:bg-red-800"}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                    <TableFooter
                        totalItems={total?.totalItems || 0}
                        perPage={ItemsPerPage}
                        setPerPage={setItemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPage={total?.totalPage || 0}
                    />
                </div>
                <AddAndEditDevice
                    setAddDevice={setAddDevice}
                    addDevice={addDevice}
                    setAllDevice={setAllDevice}
                    setTotal={setTotal}
                    currentPage={currentPage}
                    ItemsPerPage={ItemsPerPage}
                />
                <RoboticSmsView
                    viewDeviceSms={viewDeviceSms}
                    setViewDeviceSms={setViewDeviceSms}
                />
                <DeleteItem
                    deleteItem={deleteDevice}
                    setDeleteItem={setDeleteDevice}
                    handleDeleteItem={handleDeleteDevice}
                    text="Robotic Device"
                    loading={loadingDelete}
                />
            </div>
        </section>
    );
}

export default RoboticDevice;
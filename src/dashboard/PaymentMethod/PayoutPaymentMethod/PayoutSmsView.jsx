
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Cookies from "js-cookie";
import { MdClose, MdDelete, } from "react-icons/md";
import FilterStatus from "../../../components/FilterStatus";
import DatePickers from "../../../components/DatePickers";
import SearchInputField from "../../../components/SearchInputField";
import Table from "../../../components/Table";
import ActionButton from "../../../components/ActionButton";
import { TextCopy } from "../../../components/Textcopy";
import { FaRegEye } from "react-icons/fa";
import TableFooter from "../../../components/TableFooter";
import ShowPayoutMethodSms from "./ShowPayoutMethodSms";
import { toast } from "react-toastify";
import DeleteItem from "../../../components/DeleteItem";
import { GrRotateLeft } from "react-icons/gr";
import PayoutMethodSmsStatusChange from "./PayoutMethodSmsStatusChange";
import { TfiReload } from "react-icons/tfi";

function PayoutSmsView({ viewPayoutMethodSms, setViewPayoutMethodSms }) {
    const headers = [
        'Sl',
        'Date',
        'Sender Info',
        'Payment Info',
        'Amount',
        'Transaction ID',
        'Status',
        'Action',
    ];
    const [loading, setLoading] = useState(false);
    const [smsPayoutMethod, setSmsPayoutMethod] = useState([]);
    const [ItemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState({});
    const [showSmsPayoutStatus, setShowSmsPayoutStatus] = useState(false);
    const [searchSmsPayoutStatus, setSearchSmsPayoutStatus] = useState("");
    const [searchSmsSender, setSearchSmsSender] = useState("");
    const [showSmsSender, setShowSmsSender] = useState(false);
    const [deletePayoutMethodSms, setDeletePayoutMethodSms] = useState('');
    const [startEndDate, setStartEndDate] = useState({ startDate: "", endDate: "" });
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [showPayoutMethodSms, setShowPayoutMethodSms] = useState("");
    const [searchSmsPayout, setSearchSmsPayout] = useState("");
    const [smsPayoutReGenerate, setSmsPayoutReGenerate] = useState("");

    const token = Cookies.get("token");

    const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
    const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");

    // Calculate the difference in days between today and the start date
    const date = new Date();
    const today = moment(date).format("YYYY-MM-DD");
    const startDates = moment(startDate);
    const todayDate = moment(today);
    const differenceInDays = todayDate.diff(startDates, "days");

    // Consolidated data fetcher
    const fetchPayoutSmsView = async (id) => {
        if (!id) return;
        setLoading(true);
        try {

            const response = await axios.get(
                `${import.meta.env.VITE_API_HOST}/admin/auto-withdraw-messages`,
                {
                    params: {
                        automotion_setting_id: id,
                        per_page: ItemsPerPage,
                        page: currentPage,
                        status: searchSmsPayoutStatus,
                        start_date: differenceInDays > 0 ? startDate : "",
                        end_date: differenceInDays > 0 ? endDate : "",
                        sender: searchSmsSender.charAt(0).toUpperCase() + searchSmsSender?.slice(1),
                        search: searchSmsPayout
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const { last_page, total, data } = response?.data?.data || {};
            setTotal({
                totalPage: last_page || 0,
                totalItems: total || 0,
            });
            setSmsPayoutMethod(data || []);
        } catch (error) {
            // console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (viewPayoutMethodSms) {
            fetchPayoutSmsView(viewPayoutMethodSms);
        }
    }, [currentPage, viewPayoutMethodSms]);
    useEffect(() => {
        const fetchData = async () => {
            setCurrentPage(1);
            if (viewPayoutMethodSms) {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_HOST}/admin/auto-withdraw-messages`,
                        {
                            params: {
                                automotion_setting_id: viewPayoutMethodSms,
                                per_page: ItemsPerPage,
                                page: currentPage,
                                status: searchSmsPayoutStatus,
                                start_date: differenceInDays > 0 ? startDate : "",
                                end_date: differenceInDays > 0 ? endDate : "",
                                sender: searchSmsSender.charAt(0).toUpperCase() + searchSmsSender?.slice(1),
                                search: searchSmsPayout
                            },
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const { last_page, total, data } = response?.data?.data || {};
                    setTotal({
                        totalPage: last_page || 0,
                        totalItems: total || 0,
                    });
                    setSmsPayoutMethod(data || []);
                } catch (error) {
                    // console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [ItemsPerPage, viewPayoutMethodSms, searchSmsPayoutStatus, startEndDate, searchSmsSender, searchSmsPayout]);


    const handleDeletePayoutMethodSms = async (id) => {
        setLoadingDelete(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_HOST
                }/admin/auto-withdraw-messages/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_API_HOST}/admin/auto-withdraw-messages`,
                    {
                        params: {
                            id: id,
                            per_page: ItemsPerPage,
                            page: currentPage,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const { last_page, total, data } = response?.data?.data || {};
                setTotal({
                    totalPage: last_page || 0,
                    totalItems: total || 0,
                });
                setSmsPayoutMethod(data || []);
            } catch (error) {
                // console.error("Error fetching data:", error);
            }
            toast.success('Deleted successfully.');
        } catch (error) {
            toast.error("Failed to delete. Please try again.");
        }
        setDeletePayoutMethodSms('');
        setLoadingDelete(false);
    };

    useEffect(() => {
        const handleClickOutsideOperator = (event) => {
            if (!event.target.closest("#setShowSmsPayoutStatus")) {
                setShowSmsPayoutStatus(false);
            }
        };
        const handleClickOutsideSender = (event) => {
            if (!event.target.closest("#setShowSmsSender")) {
                setShowSmsSender(false);
            }
        };
        window.document.addEventListener("click", handleClickOutsideOperator);
        window.document.addEventListener("click", handleClickOutsideSender);

        return () => {
            window.document.removeEventListener("click", handleClickOutsideOperator);
            window.document.removeEventListener("click", handleClickOutsideSender);
        };
    }, []);

    return (
        <div>
            {viewPayoutMethodSms && (
                <div
                    id="popup-modal"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
                >
                    <div className="relative w-full rounded bg-white dark:bg-gray-700 max-w-6xl min-h-[60vh] max-h-[90vh] overflow-y-auto">
                        <div className="absolute -top-2 right-0 w-12 h-12 flex items-center justify-center">
                            <button
                                onClick={() => setViewPayoutMethodSms('')}
                                type="button"
                                className="text-xl text-white cursor-pointer w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center "
                            >
                                <MdClose />
                            </button>
                        </div>
                        <div className=" md:flex items-start justify-between px-5 py-7">
                            <div className="flex flex-wrap items-center gap-1 ">
                                <SearchInputField
                                    searchText={searchSmsPayout}
                                    setSearchText={setSearchSmsPayout}
                                    placeholderText="Search Number, Trx Id, Amount"
                                />
                                <FilterStatus
                                    showMerchantStatus={showSmsSender}
                                    setShowMerchantStatus={setShowSmsSender}
                                    setSearchMerchantStatus={setSearchSmsSender}
                                    searchMerchantStatus={searchSmsSender}
                                    id="setShowSmsSender"
                                    placeholderText="Sender Methods..."
                                >
                                    {["Bkash", "Nagad", "Rocket"]?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                                            onClick={() => setSearchSmsSender(item)}
                                        >
                                            <span> {item}</span>
                                        </div>
                                    ))}
                                </FilterStatus>
                                <FilterStatus
                                    showMerchantStatus={showSmsPayoutStatus}
                                    setShowMerchantStatus={setShowSmsPayoutStatus}
                                    setSearchMerchantStatus={setSearchSmsPayoutStatus}
                                    searchMerchantStatus={searchSmsPayoutStatus}
                                    id="setShowSmsPayoutStatus"
                                    placeholderText="Status..."
                                >
                                    {["Success", "Pending", "Rejected", "Failed", "Cancelled"]?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                                            onClick={() => setSearchSmsPayoutStatus(item)}
                                        >
                                            <span> {item}</span>
                                        </div>
                                    ))}
                                </FilterStatus>
                            </div>
                            <div className="w-full 2xl:w-fit flex items-end justify-end mt-3 md:mt-0">
                                <DatePickers
                                    setStartEndDate={setStartEndDate}
                                    startEndDate={startEndDate}
                                />
                            </div>
                        </div>
                        <Table headers={headers}>
                            {loading ? (
                                // Skeleton Loader when loading
                                [...Array(ItemsPerPage)].map((_, index) => (
                                    <tr
                                        key={index}
                                        className="animate-pulse border-b border-gray-200"
                                    >
                                        <td className="px-6 py-4 text-left w-[50px]">
                                            <div className="h-4 bg-gray-300 rounded-md w-8"></div>
                                        </td>

                                        <td className="p-4 w-[150px] whitespace-nowrap">
                                            <div className="h-4 bg-gray-300 rounded-md w-24 mb-2"></div>
                                            <div className="h-4 bg-gray-300 rounded-md w-16"></div>
                                        </td>

                                        <td className="p-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-300 rounded-md w-32"></div>
                                        </td>

                                        <td className="p-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-300 rounded-md w-20"></div>
                                            <div className="h-4 bg-gray-300 rounded-md w-24 mt-2"></div>
                                        </td>

                                        <td className="p-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-300 rounded-md w-12"></div>
                                        </td>

                                        <td className="p-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-300 rounded-md w-36"></div>
                                        </td>

                                        <td className="p-4 whitespace-nowrap">
                                            <div className="h-4 bg-gray-300 rounded-md w-20"></div>
                                        </td>

                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 bg-gray-300 rounded-md"></div>
                                                <div className="h-8 w-8 bg-gray-300 rounded-md"></div>
                                                <div className="h-8 w-8 bg-gray-300 rounded-md"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : smsPayoutMethod?.length > 0 ? (
                                // Render data when available
                                smsPayoutMethod.map((item, index) => (
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
                                            {item.created_at &&
                                                moment(item.created_at).isValid() &&
                                                moment(item.created_at).format("DD MMM YYYY")}
                                            <br />
                                            {item.created_at &&
                                                moment(item.created_at).isValid() &&
                                                moment(item.created_at).format("h:mm a")}
                                        </td>

                                        <td className="p-4 whitespace-nowrap">

                                            {item?.from}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {item?.auto_withdraw?.currency && <>{item?.auto_withdraw?.currency}<br /></>}
                                            {item?.sender && <>{item.sender.charAt(0).toUpperCase() +
                                                item.sender.slice(1).toLowerCase()}<br /></>}
                                            {item?.auto_withdraw?.withdraw_number}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {item?.amount}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <h1 onClick={() => setSearchSmsPayout(item?.trx_id)} className="cursor-pointer">
                                                {item?.trx_id && (
                                                    <TextCopy text={item?.trx_id} />
                                                )}

                                            </h1>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {item?.auto_withdraw?.status}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">

                                            <div className="flex items-center gap-2">
                                                <ActionButton
                                                    id={item}
                                                    setAction={setShowPayoutMethodSms}
                                                    title={"View"}
                                                    icon={<FaRegEye />}
                                                    bgColor={"bg-blue-500 hover:bg-blue-800"}
                                                />
                                                <ActionButton
                                                    id={{
                                                        item: item,
                                                        status: item?.auto_withdraw?.status,
                                                        btnText: "Re Generate",
                                                        iconColor: "text-[#FF5733]",
                                                        icon: <GrRotateLeft size={40} />,
                                                        bgColor: "bg-[#FF5733]",
                                                        btnColor: "bg-[#FF5733] hover:bg-[#fc3d16]",
                                                        cancelBgColor: "text-white bg-red-500 hover:bg-red-800",
                                                        title: (
                                                            <>
                                                                Are you sure? <br />
                                                                You want to re-generate this payout sms.
                                                            </>
                                                        ),
                                                    }}
                                                    setAction={setSmsPayoutReGenerate}
                                                    title="Re-Generate"
                                                    icon={<TfiReload />}
                                                    bgColor="bg-[#FF5733] hover:bg-[#fc3d16]"
                                                />

                                                <ActionButton
                                                    title={"Delete"}
                                                    id={item.id}
                                                    setAction={setDeletePayoutMethodSms}
                                                    icon={<MdDelete />}
                                                    bgColor={"bg-red-500 hover:bg-red-800"}
                                                />
                                            </div>
                                        </td>


                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headers.length} className="p-4 text-center text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </Table>

                        {
                            total?.totalItems > 0 ? (
                                <TableFooter
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalPage={total?.totalPage}
                                    perPage={ItemsPerPage}
                                    setPerPage={setItemsPerPage}
                                    totalItems={total?.totalItems}
                                />
                            ) : null
                        }
                        {
                            showPayoutMethodSms && (
                                <ShowPayoutMethodSms
                                    showPayoutMethodSms={showPayoutMethodSms}
                                    setShowPayoutMethodSms={setShowPayoutMethodSms}
                                />
                            )
                        }
                        <DeleteItem
                            deleteItem={deletePayoutMethodSms}
                            setDeleteItem={setDeletePayoutMethodSms}
                            handleDeleteItem={handleDeletePayoutMethodSms}
                            text="Payout SMS"
                            loading={loadingDelete}
                        />
                        {
                            smsPayoutReGenerate && (
                                <PayoutMethodSmsStatusChange
                                    smsPayoutReGenerate={smsPayoutReGenerate}
                                    setSmsPayoutReGenerate={setSmsPayoutReGenerate}
                                    viewPayoutMethodSms={viewPayoutMethodSms}
                                    ItemsPerPage={ItemsPerPage}
                                    currentPage={currentPage}
                                    setSmsPayoutMethod={setSmsPayoutMethod}
                                    setTotal={setTotal}
                                />
                            )
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

export default PayoutSmsView;

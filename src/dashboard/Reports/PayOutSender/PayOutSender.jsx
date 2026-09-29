import { useEffect, useState } from "react";
import DatePickers from "../../../components/DatePickers";
import SearchFilterData from "../../../components/SearchFilterData";
import Table from "../../../components/Table";
import TableFooter from "../../../components/TableFooter";
import TitleDynamic from "../../../TitleDynamic";
import TransectionCard from "../TransectionCard";
import Cookies from "js-cookie";
import moment from "moment";
import { useLocation } from "react-router-dom";
import NoData from "../NoData";
import FilterStatus from "../../../components/FilterStatus";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFileExport, FaSpinner } from "react-icons/fa6";
import { TextCopy } from "../../../components/Textcopy";
function PayOutSender() {
    const headers = [
        "Sl",
        "Date",
        "Sender Info",
        "Payment Info",
        "Amount",
        "Trx ID / Reference ID",
        "Note",
        "Status",
    ];

    const [showMerchantList, setShowMerchantList] = useState(false);
    const [searchMerchantName, setSearchMerchantName] = useState("");
    const [searchMerchantNumber, setSearchMerchantNumber] = useState("");

    const [showPayoutStatus, setShowPayoutStatus] = useState(false);
    const [searchPayoutStatus, setSearchPayoutStatus] = useState("");

    const [showPayoutSenderStatus, setShowPayoutSenderStatus] = useState(false);
    const [searchPayoutSenderStatus, setSearchPayoutSenderStatus] = useState("");

    const [startEndDate, setStartEndDate] = useState({});

    const token = Cookies.get("token");

    const [cashInPayoutSenderList, setCashInPayoutSenderList] = useState([]);
    const [payOutTotal, setPayOutTotal] = useState({});
    const [payOutTableList, setPayOutTableList] = useState([]);
    const [total, setTotal] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [ItemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [loadingExport, setLoadingExport] = useState(false);

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

    const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
    const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");


    useEffect(() => {
        if (searchPayoutStatus == "") return;
        setSearchMerchantName("");
        const payoutSenderList = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_HOST}/admin/report/merchant/${searchPayoutStatus === 'Bkash' ? 'bkash-payout-senders' : 'nagad-payout-senders'}?status=${searchPayoutSenderStatus == 'Inactive' ? 0 : searchPayoutSenderStatus == 'Active' ? 1 : ''}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCashInPayoutSenderList(response?.data?.data);
            } catch (error) {
                // console.error("Error managing payment: ", error.message);
            }
        };
        payoutSenderList();
    }, [searchPayoutStatus, searchPayoutSenderStatus]);

    useEffect(() => {
        if (!searchPayoutStatus || !searchMerchantName?.wallet_number) return;

        const payInWalletList = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_HOST}/admin/report/merchant/wallet-payout-balance?start_date=${startDate}&end_date=${endDate}&merchant_number=${searchMerchantName?.wallet_number === "All Sender" ? "" : searchMerchantName?.wallet_number}&payment_method=${searchPayoutStatus}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setPayOutTotal(response?.data?.data)
            } catch (error) {
                // console.error("Error managing payment: ", error.message);
            }
            setLoading(false);
        };
        payInWalletList();
    }, [
        searchPayoutStatus,
        searchMerchantName,
        startEndDate
    ]);

    useEffect(() => {
        if (!searchPayoutStatus || !searchMerchantName?.wallet_number) return;

        payoutTotalGet();
    }, [currentPage,
        searchPayoutStatus,
        searchMerchantName,
        startEndDate,]);
    const payoutTotalGet = async () => {
        try {

            const response = await axios.get(
                `${import.meta.env.VITE_API_HOST}/admin/report/merchant/wallet-all-payouts?start_date=${startDate}&end_date=${endDate}&&merchant_number=${searchMerchantName?.wallet_number === "All Sender" ? "" : searchMerchantName?.wallet_number}&payment_method=${searchPayoutStatus}&page=${currentPage}&per_page=${ItemsPerPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPayOutTableList(response?.data?.data?.data);
            setTotal({
                totalItems: response?.data?.data?.total,
                totalPage: response?.data?.data?.last_page,
            })
        } catch (error) {
            // console.error("Error managing payment: ", error.message);
        }
    };
    useEffect(() => {
        setCurrentPage(1);
        payoutTotalGet();
    }, [
        ItemsPerPage
    ]);

    // filter by merchant number
    const filterMerchantUser = cashInPayoutSenderList?.filter((item) =>
        item?.wallet_number?.includes(searchMerchantNumber)
    );

    useEffect(() => {
        const handleClickOutsideOperator = (event) => {
            if (!event.target.closest("#setShowMerchantList")) {
                setShowMerchantList(false);
            }
        };
        const handleClickOutsidePayment = (event) => {
            if (!event.target.closest("#setShowPayoutStatus")) {
                setShowPayoutStatus(false);
            }
        };
        const handleClickOutsideStatus = (event) => {
            if (!event.target.closest("#setShowPayoutSenderStatus")) {
                setShowPayoutSenderStatus(false);
            }
        };

        window.document.addEventListener("click", handleClickOutsideOperator);
        window.document.addEventListener("click", handleClickOutsidePayment);
        window.document.addEventListener("click", handleClickOutsideStatus);

        return () => {
            window.document.removeEventListener("click", handleClickOutsideOperator);
            window.document.removeEventListener("click", handleClickOutsidePayment);
            window.document.removeEventListener("click", handleClickOutsideStatus);
        };
    }, []);

    const handleExportReportPayoutSender = async () => {

        if (!searchPayoutStatus) return toast.error("Please select payment method");
        if (!searchMerchantName?.wallet_number) return toast.error("Please select cash in wallet number");
        setLoadingExport(true);
        try {
            const localTimezone = moment.tz.guess();
            const localTime = moment().tz(localTimezone).format("YYYY-MM-DD HH:mm:ss");
            const date = new Date(localTime);
            const response = await axios.get(
                `${import.meta.env.VITE_API_HOST}/admin/report/merchant/wallet-all-payouts/export?start_date=${startDate}&end_date=${endDate}&merchant_number=${searchMerchantName?.wallet_number === "All Sender" ? "" : searchMerchantName?.wallet_number}&payment_method=${searchPayoutStatus}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );
            const fileType = response.headers["content-type"];
            let fileExtension = "";

            if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                fileExtension = ".xlsx";
            } else if (fileType === "application/zip") {
                fileExtension = ".zip";
            }

            if (fileExtension) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Pay Out Sender ${searchPayoutStatus} Report - ${date.toISOString()}${fileExtension}`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                // toast.error("Unsupported file type. Unable to download the report.");
            }
        } catch (error) {
            // console.error("Error exporting report: ", error.message);
        }
        setLoadingExport(false);
    };

    return (

        <section className="space-y-5">
            <TitleDynamic title="Cash In Wallet" />
            <div className="w-full flex flex-wrap md:flex-nowrap justify-between gap-2 px-6 pt-6">
                {/* Filter merchant number code start  */}

                <div className="w-full flex items-center flex-wrap gap-2">

                    <FilterStatus
                        showMerchantStatus={showPayoutStatus}
                        setShowMerchantStatus={setShowPayoutStatus}
                        setSearchMerchantStatus={setSearchPayoutStatus}
                        searchMerchantStatus={searchPayoutStatus}
                        id="setShowPayoutStatus"
                        placeholderText="Payment Method..."
                    >
                        {['Bkash', 'Nagad']?.map((item, index) => (
                            <div
                                key={index}
                                className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                                onClick={() => setSearchPayoutStatus(item)}
                            >
                                <span> {item}</span>
                            </div>
                        ))}
                    </FilterStatus>
                    <FilterStatus
                        showMerchantStatus={showPayoutSenderStatus}
                        setShowMerchantStatus={setShowPayoutSenderStatus}
                        setSearchMerchantStatus={setSearchPayoutSenderStatus}
                        searchMerchantStatus={searchPayoutSenderStatus}
                        id="setShowPayoutSenderStatus"
                        placeholderText="Status..."
                    >
                        {['Active', 'Inactive']?.map((item, index) => (
                            <div
                                key={index}
                                className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                                onClick={() => setSearchPayoutSenderStatus(item)}
                            >
                                <span> {item}</span>
                            </div>
                        ))}
                    </FilterStatus>
                    <SearchFilterData
                        dropdownManu={showMerchantList}
                        setDropdownManu={setShowMerchantList}
                        showData={searchMerchantName?.secret || searchMerchantName?.name}
                        setShowData={setSearchMerchantName}
                        placeholderText="All Sender..."
                        id="setShowMerchantList"
                    >
                        <input
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setSearchMerchantNumber(e.target.value)}
                            className="bg-gray-50 border-gray-300 text-gray-900 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-none"
                            placeholder="Search Sender..."
                        />

                        {/* Country List */}
                        {filterMerchantUser.length > 0 ? (
                            <>
                                <div
                                    className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                                    onClick={() => {
                                        setSearchMerchantName({ name: "All Sender", wallet_number: "All Sender" });
                                        setShowMerchantList(false);
                                    }}
                                >
                                    <h2>All Sender</h2>
                                </div>
                                {
                                    filterMerchantUser.map((item, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                                            onClick={() => {
                                                setSearchMerchantName(item);
                                                setSearchMerchantNumber("");
                                                setShowMerchantList(false);
                                            }}
                                        >
                                            <h2>{item.secret}</h2>
                                            {/* <h2>{item.name}</h2> */}
                                            <h2>{item.wallet_number}</h2>
                                        </div>
                                    ))
                                }

                            </>) : (
                            <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
                                No Data Available
                            </div>
                        )}
                    </SearchFilterData>
                </div>

                <DatePickers
                    setStartEndDate={setStartEndDate}
                    startEndDate={startEndDate}
                />

                <div className="w-full md:w-auto">
                    <button onClick={handleExportReportPayoutSender} disabled={loadingExport} className="button_gradient flex items-start gap-3 w-full md:w-auto">  {loadingExport ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            Loading...
                        </>
                    ) : (
                        <>
                            <FaFileExport />
                            Export
                        </>
                    )}
                    </button>
                </div>
            </div>
            {
                payOutTotal && Object.keys(payOutTotal).length > 0 ? (<>

                    <div className="grid grid-cols-1 gap-5 px-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                        {[
                            {
                                transaction: payOutTotal?.today_transactions,
                                title: "Today Transactions",
                            },
                            {
                                transaction: payOutTotal?.yesterday_transactions,
                                title: "Yesterday Transactions",
                            },
                            {
                                transaction: payOutTotal?.weekly_transactions,
                                title: "Weekly Transactions",
                            },
                            {
                                transaction: payOutTotal?.monthly_transactions,
                                title: "Monthly Transactions",
                            },
                            {
                                transaction: payOutTotal?.transactions_by_date,
                                title: "Filter Transactions",
                            },
                        ].map((item, index) => (
                            <TransectionCard
                                key={index}
                                transaction={item.transaction}
                                transactionCount="cashInWallet"
                                title={item.title}
                                loading={loading}
                            />
                        ))}
                    </div>

                    {/* To display data in a table format  */}
                    <Table headers={headers}>
                        {loading ? Array.from({ length: 10 }).map((_, index) => (
                            <tr key={index} className="table_tr">
                                <td className="py-4 pl-6 w-[50px]">
                                    <div className="h-4 bg-gray-300 rounded w-8 animate-pulse"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse mt-1"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 rounded w-40 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse mt-1"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div>
                                </td>
                                <td className="p-4">
                                    <div className="h-6 bg-gray-300 rounded w-20 animate-pulse"></div>
                                </td>
                            </tr>
                        )) : payOutTableList?.map((item, index) => (
                            <tr key={index} className="table_tr">
                                <td className="py-4 pl-6 w-[50px]">
                                    {total?.totalItems -
                                        ((currentPage - 1) * ItemsPerPage + index)}
                                </td>
                                <td className="p-4">
                                    {item.created_at && moment(item.created_at).format("DD MMM YYYY")}
                                    <br />
                                    {item.created_at && moment(item.created_at).format("h:mm a")}
                                </td>

                                <td className="p-4">{item.sender}</td>
                                <td className="p-4">
                                    {item?.currency && <>{item.currency}<br /></>}
                                    {item.payment_method && <>{item.payment_method.charAt(0).toUpperCase() +
                                        item.payment_method.slice(1).toLowerCase()}<br /></>}
                                    {item.withdraw_number}
                                </td>
                                <td className="p-4">
                                    {item?.amount && item?.amount}
                                </td>
                                <td className="p-4 ">
                                    {item.trxID && <TextCopy text={item.trxID} fontSize="font-bold" />}
                                    {item.reference && <TextCopy text={item.reference} />}
                                </td>
                                <td className="p-4">
                                    {item?.note}
                                </td>
                                <td className="p-4 ">
                                    <span
                                        className={`px-2 py-0.5 rounded border border-dotted flex items-center cursor-pointer gap-2 w-fit ${{
                                            Success: "bg-green-600 hover:bg-green-800 text-white border-green-800",
                                            Pending:
                                                "bg-[#ff7654] hover:bg-[#da5737] text-white border-[#ff7654]",
                                            Failed: "bg-red-600 hover:bg-red-800 text-white border-red-800",
                                            Rejected: "bg-[#ff1d1d] hover:bg-[#d63737] text-white border-[#ff1d1d]",
                                        }[item.status] ||
                                            "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </Table>
                    {/* To display data in a table format  */}

                    {/* table footer code  */}

                    <TableFooter
                        totalItems={total?.totalItems || 0}
                        currentPage={currentPage}
                        perPage={ItemsPerPage}
                        setPerPage={setItemsPerPage}
                        setCurrentPage={setCurrentPage}
                        totalPage={total?.totalPage || 0}
                    /></>) : <NoData title="Please choose a payment method and enter your sender address to proceed." />}

            {/* table footer code  */}
            {/*       </>
            ) : (
                
            )} */}
        </section>
    );
}

export default PayOutSender;
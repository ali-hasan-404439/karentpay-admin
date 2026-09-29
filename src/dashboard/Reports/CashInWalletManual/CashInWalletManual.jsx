import { useEffect, useState } from "react";
import DatePickers from "../../../components/DatePickers";
import SearchFilterData from "../../../components/SearchFilterData";
import Table from "../../../components/Table";
import TableFooter from "../../../components/TableFooter";
import TitleDynamic from "../../../TitleDynamic";
import TransectionCard from "../TransectionCard";
import Cookies from "js-cookie";
import moment from "moment-timezone";
import { useLocation } from "react-router-dom";
import NoData from "../NoData";
import FilterStatus from "../../../components/FilterStatus";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFileExport, FaSpinner } from "react-icons/fa6";
import { TextCopy } from "../../../components/Textcopy";

function CashInWalletManual() {
    const headers = [
        "Sl",
        "Date",
        "Sender Info",
        "Wallet Info",
        "Amount",
        "Trx ID / Reference ID",
        "Note",
        "Status",
    ];

    const [showMerchantList, setShowMerchantList] = useState(false);
    const [searchMerchantName, setSearchMerchantName] = useState("");
    const [showCashInWalletMethod, setShowCashInWalletMethod] = useState(false);
    const [searchCashInWalletMethod, setSearchCashInWalletMethod] = useState("");
    const [showCashInWalletStatus, setShowCashInWalletStatus] = useState(false);
    const [searchCashInWalletStatus, setSearchCashInWalletStatus] = useState("");
    const [searchMerchantNumber, setSearchMerchantNumber] = useState("");
    const [loadingExport, setLoadingExport] = useState(false);

    const [startEndDate, setStartEndDate] = useState({});


    const token = Cookies.get("token");


    const [cashInWalletTotal, setCashInWalletTotal] = useState({});
    const [cashInWalletWalletList, setCashInWalletWalletList] = useState([]);
    const [cashInWalletTableList, setCashInWalletTableList] = useState([]);
    const [total, setTotal] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [ItemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

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
        if (searchCashInWalletMethod == "") return;
        setSearchMerchantName("");
        setCashInWalletTableList([]);
        setTotal({});
        const cashInWalletMethodList = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_HOST}/admin/report/merchant/${searchCashInWalletMethod === 'Bkash' ? 'bkash-wallet-senders' : 'nagad-wallet-senders'}?status=${searchCashInWalletStatus == 'Inactive' ? 0 : searchCashInWalletStatus == 'Active' ? 1 : ''}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCashInWalletWalletList(response?.data?.data);
            } catch (error) {
                // console.error("Error managing payment: ", error.message);
            }
        };
        cashInWalletMethodList();
    }, [searchCashInWalletMethod, searchCashInWalletStatus]);


    useEffect(() => {
        if (!searchCashInWalletMethod || !searchMerchantName?.wallet_number) return;
        const cashInWalletTotalGet = async () => {
            setLoading(true);

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_HOST}/admin/report/merchant/wallet-deposit-balance?start_date=${startDate}&end_date=${endDate}&merchant_number=${searchMerchantName?.wallet_number === "All Wallet" ? "" : searchMerchantName?.wallet_number}&payment_method=${searchCashInWalletMethod}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCashInWalletTotal(response?.data?.data)
            } catch (error) {
                // console.error("Error managing payment: ", error.message);
            }
            setLoading(false);
        };

        cashInWalletTotalGet();
    }, [
        searchCashInWalletMethod,
        searchMerchantName,
        startEndDate
    ]);


    useEffect(() => {

        if (!searchCashInWalletMethod || !searchMerchantName?.wallet_number) return;
        getCashInWalletTableData();
    }, [
        searchMerchantName,
        searchCashInWalletMethod,
        currentPage,
        startEndDate,

    ]);
    const getCashInWalletTableData = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_HOST}/admin/report/merchant/wallet-all-deposits?payment_method=${searchCashInWalletMethod}&merchant_number=${searchMerchantName?.wallet_number === "All Wallet" ? "" : searchMerchantName?.wallet_number}&start_date=${startDate}&end_date=${endDate}&page=${currentPage}&per_page=${ItemsPerPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTotal({
                totalItems: response?.data?.data?.total,
                totalPage: response?.data?.data?.last_page,
            })
            setCashInWalletTableList(response?.data?.data?.data);
        } catch (error) {
            // console.error("Error managing payment: ", error.message);
        }
    };
    useEffect(() => {
        setCurrentPage(1);
        getCashInWalletTableData();
    }, [ItemsPerPage]);

    // filter by merchant number
    const filterMerchantUser = cashInWalletWalletList?.filter((item) =>
        item?.wallet_number.includes(searchMerchantNumber)
    );

    useEffect(() => {
        const handleClickOutsideOperator = (event) => {
            if (!event.target.closest("#setShowMerchantList")) {
                setShowMerchantList(false);
            }
        };
        const handleClickOutsideStatus = (event) => {
            if (!event.target.closest("#setShowCashInWalletStatus")) {
                setShowCashInWalletStatus(false);
            }
        };
        const handleClickOutsideMethod = (event) => {
            if (!event.target.closest("#setShowCashInWalletMethod")) {
                setShowCashInWalletMethod(false);
            }
        };

        window.document.addEventListener("click", handleClickOutsideOperator);
        window.document.addEventListener("click", handleClickOutsideMethod);
        window.document.addEventListener("click", handleClickOutsideStatus);

        return () => {
            window.document.removeEventListener("click", handleClickOutsideOperator);
            window.document.removeEventListener("click", handleClickOutsideMethod);
            window.document.removeEventListener("click", handleClickOutsideStatus);
        };
    }, []);

    const handleExportReportCashInWallet = async () => {
        if (!searchCashInWalletMethod) return toast.error("Please select payment method");
        if (!searchMerchantName?.wallet_number) return toast.error("Please select cash in wallet number");

        setLoadingExport(true);
        try {
            const localTimezone = moment.tz.guess();
            const localTime = moment().tz(localTimezone).format("YYYY-MM-DD HH:mm:ss");
            const date = new Date(localTime);
            const response = await axios.get(
                `${import.meta.env.VITE_API_HOST}/admin/report/merchant/wallet-all-deposits/export?start_date=${startDate}&end_date=${endDate}&merchant_number=${searchMerchantName?.wallet_number === "All Wallet" ? "" : searchMerchantName?.wallet_number}&payment_method=${searchCashInWalletMethod}`,
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
                link.setAttribute("download", `Cash In Wallet Manual ${searchMerchantName?.wallet_number} Report - ${date.toISOString()}${fileExtension}`);
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
            <div className="w-full flex flex-wrap md:flex-nowrap items-center justify-between gap-2 px-6 pt-6">
                {/* Filter merchant number code start  */}

                <div className="w-full flex items-center flex-wrap gap-2">

                    <FilterStatus
                        showMerchantStatus={showCashInWalletMethod}
                        setShowMerchantStatus={setShowCashInWalletMethod}
                        setSearchMerchantStatus={setSearchCashInWalletMethod}
                        searchMerchantStatus={searchCashInWalletMethod}
                        id="setShowCashInWalletMethod"
                        placeholderText="Payment Method..."
                    >
                        {['Bkash', 'Nagad']?.map((item, index) => (
                            <div
                                key={index}
                                className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                                onClick={() => setSearchCashInWalletMethod(item)}
                            >
                                <span> {item}</span>
                            </div>
                        ))}
                    </FilterStatus>

                    <FilterStatus
                        showMerchantStatus={showCashInWalletStatus}
                        setShowMerchantStatus={setShowCashInWalletStatus}
                        setSearchMerchantStatus={setSearchCashInWalletStatus}
                        searchMerchantStatus={searchCashInWalletStatus}
                        id="setShowCashInWalletStatus"
                        placeholderText="Status..."
                    >
                        {['Active', 'Inactive']?.map((item, index) => (
                            <div
                                key={index}
                                className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                                onClick={() => setSearchCashInWalletStatus(item)}
                            >
                                <span> {item}</span>
                            </div>
                        ))}
                    </FilterStatus>
                    <SearchFilterData
                        dropdownManu={showMerchantList}
                        setDropdownManu={setShowMerchantList}
                        showData={searchMerchantName?.name}
                        setShowData={setSearchMerchantName}
                        placeholderText="All Wallet..."
                        id="setShowMerchantList"
                    >
                        <input
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setSearchMerchantNumber(e.target.value)}
                            className="bg-gray-50 border-gray-300 text-gray-900 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-none"
                            placeholder="Search Wallet Number..."
                        />

                        {/* Country List */}
                        {filterMerchantUser.length > 0 ? (
                            filterMerchantUser.map((item, index) => (

                                <>
                                    <div
                                        className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                                        onClick={() => {
                                            setSearchMerchantName({ name: "All Wallet", wallet_number: "All Wallet" });
                                            setShowMerchantList(false);
                                        }}
                                    >
                                        <h2>All Wallet</h2>
                                    </div>
                                    {filterMerchantUser.map((item, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                                            onClick={() => {
                                                setSearchMerchantName(item);
                                                setSearchMerchantNumber("");
                                                setShowMerchantList(false);
                                            }}
                                        >
                                            <h2>{item.name}</h2>
                                            <h2>{item.wallet_number}</h2>
                                        </div>
                                    ))}
                                </>
                            ))
                        ) : (
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
                <button onClick={handleExportReportCashInWallet} disabled={loadingExport} className="button_gradient flex items-start gap-3 w-full md:w-auto">  {loadingExport ? (
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
            {/* {searchMerchantName ? (
                <> */}
            {
                cashInWalletTotal && Object.keys(cashInWalletTotal).length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-5 px-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                            {[
                                {
                                    transaction: cashInWalletTotal?.today_transactions,
                                    title: "Today Transactions",
                                },
                                {
                                    transaction: cashInWalletTotal?.yesterday_transactions,
                                    title: "Yesterday Transactions",
                                },
                                {
                                    transaction: cashInWalletTotal?.weekly_transactions,
                                    title: "Weekly Transactions",
                                },
                                {
                                    transaction: cashInWalletTotal?.monthly_transactions,
                                    title: "Monthly Transactions",
                                },
                                {
                                    transaction: cashInWalletTotal?.transactions_by_date,
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
                            {loading ? Array.from({ length: ItemsPerPage }).map((_, index) => (
                                <tr key={index} className="table_tr">
                                    <td className="py-4 pl-6 w-[50px]">
                                        <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-2"></div>
                                        <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
                                        <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
                                        <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-6 w-20 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-6 w-20 bg-gray-300 rounded animate-pulse"></div>
                                    </td>
                                </tr>
                            )) : cashInWalletTableList?.map((item, index) => (
                                <tr key={index} className="table_tr">
                                    <td className="py-4 pl-6 W-[50px]">
                                        {total?.totalItems -
                                            ((currentPage - 1) * ItemsPerPage + index)}
                                    </td>
                                    <td className="p-4 whitespace-nowrap">
                                        {item?.created_at && moment(item.created_at).format("DD MMM YYYY")}
                                        <br />
                                        {item.created_at && moment(item.created_at).format("h:mm a")}
                                    </td>

                                    <td className="p-4 cursor-pointer">
                                        {item?.customerMsisdn}
                                    </td>
                                    <td className="p-4">
                                        {item.currency && <>{item.currency}<br /></>}
                                        {item.payment_method && <>{item.payment_method.charAt(0).toUpperCase() +
                                            item.payment_method.slice(1).toLowerCase()}<br /></>}

                                        {item.merchant_number}
                                    </td>

                                    <td className="p-4">{item.amount}</td>
                                    <td className="p-4 ">
                                        {item.trxID && <TextCopy text={item.trxID} fontSize="font-bold" />}
                                        {item.reference && <TextCopy text={item.reference} />}
                                    </td>
                                    <td className="p-4 w-[200px]">
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
                                            }[item.transactionStatus] ||
                                                "bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400"
                                                }`}
                                        >
                                            {item.transactionStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                        {/* To display data in a table format  */}

                        {/* table footer code  */}

                        <TableFooter
                            totalItems={total.totalItems || 0}
                            currentPage={currentPage}
                            perPage={ItemsPerPage}
                            setPerPage={setItemsPerPage}
                            setCurrentPage={setCurrentPage}
                            totalPage={total.totalPage || 0}
                        />
                        {/* table footer code  */}
                    </>
                ) : (
                    <NoData title="Please choose a payment method and enter your wallet address to proceed." />
                )
            }


            {/*      </>
            ) : (
                <NoData title="CashIn" />
            )} */}
        </section>
    );
}

export default CashInWalletManual;
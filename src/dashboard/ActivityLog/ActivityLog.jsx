import React, { useEffect, useState } from 'react';
import TitleDynamic from '../../TitleDynamic';
import moment from "moment";
import Table from '../../components/Table';
import SearchInputField from '../../components/SearchInputField';
import DatePickers from '../../components/DatePickers';
import FilterStatus from '../../components/FilterStatus';
import TableFooter from '../../components/TableFooter';
import { useLocation } from 'react-router-dom';
import Auth from '../../utils/Auth';
import SearchFilterData from '../../components/SearchFilterData';
import ActionButton from '../../components/ActionButton';

import { IoEyeSharp } from "react-icons/io5";
import ActivityDetails from './ActivityDetails';
import UserAgentDetails from './UserAgentDetails';
function ActivityLog() {
    // Define table headers
    const headers = [
        'Sl',
        'Date',
        'User Info',
        'Level',
        'Section',
        'Message',
        'IP Address',
        'Identity',
        'Action',
    ];
    const { ApiRequest } = Auth();
    const [search, setSearch] = useState('');
    const [showLevelAction, setShowLevelAction] = useState(false);
    const [levelAction, setLevelAction] = useState('');
    const [showActivity, setShowActivity] = useState(false);
    const [searchSections, setSearchSections] = useState('');
    const [activity, setActivity] = useState('');
    const [showActivityDetails, setShowActivityDetails] = useState('');
    const [startEndDate, setStartEndDate] = useState({
        startDate: "",
        endDate: "",
    });


    const startDate = moment(startEndDate?.startDate).format("YYYY-MM-DD");
    const endDate = moment(startEndDate?.endDate).format("YYYY-MM-DD");
    // difference day today and start date
    const date = new Date();
    const today = moment(date).format("YYYY-MM-DD");
    const startDates = moment(startDate);
    const todayDate = moment(today);
    const differenceInDays = todayDate.diff(startDates, "days");

    const [currentPage, setCurrentPage] = useState(1);
    const [ItemsPerPage, setItemsPerPage] = useState(10);

    const [loading, setLoading] = useState(false);
    const [activityLogData, setActivityLogData] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);
    const [levelsList, setLevelsList] = useState([]);
    const [total, setTotal] = useState({});

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

    useEffect(() => {
        getActivityLog();
    }, [currentPage,]);

    const getActivityLog = async () => {
        setLoading(true);
        try {
            const response = await ApiRequest({
                url: `/admin/logs?per_page=${ItemsPerPage}&page=${currentPage}&search=${search}&start_date=${differenceInDays > 0 ? startDate : ""
                    }&end_date=${differenceInDays > 0 ? endDate : ""}&section=${activity == null ? "" : activity}&level=${levelAction == null ? "" : levelAction}`,
                method: "get",
            });
            setTotal({
                totalPage: response?.data?.last_page,
                totalItems: response?.data?.total,
            })
            setActivityLogData(response.data?.data);
        } catch (error) {
            // console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setCurrentPage(1);
        getActivityLog();
    }, [ItemsPerPage, search, startEndDate, activity, levelAction]);

    useEffect(() => {
        const handleClickOutsideOperator = (event) => {
            if (!event.target.closest("#setShowLevelAction")) {
                setShowLevelAction(false);
            }
        };
        const handleClickOutShowCountry = (event) => {
            if (!event.target.closest("#setShowActivity")) {
                setShowActivity(false);
            }
        };
        window.document.addEventListener("click", handleClickOutsideOperator);
        window.document.addEventListener("click", handleClickOutShowCountry);

        return () => {
            window.document.removeEventListener("click", handleClickOutsideOperator);
            window.document.removeEventListener("click", handleClickOutShowCountry);
        };
    }, []);
    useEffect(() => {
        getSections();
        getLevels();
    }, []);
    const getSections = async () => {
        try {
            const response = await ApiRequest({
                url: `/admin/log_sections`,
                method: "get",
            });
            setSectionsList(response.data);
        } catch (error) {
            // console.log(error);
        }
    };
    const getLevels = async () => {
        try {
            const response = await ApiRequest({
                url: `/admin/log_levels`,
                method: "get",
            });
            setLevelsList(response.data);
        } catch (error) {
            // console.log(error);
        }
    };

    // filter by sections
    const filterSections = sectionsList?.filter((item) =>
        item?.toLowerCase().includes(searchSections?.toLowerCase())
    );
    return (
        <div className="boxShadow-table bg-white dark:bg-[#1F2836] mb-5">
            {/* Dynamic Title */}
            <TitleDynamic title="Activity Log" />
            <div className="items-center justify-between px-5 py-6 flex flex-wrap gap-y-2 w-full">
                <div className="w-full flex flex-wrap items-center justify-between gap-2  ">
                    {/* Search Name, Trx id, and Reference code start */}
                    <div className="flex items-center flex-wrap gap-2">
                        <SearchInputField
                            searchText={search}
                            setSearchText={setSearch}
                            placeholderText="Search Message..."
                        />
                        <FilterStatus
                            showMerchantStatus={showLevelAction}
                            setShowMerchantStatus={setShowLevelAction}
                            setSearchMerchantStatus={setLevelAction}
                            searchMerchantStatus={levelAction}
                            id="setShowLevelAction"
                            placeholderText="Select Level..."
                        >
                            {levelsList?.map((item, index) => (
                                <div
                                    key={index}
                                    className="px-2 py-2 lg:py-2 lg:px-3 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white w-full justify-between"
                                    onClick={() => setLevelAction(item)}
                                >
                                    <span> {item}</span>
                                </div>
                            ))}
                        </FilterStatus>
                        <SearchFilterData
                            dropdownManu={showActivity}
                            setDropdownManu={setShowActivity}
                            showData={activity?.length > 20 ? activity.slice(0, 20) + '...' : activity}
                            setShowData={setActivity}
                            placeholderText="Select Section..."
                            id="setShowActivity"
                        >
                            <input
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setSearchSections(e.target.value)}
                                className="bg-gray-50 border-gray-300 text-gray-900 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-none"
                                placeholder="Search Section..."
                            />
                            {filterSections?.length > 0 ? (
                                filterSections?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-2 text-black dark:text-white cursor-pointer hover:bg-gradient-to-r from-[#395BEF] to-[#5C28D5] hover:text-white"
                                        onClick={() => {
                                            setActivity(item);
                                            setSearchSections("");
                                            setShowActivity(false);
                                        }}
                                    >
                                        <h2 className="grid grid-cols-1">{item?.length > 20 ? item.slice(0, 20) + '...' : item}</h2>
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-gray-600 dark:text-gray-400">
                                    No Data Available
                                </div>
                            )}
                        </SearchFilterData>
                    </div>
                    <div className="w-full 2xl:w-fit flex items-end justify-end">
                        <DatePickers
                            setStartEndDate={setStartEndDate}
                            startEndDate={startEndDate}
                        />
                    </div>
                </div>
            </div>
            {/* Table */}
            <Table headers={headers}>
                {loading ? Array(10)
                    .fill(0)
                    .map((_, index) => (
                        <tr
                            key={index}
                            className=" table_tr"
                        >
                            <td className="px-6 py-4 w-[50px]">
                                <div className="h-8  w-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                            </td>
                            <td className="p-4 w-[150px]">
                                <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                                <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded mt-2"></div>
                            </td>
                            <td className="p-4 w-[250px]">
                                <div className="h-20 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                            </td>
                            <td className="p-4 w-[100px]">
                                <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                            </td>
                            <td className="p-4 w-[250px]">
                                <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                            </td>
                            <td className="p-4 w-[350px]">
                                <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                            </td>
                            <td className="p-4 w-[200px]">
                                <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                            </td>
                            <td className="p-4 space-y-1">
                                <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                                <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                                <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                                <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                            </td>
                            <td className="p-4 space-y-1">
                                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full"></div>
                            </td>
                        </tr>
                    )) : activityLogData?.map((item, index) => (
                        <tr
                            key={index}
                            data-testid="table-row-element"
                            className="table_tr"
                        >
                            <td className="px-6 py-4 w-[50px]">
                                {total?.totalItems - ((currentPage - 1) * ItemsPerPage + index)}
                            </td>

                            <td className="p-4 whitespace-nowrap w-[150px]">
                                {item?.logged_at && (
                                    <>
                                        {moment(item.logged_at).format("DD MMM YYYY")}
                                        <br />
                                        {moment(item.logged_at).format("h:mm a")}
                                    </>
                                )}
                            </td>

                            <td className="p-4 cursor-pointer w-[250px]">
                                {
                                    item?.user ?
                                        <div
                                            className="cursor-pointer flex items-center p-2 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold"
                                        >
                                            {item?.user?.name && <>{item?.user?.name}<br /></>}
                                            {item?.user?.email && <>{item?.user?.email}<br /></>}
                                            {item?.user?.phone && <>{item?.user?.phone}</>}
                                        </div>
                                        : <div
                                            className="cursor-pointer flex items-center p-5 border hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:text-white rounded font-semibold"
                                        >
                                            Anonymous User
                                        </div>
                                }
                            </td>

                            <td className="p-4 w-[100px]">
                                {item?.level_name}
                            </td>

                            <td className="p-4 w-[250px]">
                                {item?.section}
                            </td>

                            <td className="p-4 w-[350px]">
                                <span className='cursor-pointer hover:text-blue-500' onClick={() => setSearch(item?.message)}>{item?.message}</span>
                            </td>

                            <td className="p-4  whitespace-nowrap w-[150px]">
                                {item?.user_ip}
                            </td>

                            <td className="p-4 text-gray-900 whitespace-nowrap dark:text-white">
                                <UserAgentDetails userAgent={item.user_agent} />
                            </td>
                            <td className="p-4 text-gray-900 whitespace-nowrap dark:text-white">
                                <ActionButton
                                    id={item}
                                    setAction={setShowActivityDetails}
                                    title={"View"}
                                    icon={<IoEyeSharp />}
                                    bgColor={"bg-blue-500 hover:bg-blue-800"}
                                />
                            </td>
                        </tr>
                    ))}
            </Table>
            <TableFooter
                totalItems={total?.totalItems}
                currentPage={currentPage}
                perPage={ItemsPerPage}
                setPerPage={setItemsPerPage}
                setCurrentPage={setCurrentPage}
                totalPage={total?.totalPage}
            />
            <ActivityDetails
                showActivityDetails={showActivityDetails}
                setShowActivityDetails={setShowActivityDetails}
            />
        </div>
    );
}
export default ActivityLog;

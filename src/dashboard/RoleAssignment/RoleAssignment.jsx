import { CiEdit } from "react-icons/ci";
import Table from "../../components/Table";
import TitleDynamic from "../../TitleDynamic";
import ActionButton from "../../components/ActionButton";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdClose, MdDelete } from "react-icons/md";
import DeleteItem from "../../components/DeleteItem";
import { toast } from "react-toastify";

function RoleAssignment() {
    const [addNewRole, setAddNewRole] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteNewRole, setDeleteNewRole] = useState(null)
    const headers = [
        'Name',
        'View',
        'Add',
        'Edit',
        'Delete',
        'Action',
        'Actions'
    ]
    const addHeaders = [
        'Menu',
        'View',
        'Add',
        'Edit',
        'Delete',
        'Action',
    ]
    const data = [
        {
            name: "John Doe",
            view: 1,
            add: 11,
            edit: 25,
            delete: 10,
            action: 1,
            actions: 1,
        }
    ]
    const DashboardMenuBar = [
        {
            label: "Dashboard",
            View: false,
            Add: true,
            Edit: true,
            Delete: true,
            Action: true,
        },
        {
            label: "Merchant Cash In",
            View: false,
            Add: true,
            Edit: true,
            Delete: false,
            Action: false,
        },
        {
            label: "Merchant Payout",
            View: false,
            Add: true,
            Edit: true,
            Delete: false,
            Action: false,
        },
        {
            label: "Merchant Withdraw",
            View: false,
            Add: true,
            Edit: true,
            Delete: false,
            Action: false,
        },
        {
            label: "Merchant Reports / Cash In",
            View: false,
            Add: true,
            Edit: true,
            Delete: true,
            Action: true,
        },
        {
            label: "Merchant Reports / Payout",
            View: false,
            Add: true,
            Edit: true,
            Delete: true,
            Action: true,
        },
        {
            label: "Merchant Reports / Withdraw",
            View: false,
            Add: true,
            Edit: true,
            Delete: true,
            Action: true,
        },
        {
            label: "Merchant Reports / Robotic",
            View: false,
            Add: true,
            Edit: true,
            Delete: true,
            Action: true,
        },
        {
            label: "Merchant Reports / Cash In Wallet",
            View: false,
            Add: true,
            Edit: true,
            Delete: true,
            Action: true,
        },
        {
            label: "Merchant Reports / Payout Sender",
            View: false,
            Add: true,
            Edit: true,
            Delete: true,
            Action: true,
        },
        {
            label: "All User / Merchant Request",
            View: false,
            Add: true,
            Edit: true,
            Delete: false,
            Action: false,
        },
        {
            label: "All User / IP Request",
            View: false,
            Add: true,
            Edit: true,
            Delete: false,
            Action: false,
        },
        {
            label: "All User / All Merchant",
            View: false,
            Add: true,
            Edit: false,
            Delete: false,
            Action: false,
        },
        {
            label: "All User / All User",
            View: false,
            Add: true,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Payment Method / Cash In Method / Bkash",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Payment Method / Cash In Method / Nagad",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Payment Method / Payout Method",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Payment Method / Manual Method",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Email",
            View: false,
            Add: true,
            Edit: true,
            Delete: false,
            Action: true,
        },
        {
            label: "Support",
            View: false,
            Add: true,
            Edit: true,
            Delete: false,
            Action: true,
        },
        {
            label: "Support / Reply",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "News / Post categories",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "News / All Post",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "News / Documentation",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Pages",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Review",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Assignment / Withdraw Currency",
            View: false,
            Add: false,
            Edit: true,
            Delete: false,
            Action: true,
        },
        {
            label: "Management / Download Section",
            View: false,
            Add: false,
            Edit: false,
            Delete: true,
            Action: false,
        },
        {
            label: "Management / Upload Application",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Home Pages / Banner",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Home Pages / Payment Support",
            View: false,
            Add: false,
            Edit: true,
            Delete: false,
            Action: true,
        },
        {
            label: "Home Pages / Pricing",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Home Pages / Why Us",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Home Pages / FAQ",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Home Pages / Contact Us",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Role Assignment",
            View: false,
            Add: false,
            Edit: false,
            Delete: false,
            Action: true,
        },
        {
            label: "Role Assignment",
            View: false,
            Add: true,
            Edit: true,
            Delete: true,
            Action: true,
        },
        {
            label: "Application Setting / Logo & Identity",
            View: false,
            Add: false,
            Edit: false,
            Delete: true,
            Action: true,
        },
        {
            label: "Application Setting / Header Setting",
            View: false,
            Add: false,
            Edit: false,
            Delete: true,
            Action: true,
        },
        {
            label: "Application Setting / Footer Setting",
            View: false,
            Add: false,
            Edit: false,
            Delete: true,
            Action: true,
        },
        {
            label: "Application Setting / Color Setting",
            View: false,
            Add: false,
            Edit: false,
            Delete: true,
            Action: true,
        },
        {
            label: "Application Setting / Mailing Setting",
            View: false,
            Add: false,
            Edit: false,
            Delete: true,
            Action: true,
        },
        {
            label: "Application Setting / Profile Setting",
            View: false,
            Add: false,
            Edit: false,
            Delete: true,
            Action: true,
        },
        {
            label: "Application Setting / Payment Setting",
            View: false,
            Add: false,
            Edit: false,
            Delete: true,
            Action: true,
        },
        {
            label: "Application Setting / Others Setting",
            View: false,
            Add: false,
            Edit: false,
            Delete: true,
            Action: true,
        },
    ];

    const handleDelete = (id) => {
        toast.error("Not Implemented");
        setDeleteNewRole(null);
    };
    return (
        <div className="boxShadow-table bg-white dark:bg-[#1F2836] mb-5">
            <TitleDynamic title="Role Assignment" />
            {
                addNewRole ? <>
                    <div className="flex items-center justify-end gap-2 px-5 py-6">
                        <input
                            className="block w-full text-gray-900 border border-gray-300 rounded bg-gray-50 focus:outline-none  dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                            type="text"
                            placeholder="Name Of The Role"
                        />
                        <button
                            onClick={() => setAddNewRole(!addNewRole)}
                            className="p-[5px] rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                        >
                            <MdClose size={30} />
                        </button>
                    </div>
                    <Table headers={addHeaders}>
                        {DashboardMenuBar?.map((item, index) => (
                            <tr
                                key={index}
                                data-testid="table-row-element"
                                className="table_tr"
                            >
                                <td className="py-4 px-6 max-w-[550px] whitespace-nowrap">
                                    {item?.label}
                                </td>

                                <td className="p-4">
                                    {
                                        item?.View ? (

                                            ""
                                        ) : <input
                                            type="checkbox"
                                            disabled={item?.View}
                                            className='size-7 rounded border-gray-300 cursor-pointer'
                                        />
                                    }
                                </td>
                                <td className="p-4">

                                    {
                                        item?.Add ? "" : <input
                                            type="checkbox"
                                            disabled={item?.Add}
                                            className='size-7 rounded border-gray-300 cursor-pointer'
                                        />
                                    }
                                </td>
                                <td className="p-4">
                                    {
                                        item?.Edit ? "" :
                                            <input
                                                type="checkbox"
                                                disabled={item?.Edit}
                                                className='size-7 rounded border-gray-300 cursor-pointer'
                                            />
                                    }
                                </td>
                                <td className="p-4">
                                    {
                                        item?.Delete ? "" :
                                            <input
                                                type="checkbox"
                                                disabled={item?.Delete}
                                                className='size-7 rounded border-gray-300 cursor-pointer'
                                            />
                                    }
                                </td>
                                <td className="p-4">
                                    {
                                        item?.Action ? "" :
                                            <input
                                                type="checkbox"
                                                disabled={item?.Action}
                                                className='size-7 rounded border-gray-300 cursor-pointer'
                                            />
                                    }
                                </td>
                            </tr>
                        ))}
                    </Table>;

                    <div className="flex justify-end w-full p-5 ">
                        <button
                            className="button_gradient"
                        >
                            Submit Role
                        </button>
                    </div>
                </> :
                    <>
                        <div className="flex justify-end px-5 py-6">

                            <button
                                onClick={() => setAddNewRole(!addNewRole)}
                                className="button_gradient"
                            >
                                <IoMdAdd />  Add New Role
                            </button>
                        </div>

                        <Table headers={headers}>
                            {data?.map((item, index) => (
                                <tr
                                    key={index}
                                    data-testid="table-row-element"
                                    className="table_tr"
                                >
                                    <td className="py-4 px-6  max-w-[550px] whitespace-nowrap">

                                        {item?.name}
                                    </td>


                                    <td className="p-4 ">
                                        {item?.view}
                                    </td>
                                    <td className="p-4 ">
                                        {item?.add}
                                    </td>
                                    <td className="p-4 ">
                                        {item?.edit}
                                    </td>
                                    <td className="p-4 ">
                                        {item?.delete}
                                    </td>
                                    <td className="p-4 ">
                                        {item?.action}
                                    </td>
                                    <td className="p-4 w-[150px]">
                                        <div className="flex items-center gap-2">
                                            <ActionButton
                                                id={item}
                                                setAction={setAddNewRole}
                                                title={"Edit"}
                                                icon={<CiEdit />}
                                                bgColor={"bg-green-500 hover:bg-green-800"}
                                            />
                                            <ActionButton
                                                id={item}
                                                setAction={setDeleteNewRole}
                                                title={"Delete"}
                                                icon={<MdDelete />}
                                                bgColor={"bg-red-500 hover:bg-red-800"}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </>
            }
            <DeleteItem
                deleteItem={deleteNewRole}
                setDeleteItem={setDeleteNewRole}
                handleDeleteItem={handleDelete}
                text="Cash In"
                loading={deleteLoading}
            />
        </div>
    );
}

export default RoleAssignment;

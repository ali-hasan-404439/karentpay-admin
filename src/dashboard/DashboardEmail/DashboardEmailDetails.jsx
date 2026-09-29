import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import { FaLeftLong } from "react-icons/fa6";

function DashboardEmailDetails() {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_HOST}/admin/contacts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmail(response?.data);
    };
    fetchData();
  }, [id]);

  return (
    <div className="text-black dark:text-white p-4 bg-white dark:bg-gray-800 rounded-[4px] boxShadow-table">
      <div className="items-center justify-between block p-4 bg-white dark:bg-gray-800 sm:flex">
        <div className="flex items-center divide-x divide-gray-100 dark:divide-gray-700">
          <div className="pr-3">
            <Link
              to="/email"
              className="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
             <FaLeftLong />
            </Link>
          </div>
          <div className="pl-2  ">
            {moment(email.created_at).format(" DD MMM YYYY,")}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="">
            <div className=" text-gray-900 truncate dark:text-white">
              {email.name}
            </div>
            <div className=" text-gray-800 dark:text-white">{email.email}</div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="  dark:text-white">{email.message}</p>
        </div>
        <div className="my-4">
          <p className="  dark:text-white">
            <span className=" text-gray-900">Phone:</span> {email.phone}
          </p>
          <p className="  dark:text-white">
            <span className=" text-gray-900">Address:</span> {email.address}
          </p>
        </div>
        <div className="w-fit">
          <a
            href={`mailto:${email.email}`}
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 focus:ring-2 p-0  rounded-[4px] w-20"
          >
            <span className="flex items-center rounded-md px-3 py-2 bg-gradient-to-r from-[#395BEF] to-[#5C28D5] w-28">
              <div className="flex items-center gap-x-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 20 20"
                  className="text-xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Reply
              </div>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default DashboardEmailDetails;

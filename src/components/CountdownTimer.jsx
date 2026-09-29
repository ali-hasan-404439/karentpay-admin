import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const CountdownTimer = ({ item, setCashInStatusChange, filteredData }) => {
  if (!item || item.transactionStatus !== "Pending") return null;

  const [countdown, setCountdown] = useState("");
  const [transactionStatus, setTransactionStatus] = useState([]);
  const token = Cookies.get("token");

  useEffect(() => {
    const formData = new FormData();
    formData.append(
      "ids",
      JSON.stringify(filteredData?.map((item) => item.id))
    );

    const getNewMerchantCashInStatus = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_HOST}/admin/merchant/deposits/status`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response?.data?.data;
        setCashInStatusChange(data);
        setTransactionStatus(data);
      } catch (error) {}
    };

    const interval = setInterval(getNewMerchantCashInStatus, 10000);
    getNewMerchantCashInStatus();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if transactionStatus is an array and contains a "Pending" status
    if (
      Array.isArray(transactionStatus) &&
      transactionStatus.some((item) => item.status === "Pending") &&
      item?.created_at
    ) {
      const createdTime = new Date(item.created_at).getTime();
      const endTime = createdTime + 10 * 60 * 1000;

      const updateCountdown = () => {
        const currentTime = Date.now();
        const remainingTime = Math.max(endTime - currentTime, 0);

        if (remainingTime > 0) {
          const minutes = Math.floor(remainingTime / 1000 / 60);
          const seconds = Math.floor((remainingTime / 1000) % 60);
          setCountdown(`${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`);
        } else {
          setCountdown("");
          clearInterval(timerInterval);
        }
      };

      const timerInterval = setInterval(updateCountdown, 1000);
      updateCountdown();

      return () => clearInterval(timerInterval);
    } else {
      setCountdown("");
    }
  }, [transactionStatus, item?.created_at]);

  return (
    <>
      {countdown ? (
        <p
          className="px-2 py-0.5 rounded border border-dotted border-gray-400 flex items-center justify-center cursor-pointer transition-colors duration-200 gap-2 w-20 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium shadow-sm"
          title="Time remaining for transaction"
        >
          {countdown}
        </p>
      ) : (
        <div
          className="w-20 h-6 bg-gray-200 animate-pulse rounded border border-dotted border-gray-400"
          title="Loading..."
        ></div>
      )}
    </>
  );
};

export default CountdownTimer;

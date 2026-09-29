import { FaArrowUpLong } from "react-icons/fa6";

function TransectionCard({ transaction, transactionCount, title, loading }) {
  return (
    <div className="flex flex-col transition-transform duration-300 transform border border-gray-200 rounded cursor-pointer bg-gray-50 hover:scale-105 dark:bg-[#374151] dark:border-[#2b323f]">
      <div className="p-7">
        {loading ? (
          <div>
            {/* Skeleton Loader */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 bg-gray-300 rounded dark:bg-gray-600 w-1/3 animate-pulse"></div>
              <div className="flex items-center">
                <div className="h-6 bg-gray-300 rounded dark:bg-gray-600 w-16 animate-pulse"></div>
                <span className="ml-2 text-sm text-gray-300 dark:text-gray-600 animate-pulse">
                  <FaArrowUpLong />
                </span>
              </div>
            </div>
            <div className="h-6 bg-gray-300 rounded dark:bg-gray-600 mb-4 animate-pulse"></div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <h2 className="mb-2 text-3xl text-slate-800 dark:text-slate-100">
                {transaction ? transaction : 0}
              </h2>
              {transactionCount === "cashInWallet" ? (
                ""
              ) : transactionCount > 10 ? (
                <h2 className="flex items-center mb-2 text-green-600 dark:text-green-600">
                  {transactionCount}
                  <span className="text-sm">
                    <FaArrowUpLong />
                  </span>
                </h2>
              ) : (
                <h2 className="mb-2 text-blue-600 dark:text-blue-600">
                  {transactionCount ? transactionCount : 0}
                </h2>
              )}
            </div>
            <h2 className="mb-2 text-slate-800 dark:text-slate-100">{title}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransectionCard;

import { Outlet } from "react-router-dom";
import MarchantReportsMenubar from "./MarchantReportsMenubar";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

function Reports() {
    const [showManuber, setShowManuber] = useState(false);
    return (
        <div className="flex">
          <div className="w-[280px] h-[calc(100vh-70px)] sticky left-0 top-[70px] z-10 bg-white dark:bg-gray-800 hidden lg:block">
          <MarchantReportsMenubar />
          </div>
  
        <div
          className={`w-full lg:w-full px-5 relative overflow-hidden`}
        >
          {/* For small screens - toggleable sidebar */}
          <div className="block lg:hidden">
              <>
                <div
                  onClick={() => setShowManuber(true)}
                  id="setShowManuber"
                  className={`fixed top-[60px] left-0 lg:left-[240px] z-10 pl-6 pr-3 py-2.5 bg-white dark:bg-gray-800 cursor-pointer text-[#395BEF] shadow-md`}
                  style={{ borderRadius: "0 0 10px 0" }}
                >
                  <FaArrowLeftLong />
                </div>
                {/* Sliding Sidebar */}
                <div
                  className={`fixed top-[60px] left-0 lg:left-[240px] transition-transform duration-300 ease-in-out bg-white z-50 border-r border-gray-200 h-[calc(100vh-65px)] w-[250px] ${showManuber ? "translate-x-0" : "-translate-x-[750px]"}`}
                >
                  <div className="h-full overflow-y-auto">
                    <MarchantReportsMenubar />
                  </div>
                  <div
                    onClick={() => setShowManuber(false)}
                    id="setShowManuber"
                    className="absolute top-0 right-0 z-50 p-2 rounded-full bg-gray-50 cursor-pointer text-[#395BEF]"
                  >
                    <IoMdClose />
                  </div>
                </div>
              </>
  
          </div>
  
          {/* Main content */}
          <div
            className={`flex-1 overflow-x-auto transition-all duration-300 ease-in-out min-h-full bg-white dark:bg-gray-800 dark:text-white`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    );
}

export default Reports;
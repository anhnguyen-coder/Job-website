import { Navbar } from "@/components/customer/navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const CustomerLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="grid grid-cols-[1fr_5fr] h-full w-full overflow-hidden">
        {/* Sidebar / Navbar */}
        <div className="h-full ">
          <Navbar />
        </div>

        {/* Main content */}
        <main className="bg-gray-100 h-full overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;

import { Navbar } from "@/components/customer/navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const CustomerLayout: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* <Navbar /> */}
      <div className="grid grid-cols-[minmax(350px,1fr)_5fr] h-full w-full">
        <div className="">
          <Navbar />
        </div>
        {/* Main content */}
        <main className="bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;

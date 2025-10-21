import { Navbar } from "@/components/customer/navbar";
import React from "react";
import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";

const CustomerLayout: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* <Navbar /> */}
      <div className="grid grid-cols-[minmax(350px,1fr)_5fr] h-full w-full">
        <div className="">
          <Navbar />
        </div>
        {/* Main content */}
        <main className="">
          <Outlet /> {/* nơi các page con được render */}
        </main>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} My App
      </footer>
    </div>
  );
};

export default CustomerLayout;

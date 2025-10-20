import React from "react";
import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";

const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* <Navbar /> */}

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet /> {/* nơi các page con được render */}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 border-t">
        © {new Date().getFullYear()} My App
      </footer>
    </div>
  );
};

export default CustomerLayout;

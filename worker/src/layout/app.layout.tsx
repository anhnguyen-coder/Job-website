import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Navbar } from "@/components/layout/navBar";

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 lg:w-72 bg-white text-slate-800 flex-col border-r border-slate-200 shadow-sm">
        <Navbar />
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-slate-800 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col border-r border-slate-200 shadow-lg ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header cố định */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0 bg-sky-50">
          <h3 className="text-lg font-semibold text-sky-700">Job TingTing</h3>
          <button
            className="text-slate-600 hover:text-slate-800"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Nội dung Navbar có thể cuộn */}
        <div className="flex-1 overflow-y-auto">
          <Navbar />
        </div>
      </div>

      {/* Overlay khi sidebar mở */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        {/* Top bar for mobile */}
        <div className="flex items-center justify-between p-4 bg-white shadow-sm md:hidden sticky top-0 z-30 border-b border-slate-200">
          <button
            className="p-2 rounded-md hover:bg-slate-100"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h2 className="font-semibold text-lg text-sky-700">Job TingTing</h2>
        </div>

        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

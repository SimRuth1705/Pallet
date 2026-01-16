import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom"; // 1. Import Outlet

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Header Toggle */}
      <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
        <button onClick={toggleSidebar} className="focus:outline-none">
          <FaBars size={24} /> {/* Fixed typo: sixe -> size */}
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative z-20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 md:block`}
      >
        <AdminSidebar />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {/* 3. Outlet renders the nested route (Dashboard, Products, etc.) */}
        <Outlet /> 
      </div>
    </div>
  );
}

export default AdminLayout;
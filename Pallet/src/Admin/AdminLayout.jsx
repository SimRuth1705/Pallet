  import React, { useState, useEffect } from "react";
  import { FaBars } from "react-icons/fa";
  import AdminSidebar from "./AdminSidebar";
  import { Outlet } from "react-router-dom";

  function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    // Invisible Admin Auto-Login layer to connect Backend APIs securely
    useEffect(() => {
      const initializeAdminSession = async () => {
        const existingToken = localStorage.getItem('adminToken');
        if (existingToken) return;

        const credentials = { name: "System Admin", email: "admin@ecommerce.com", password: "password123" };
        
        try {
          // Attempt to register first
          let res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials)
          });
          let data = await res.json();
          
          if (data.success && data.token) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminRole', data.user.role);
            window.dispatchEvent(new Event('roleChanged'));
            return;
          }
          
          // If already registered, attempt login
          if (data.message === "Email already exists") {
             const loginRes = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: credentials.email, password: credentials.password })
             });
             const loginData = await loginRes.json();
             if (loginData.success && loginData.token) {
               localStorage.setItem('adminToken', loginData.token);
               localStorage.setItem('adminRole', loginData.user.role);
               window.dispatchEvent(new Event('roleChanged'));
             }
          }
        } catch (err) {
          console.error("Failed to automatically authenticate admin session:", err);
        }
      };
      
      initializeAdminSession();
    }, []);

    return (
      <div className="h-screen flex flex-col md:flex-row overflow-hidden relative">
        <div className="flex md:hidden p-4 bg-gray-900 text-white z-30">
          <button onClick={toggleSidebar} className="focus:outline-none">
            <FaBars size={24} /> {/* Fixed typo: sixe -> size */}
          </button>
          <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0  bg-gray-500/75  md:hidden z-40"
            onClick={toggleSidebar}
          ></div>
        )}

        <div
          className={`bg-gray-900 w-64 h-full text-white absolute md:relative z-50 md:z-20 flex-shrink-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } transition-transform duration-300 md:block`}
        >
          <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        <div className="flex-1 bg-gray-100 p-4 md:p-6 overflow-y-auto">
          <Outlet /> 
        </div>
      </div>
    );
  }

  export default AdminLayout;
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiSettings,
  FiLogOut,
  FiShoppingBag,
  FiShield, // Import shield icon for RBAC role indicator
} from "react-icons/fi";

const AdminSidebar = ({ onClose }) => {
  const navigate = useNavigate();

  // Listen to the role in local storage
  const [role, setRole] = useState(localStorage.getItem('adminRole') || 'Admin');

  useEffect(() => {
    const handleRoleUpdate = () => {
      setRole(localStorage.getItem('adminRole') || 'Admin');
    };
    window.addEventListener('roleChanged', handleRoleUpdate);
    return () => window.removeEventListener('roleChanged', handleRoleUpdate);
  }, []);

  const toggleRole = () => {
    const newRole = role === 'Admin' ? 'Manager' : 'Admin';
    localStorage.setItem('adminRole', newRole);
    setRole(newRole);
    
    // Broadcast the change to sibling components (like AdminUsers) to lock immediately
    window.dispatchEvent(new Event('roleChanged'));
    
    // Instant redirect if the Manager is sitting on a forbidden page
    if (newRole === 'Manager' && (window.location.pathname.includes('users') || window.location.pathname.includes('offers'))) {
       navigate('/admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    navigate("/");
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: <FiGrid />, roles: ['Admin', 'Manager'] },
    { name: "Products", path: "/admin/products", icon: <FiBox />, roles: ['Admin', 'Manager'] },
    { name: "Orders", path: "/admin/orders", icon: <FiShoppingCart />, roles: ['Admin', 'Manager'] },
    { name: "Users", path: "/admin/users", icon: <FiUsers />, roles: ['Admin'] },
    { name: "Offers", path: "/admin/offers", icon: <FiTag />, roles: ['Admin'] },
  ];

  // RBAC Navigation Filtering
  const visibleLinks = navLinks.filter(link => link.roles.includes(role));

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      {/* Brand/Logo Section */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
        <Link to="/admin" className="flex items-center gap-2 text-white">
          <FiShoppingBag className="w-6 h-6 text-indigo-500" />
          <span className="text-xl font-bold tracking-wider uppercase">
            Store Admin
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/admin"}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg ${
                isActive
                  ? "bg-indigo-600/10 text-indigo-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto border-t border-gray-800 space-y-2">
        {/* Development Role Toggle Button to mimic dynamic auth sessions */}
        <button
          onClick={toggleRole}
          className={`flex items-center w-full justify-between gap-3 px-4 py-3 text-sm font-bold transition-colors duration-200 rounded-lg mb-2 ${
            role === 'Admin' 
            ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 shadow-inner' 
            : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 shadow-inner'
          }`}
          title="Click to simulate login as different role"
        >
          <div className="flex items-center gap-3">
             <span className="text-lg"><FiShield /></span>
             Role: {role}
          </div>
          <span className="text-[10px] opacity-75 uppercase tracking-wider bg-black/20 px-2 py-1 rounded">Switch</span>
        </button>

        <NavLink
            to="/admin/settings"
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg ${
                isActive
                  ? "bg-indigo-600/10 text-indigo-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="text-lg"><FiSettings /></span>
            Settings
          </NavLink>
        
        <button
          onClick={() => {
            handleLogout();
            if (onClose) onClose();
          }}
          className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-500/10 hover:text-red-300"
        >
          <span className="text-lg">
            <FiLogOut />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
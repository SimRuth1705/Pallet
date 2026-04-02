import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import MyOrderPage from './MyOrderPage'

function Profile() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await res.json();

        if (result.success) {
          const userData = result.data;
          setRole(userData.role);
          setUser(userData);
          // Sync localStorage
          localStorage.setItem('adminRole', userData.role);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          // If token is invalid or user not found
          handleLogout();
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // Fallback to localStorage if offline or error
        const storedRole = localStorage.getItem('adminRole');
        const storedUser = localStorage.getItem('user');
        if (storedRole) setRole(storedRole);
        if (storedUser) setUser(JSON.parse(storedUser));
      }
    };

    fetchUserData();
    
    // Listen for role changes (local events)
    const handleRoleChange = () => {
      setRole(localStorage.getItem('adminRole'));
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) setUser(JSON.parse(updatedUser));
    };
    window.addEventListener('roleChanged', handleRoleChange);
    return () => window.removeEventListener('roleChanged', handleRoleChange);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-xl rounded-2xl p-8 border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">
              {getInitials(user?.name)}
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{user?.name || "User"}</h1>
            <p className="text-gray-500 font-medium mb-8">{user?.email || "user@example.com"}</p>
            
            <div className="w-full space-y-3">
              {role?.toLowerCase() === 'admin' && (
                <Link 
                  to="/admin" 
                  className="w-full block bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Admin Panel
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-secondary transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
            <MyOrderPage />
          </div>
        </div> 
      </div>
    </div>
  )
}

export default Profile
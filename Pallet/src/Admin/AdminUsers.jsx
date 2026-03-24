import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiUserPlus, FiX, FiShield, FiUser, FiLock } from "react-icons/fi";
import { toast } from "sonner";
import CustomDropdown from "../components/CustomDropdown";

const roles = ["All Roles", "Admin", "Manager", "Customer"];
const statuses = ["All Status", "Active", "Pending", "Suspended"];

const AdminUsers = () => {
  const [roleGuard, setRoleGuard] = useState(localStorage.getItem('adminRole') || 'Admin');

  useEffect(() => {
    const handleRoleUpdate = () => setRoleGuard(localStorage.getItem('adminRole') || 'Admin');
    window.addEventListener('roleChanged', handleRoleUpdate);
    return () => window.removeEventListener('roleChanged', handleRoleUpdate);
  }, []);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Customer", status: "Active" });

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      toast.error('Server error while fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All Roles" || u.role === selectedRole;
    const matchesStatus = selectedStatus === "All Status" || u.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          toast.success('User removed successfully');
          setUsers(users.filter(u => u._id !== id));
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleInvite = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "Customer", status: "Pending" });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      if (editingUser) {
        // Update user
        const res = await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          toast.success('User updated successfully');
          setIsModalOpen(false);
          fetchUsers();
        } else {
          toast.error(data.message);
        }
      } else {
        // Invite/Create User via auth register
        const res = await fetch(`http://localhost:5000/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            password: 'TempPassword123!' // default temp password
          })
        });
        const data = await res.json();
        if (data.success) {
          toast.success('User invited. Temp password: TempPassword123!');
          setIsModalOpen(false);
          fetchUsers();
          
          // Note: Since auth/register auto-assigns roles based on count, 
          // we should ideally update the role/status immediately after creation if needed.
          // For a robust system, a dedicated Admin POST /api/users endpoint would be better.
          if (formData.role !== 'Customer' || formData.status !== 'Active') {
             await fetch(`http://localhost:5000/api/users/${data.user.id}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
               body: JSON.stringify({ role: formData.role, status: formData.status })
             });
             fetchUsers();
          }
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  if (roleGuard !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center space-y-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-rose-50 border border-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mb-2 shadow-sm">
           <FiLock className="w-8 h-8"/>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Access Restricted</h2>
        <p className="text-gray-500 max-w-sm leading-relaxed">Your current role (<span className="font-bold text-gray-700">{roleGuard}</span>) does not have permission to view or modify User data. Please contact a System Administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform access, roles, and user accounts.</p>
        </div>
        <button onClick={handleInvite} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-indigo-500/30">
          <FiUserPlus className="w-5 h-5" />
          Invite User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto z-20">
          <div className="w-full sm:w-48">
             <CustomDropdown options={roles} value={selectedRole} onChange={setSelectedRole} />
          </div>
          <div className="w-full sm:w-48">
             <CustomDropdown options={statuses} value={selectedStatus} onChange={setSelectedStatus} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative z-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden border border-gray-200 bg-gradient-to-tr from-indigo-100 to-purple-50 flex items-center justify-center text-indigo-500 font-bold text-lg uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       {user.role === "Admin" ? <FiShield className="text-indigo-500 w-4 h-4" /> : <FiUser className="text-gray-400 w-4 h-4" />}
                       <span className={`text-sm font-medium ${user.role === "Admin" ? "text-indigo-700" : "text-gray-700"}`}>{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "Active" ? "bg-green-100 text-green-800" :
                      user.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors" title="Edit User">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors" title="Remove User">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="bg-gray-50 rounded-full p-4 mb-3"><FiSearch className="h-6 w-6 text-gray-400" /></div>
              <h3 className="text-sm font-medium text-gray-900">No users found</h3>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay and Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editingUser ? "Edit User Access" : "Invite New User"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2"><FiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required disabled={!!editingUser} type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <CustomDropdown options={roles.slice(1)} value={formData.role} onChange={(val) => setFormData({...formData, role: val})} className="z-[60]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                  <CustomDropdown options={statuses.slice(1)} value={formData.status} onChange={(val) => setFormData({...formData, status: val})} className="z-[50]" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6 !mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">{editingUser ? "Save Changes" : "Send Invite"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

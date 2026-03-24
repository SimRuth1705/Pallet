import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiX, FiTag, FiClock, FiCheckCircle, FiAlertCircle, FiLock } from "react-icons/fi";
import { toast } from "sonner";
import CustomDropdown from "../components/CustomDropdown";

const statuses = ["All Status", "Active", "Scheduled", "Expired"];
const discountTypes = ["Percentage", "Fixed Amount"];

const AdminOffers = () => {
  const [roleGuard, setRoleGuard] = useState(localStorage.getItem('adminRole') || 'Admin');

  useEffect(() => {
    const handleRoleUpdate = () => setRoleGuard(localStorage.getItem('adminRole') || 'Admin');
    window.addEventListener('roleChanged', handleRoleUpdate);
    return () => window.removeEventListener('roleChanged', handleRoleUpdate);
  }, []);

  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({ 
    code: "", 
    discountType: "Percentage", 
    discountValue: "", 
    minPurchase: "", 
    usageLimit: "", 
    status: "Active", 
    expiryDate: "" 
  });

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/offers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOffers(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch offers');
      }
    } catch (err) {
      toast.error('Server error while fetching offers');
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const filteredOffers = offers.filter((o) => {
    const matchesSearch = o.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All Status" || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer code? Customers will no longer be able to use it.")) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`http://localhost:5000/api/offers/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          toast.success('Offer deleted successfully');
          setOffers(offers.filter(o => o._id !== id));
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error('Failed to delete offer');
      }
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      code: offer.code,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      minPurchase: offer.minPurchase,
      usageLimit: offer.usageLimit,
      status: offer.status,
      // Format date for simple text input
      expiryDate: new Date(offer.expiryDate).toISOString().split('T')[0] 
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingOffer(null);
    setFormData({ code: "", discountType: "Percentage", discountValue: "", minPurchase: "0", usageLimit: "100", status: "Active", expiryDate: "" });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editingOffer 
      ? `http://localhost:5000/api/offers/${editingOffer._id}`
      : `http://localhost:5000/api/offers`;
    const method = editingOffer ? 'PUT' : 'POST';

    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minPurchase: Number(formData.minPurchase),
        usageLimit: Number(formData.usageLimit)
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(editingOffer ? 'Offer updated successfully' : 'Offer created successfully');
        setIsModalOpen(false);
        fetchOffers();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to save offer');
    }
  };

  if (roleGuard !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center space-y-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-rose-50 border border-rose-100 text-rose-500 rounded-3xl flex items-center justify-center mb-2 shadow-sm">
           <FiLock className="w-8 h-8"/>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Access Restricted</h2>
        <p className="text-gray-500 max-w-sm leading-relaxed">Your current role (<span className="font-bold text-gray-700">{roleGuard}</span>) does not have permission to create or view Promotional Offers. Please contact a System Administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Offers & Promotions</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage discount codes for your customers.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-indigo-500/30">
          <FiPlus className="w-5 h-5" />
          Create Offer
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
            placeholder="Search offer codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto z-20">
          <div className="w-full sm:w-48">
             <CustomDropdown options={statuses} value={selectedStatus} onChange={setSelectedStatus} />
          </div>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative z-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredOffers.map((offer) => (
                <tr key={offer._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-xl overflow-hidden border border-indigo-100 bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <FiTag className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900 tracking-wide uppercase">{offer.code}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          Min purchase: ${offer.minPurchase}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md inline-block border border-emerald-100">
                      {offer.discountType === "Percentage" ? `${offer.discountValue}% OFF` : `$${offer.discountValue} OFF`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{offer.usageCount} / {offer.usageLimit}</div>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                        <div 
                           className={`h-full rounded-full ${offer.usageCount >= offer.usageLimit ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                           style={{ width: `${Math.min((offer.usageCount / (offer.usageLimit || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full ${
                      offer.status === "Active" ? "bg-green-100 text-green-800" :
                      offer.status === "Scheduled" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {offer.status === "Active" ? <FiCheckCircle className="w-3 h-3" /> : 
                       offer.status === "Scheduled" ? <FiClock className="w-3 h-3" /> : <FiAlertCircle className="w-3 h-3" />}
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-medium">
                      {new Date(offer.expiryDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric'})}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(offer)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors" title="Edit Offer">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(offer._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors" title="Remove Offer">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOffers.length === 0 && (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="bg-gray-50 rounded-full p-4 mb-3"><FiSearch className="h-6 w-6 text-gray-400" /></div>
              <h3 className="text-sm font-medium text-gray-900">No offers found</h3>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay and Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{editingOffer ? "Edit Offer Code" : "Create New Offer"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 bg-gray-50 rounded-full transition-colors"><FiX className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 text-left max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Offer Code</label>
                <input required type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER24" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase font-bold text-gray-900" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="z-[60]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <CustomDropdown options={discountTypes} value={formData.discountType} onChange={(val) => setFormData({...formData, discountType: val})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 sm:text-sm font-medium">{formData.discountType === "Percentage" ? "%" : "$"}</span>
                    </div>
                    <input required type="number" min="0" value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Purchase ($)</label>
                  <input required type="number" min="0" value={formData.minPurchase} onChange={(e) => setFormData({...formData, minPurchase: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                  <input required type="number" min="1" value={formData.usageLimit} onChange={(e) => setFormData({...formData, usageLimit: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="z-[50]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <CustomDropdown options={statuses.slice(1)} value={formData.status} onChange={(val) => setFormData({...formData, status: val})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input required type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6 !mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">{editingOffer ? "Save Changes" : "Create Offer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffers;

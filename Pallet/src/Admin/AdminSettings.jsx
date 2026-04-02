import React, { useState, useEffect } from "react";
import { 
  FiSave, 
  FiGlobe, 
  FiDollarSign, 
  FiMail, 
  FiPhone, 
  FiImage, 
  FiShield, 
  FiRefreshCw, 
  FiSettings,
  FiTruck,
  FiPercent
} from "react-icons/fi";
import { toast } from "sonner";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    currency: "USD",
    taxRate: 0,
    shippingFee: 0,
    logoUrl: "",
    maintenanceMode: false
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings updated successfully");
        setSettings(data.data);
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiRefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <FiSettings className="text-indigo-600" />
            Store Settings
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your global store configuration and preferences.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
        >
          {saving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* General Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
            <FiGlobe className="text-blue-500" />
            General Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                placeholder="Enter store name"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Support Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="support@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Support Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="supportPhone"
                    value={settings.supportPhone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Financials Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
            <FiDollarSign className="text-emerald-500" />
            Pricing & Financials
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="INR">INR - Indian Rupee (₹)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <FiPercent className="w-3 h-3" /> Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  step="0.01"
                  value={settings.taxRate}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <FiTruck className="w-3 h-3" /> Shipping Fee
                </label>
                <input
                  type="number"
                  name="shippingFee"
                  step="0.01"
                  value={settings.shippingFee}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Branding & Appearance Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
            <FiImage className="text-purple-500" />
            Branding & Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Store Logo URL</label>
              <div className="relative">
                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="logoUrl"
                  value={settings.logoUrl}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Store Logo Preview" className="max-h-12 object-contain" />
              ) : (
                <span className="text-gray-400 text-sm">No logo URL provided</span>
              )}
            </div>
          </div>
        </div>

        {/* Security & Maintenance Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
            <FiShield className="text-rose-500" />
            Security & System
          </h2>
          
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
              <div>
                <p className="font-bold text-rose-900 text-sm">Maintenance Mode</p>
                <p className="text-rose-700 text-xs mt-0.5">Disable customer-facing store features.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-rose-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
               <p className="text-xs text-blue-700 font-medium leading-relaxed">
                 <strong className="block mb-1">Information:</strong>
                 These settings are applied globally and will affect both the customer storefront and administrative calculations like tax and shipping.
               </p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;

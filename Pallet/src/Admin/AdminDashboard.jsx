import React, { useState, useEffect } from "react";
import { FiDollarSign, FiShoppingCart, FiUsers, FiActivity, FiArrowUpRight, FiArrowDownRight, FiBox, FiClock, FiStar, FiMoreHorizontal, FiDownload, FiFileText } from "react-icons/fi";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: "$0.00",
      activeOrders: 0,
      newUsers: 0,
      engagementRate: "0%"
    },
    topProducts: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // RBAC Redirection for Managers
  useEffect(() => {
    const role = localStorage.getItem('adminRole');
    if (role === 'Manager') {
      toast.info('Managers are redirected to Product Management');
      navigate('/admin/products');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          setDashboardData(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch dashboard statistics');
        }
      } catch (err) {
        toast.error('Server error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleExportData = () => {
    try {
      // 1. Prepare data rows
      const stats = dashboardData.stats;
      const products = dashboardData.topProducts;
      
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Type,Category/Metric,Value/Sales,Revenue\n";
      csvContent += `Stat,Total Revenue,${stats.totalRevenue}, \n`;
      csvContent += `Stat,Active Orders,${stats.activeOrders}, \n`;
      csvContent += `Stat,New Users,${stats.newUsers}, \n`;
      csvContent += `Stat,Engagement Rate,${stats.engagementRate}, \n`;
      
      products.forEach(p => {
        csvContent += `Product,${p.name},${p.sales},${p.revenue}\n`;
      });

      // 2. Trigger Download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `dashboard_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Data exported successfully as CSV");
    } catch (err) {
      toast.error("Failed to export data");
    }
  };

  const handleCreateReport = () => {
    // Basic printer trigger with custom styles applied via @media print in CSS
    window.print();
  };

  // Map API stats to the UI card format with static sparklines/trends for visual effect
  const statCards = [
    { title: "Total Revenue", value: dashboardData.stats.totalRevenue, icon: <FiDollarSign className="w-5 h-5" />, trend: "+14.5%", isPositive: true, color: "text-indigo-600", bg: "bg-indigo-50", sparkline: "M0,30 Q10,10 20,25 T40,15 T60,25 T80,5 T100,20" },
    { title: "Active Orders", value: dashboardData.stats.activeOrders.toString(), icon: <FiShoppingCart className="w-5 h-5" />, trend: "+8.2%", isPositive: true, color: "text-emerald-600", bg: "bg-emerald-50", sparkline: "M0,20 Q10,30 20,15 T40,25 T60,10 T80,20 T100,5" },
    { title: "Engagement Rate", value: dashboardData.stats.engagementRate, icon: <FiActivity className="w-5 h-5" />, trend: "-3.1%", isPositive: false, color: "text-amber-600", bg: "bg-amber-50", sparkline: "M0,5 Q10,25 20,10 T40,30 T60,15 T80,25 T100,10" },
    { title: "New Customers", value: dashboardData.stats.newUsers.toString(), icon: <FiUsers className="w-5 h-5" />, trend: "+18.7%", isPositive: true, color: "text-blue-600", bg: "bg-blue-50", sparkline: "M0,25 Q10,5 20,20 T40,10 T60,25 T80,15 T100,5" },
  ];

  // Helper to get the correct icon for recent activity based on the API 'type' field
  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return <FiShoppingCart />;
      case 'user': return <FiUsers />;
      default: return <FiActivity />;
    }
  };

  const calculateTimeAgo = (dateInput) => {
    const date = new Date(dateInput);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${Math.max(mins, 1)} mins ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hrs ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className={`space-y-6 relative pb-10 ${loading ? 'opacity-50 pointer-events-none' : 'animate-in fade-in slide-in-from-bottom-4 duration-500'}`}>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Live metrics perfectly synched with your platform.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors shadow-sm text-sm"
          >
            <FiDownload className="w-4 h-4" />
            Export Data
          </button>
          <button 
            onClick={handleCreateReport}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200 text-sm"
          >
            <FiFileText className="w-4 h-4" />
            Create Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative overflow-hidden group hover:border-indigo-100 hover:shadow-md transition-all">
            
            {/* Background Sparkline SVG */}
            <svg className="absolute bottom-0 inset-x-0 w-full h-16 opacity-10 group-hover:opacity-20 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d={stat.sparkline} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={stat.color} />
              <path d={`${stat.sparkline} L100,30 L0,30 Z`} fill="currentColor" stroke="none" className={stat.color} />
            </svg>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stat.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                {stat.isPositive ? <FiArrowUpRight className="w-3 h-3" /> : <FiArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            
            <div className="relative z-10">
              <div className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
              <h3 className="text-gray-500 text-sm font-medium mt-1">{stat.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Curved Area Chart Component */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Revenue Analytics</h2>
              <p className="text-xs text-gray-500 mt-0.5">Monthly store performance</p>
            </div>
            <select className="bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
              <option>Year 2024</option>
              <option>Year 2023</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[300px] relative mt-4">
             {/* Y-Axis Labels & Grid Lines */}
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 z-0">
               {[100, 75, 50, 25, 0].map((val, i) => (
                 <div key={i} className="flex items-center w-full relative">
                    <span className="text-xs text-gray-400 font-medium absolute -left-1 w-8 text-right bg-white pr-2 z-10">${val}k</span>
                    <div className="w-full border-b border-gray-100 border-dashed ml-8"></div>
                 </div>
               ))}
             </div>
             
             {/* Dynamic SVG Area Chart */}
             <div className="absolute inset-0 ml-8 pb-8 z-10">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* The curve itself */}
                  <path 
                    d="M0,80 C10,60 20,70 30,40 C40,10 50,30 60,20 C70,10 80,40 90,15 C95,5 100,10 100,10" 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="drop-shadow-md"
                  />
                  
                  {/* The filled gradient area */}
                  <path 
                    d="M0,80 C10,60 20,70 30,40 C40,10 50,30 60,20 C70,10 80,40 90,15 C95,5 100,10 100,10 L100,100 L0,100 Z" 
                    fill="url(#chartGradient)" 
                  />
                  
                  {/* Data Points */}
                  <circle cx="30" cy="40" r="1.5" fill="white" stroke="#4f46e5" strokeWidth="1" className="hover:r-2 hover:stroke-2 transition-all cursor-pointer" />
                  <circle cx="60" cy="20" r="1.5" fill="white" stroke="#4f46e5" strokeWidth="1" className="hover:r-2 hover:stroke-2 transition-all cursor-pointer" />
                  <circle cx="90" cy="15" r="1.5" fill="white" stroke="#4f46e5" strokeWidth="1" className="hover:r-2 hover:stroke-2 transition-all cursor-pointer" />
                </svg>
             </div>

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 inset-x-0 ml-8 flex justify-between text-[11px] text-gray-400 font-bold uppercase pt-2">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Action Center & Logs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-gray-900 tracking-tight">Live Platform Activity</h2>
             <button className="text-gray-400 hover:text-gray-600 transition-colors"><FiMoreHorizontal className="w-5 h-5"/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
            {dashboardData.recentActivity.length > 0 ? dashboardData.recentActivity.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4 relative">
                {/* Vertical tracking line */}
                {idx !== dashboardData.recentActivity.length - 1 && (
                  <div className="absolute top-10 left-[18px] -ml-px h-full w-0.5 bg-gray-100"></div>
                )}
                
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${activity.bg} ${activity.color} ring-4 ring-white z-10`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 pt-0.5">
                  <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 truncate pr-2">{activity.desc}</p>
                  <p className="text-xs text-gray-400 mt-1.5 font-medium flex items-center gap-1"><FiClock className="w-3 h-3"/> {calculateTimeAgo(activity.time)}</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50 rounded-xl border border-dashed my-auto">
                 <p className="text-sm text-gray-500 font-medium">No recent activity detected.</p>
                 <p className="text-xs text-gray-400 mt-1">Check back once customers interact.</p>
              </div>
            )}
          </div>
          
          <button className="w-full mt-6 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
             View Complete Logs
          </button>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Top Selling Live Products</h2>
            <Link to="/admin/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View Catalog &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sales</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {dashboardData.topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                         <FiBox className="w-5 h-5"/>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">ID: #{product.id.toString().substring(0,6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-600">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">{product.sales}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-emerald-600">{product.revenue}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                      product.stock === "In Stock" ? "bg-green-50 text-green-700" :
                      product.stock === "Low Stock" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
              {dashboardData.topProducts.length === 0 && !loading && (
                 <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-sm font-medium text-gray-500 bg-gray-50/50 border-dashed border-t">No sales data available to calculate top selling products yet.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;

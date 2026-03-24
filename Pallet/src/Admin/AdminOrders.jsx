import React, { useState, useEffect } from "react";
import { FiSearch, FiEye, FiTrash2, FiX, FiPackage, FiShoppingBag, FiTruck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "sonner";
import CustomDropdown from "../components/CustomDropdown";

const statuses = ["All Status", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-emerald-100 text-emerald-800";
    case "Processing": return "bg-blue-100 text-blue-800";
    case "Shipped": return "bg-purple-100 text-purple-800";
    case "Cancelled": return "bg-rose-100 text-rose-800";
    default: return "bg-amber-100 text-amber-800"; // Pending
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Delivered": return <FiCheckCircle className="w-4 h-4 text-emerald-500" />;
    case "Processing": return <FiPackage className="w-4 h-4 text-blue-500" />;
    case "Shipped": return <FiTruck className="w-4 h-4 text-purple-500" />;
    case "Cancelled": return <FiXCircle className="w-4 h-4 text-rose-500" />;
    default: return <FiShoppingBag className="w-4 h-4 text-amber-500" />; // Pending
  }
};

const getPaymentColor = (payment) => {
  switch (payment) {
    case "Paid": return "text-emerald-700 bg-emerald-50 ring-emerald-600/20";
    case "Refunded": return "text-rose-700 bg-rose-50 ring-rose-600/20";
    default: return "text-amber-700 bg-amber-50 ring-amber-600/20"; // Pending
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      toast.error('Server error while fetching orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All Status" || o.orderStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to completely delete this order?`)) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          toast.success('Order deleted successfully');
          setOrders(orders.filter(o => o._id !== id));
          if (viewingOrder?._id === id) setIsModalOpen(false);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error('Failed to delete order');
      }
    }
  };

  const handleView = (order) => {
    setViewingOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/orders/${viewingOrder._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(orders.map(o => o._id === viewingOrder._id ? { ...o, orderStatus: newStatus } : o));
        setViewingOrder({ ...viewingOrder, orderStatus: newStatus });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track, process, and manage customer orders.</p>
        </div>
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
            placeholder="Search by Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48 z-20">
            <CustomDropdown options={statuses} value={selectedStatus} onChange={setSelectedStatus} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative z-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-indigo-600 cursor-pointer hover:underline" onClick={() => handleView(order)}>
                      #{order._id.toString().substring(0, 8)}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{order.items ? order.items.length : 0} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs uppercase">
                        {order.customerName ? order.customerName.charAt(0) : 'C'}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${getPaymentColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       {getStatusIcon(order.orderStatus)}
                       <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                         {order.orderStatus}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleView(order)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors" title="View Order Details">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(order._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors" title="Delete Order">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="bg-gray-50 rounded-full p-4 mb-3"><FiSearch className="h-6 w-6 text-gray-400" /></div>
              <h3 className="text-sm font-medium text-gray-900">No orders found</h3>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal Overlay */}
      {isModalOpen && viewingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Order Details 
                  <span className="text-indigo-600">#{viewingOrder._id.toString().substring(0, 8)}</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">Placed on {new Date(viewingOrder.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 bg-gray-50 rounded-full transition-colors"><FiX className="w-5 h-5" /></button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8 text-left">
              
              {/* Order Status Controller */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-1">Current Status</h4>
                  <div className="flex items-center gap-2">
                      {getStatusIcon(viewingOrder.orderStatus)}
                      <span className={`px-2.5 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(viewingOrder.orderStatus)}`}>
                        {viewingOrder.orderStatus}
                      </span>
                  </div>
                </div>
                <div className="w-full sm:w-48 z-[60]">
                   <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Update Status To</label>
                   <CustomDropdown 
                      options={statuses.slice(1)} 
                      value={viewingOrder.orderStatus} 
                      onChange={handleUpdateStatus} 
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">Customer Information</h4>
                  <div className="space-y-3">
                    <p className="text-sm"><span className="text-gray-500 w-20 inline-block">Name:</span> <span className="font-medium text-gray-900">{viewingOrder.customerName}</span></p>
                    <p className="text-sm"><span className="text-gray-500 w-20 inline-block">Email:</span> <span className="font-medium text-gray-900">{viewingOrder.customerEmail}</span></p>
                    <p className="text-sm"><span className="text-gray-500 w-20 inline-block">Phone:</span> <span className="font-medium text-gray-900">N/A</span></p>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">Payment Information</h4>
                  <div className="space-y-3">
                    <p className="text-sm flex items-center"><span className="text-gray-500 w-24 inline-block">Status:</span> 
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ring-inset ${getPaymentColor(viewingOrder.paymentStatus)}`}>
                        {viewingOrder.paymentStatus}
                      </span>
                    </p>
                    <p className="text-sm"><span className="text-gray-500 w-24 inline-block">Method:</span> <span className="font-medium text-gray-900">{viewingOrder.paymentMethod}</span></p>
                    <p className="text-sm"><span className="text-gray-500 w-24 inline-block">Total Amount:</span> <span className="font-bold text-gray-900">${viewingOrder.totalAmount.toFixed(2)}</span></p>
                  </div>
                </div>
              </div>

              {/* Items Placeholder */}
              <div>
                 <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">Order Items ({viewingOrder.items ? viewingOrder.items.length : 0})</h4>
                 <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-3 text-sm text-gray-500">
                    {viewingOrder.items && viewingOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="flex gap-4">
                           <span>Qty: {item.quantity}</span>
                           <span className="font-bold">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                    {(!viewingOrder.items || viewingOrder.items.length === 0) && (
                      <div className="text-center py-4 border border-dashed rounded-lg">No items listed.</div>
                    )}
                 </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 shrink-0 flex justify-between items-center bg-gray-50 rounded-b-2xl">
              <button onClick={() => handleDelete(viewingOrder._id)} className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2">
                <FiTrash2 /> Delete Order
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

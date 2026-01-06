import React from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/checkout");
    onClose();
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Sidebar Drawer */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col overflow-x-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        
        {/* 1. Header (Fixed at Top) */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-none">
          <h2 className="text-2xl font-bold text-[#9CAFAA]">Your Cart ({cart.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <FiX size={24} className="text-gray-600" />
          </button>
        </div>

        {/* 2. Cart Items (Scrollable Middle) */}
        {/* overflow-y-auto enables vertical scroll. overflow-x-hidden kills horizontal scroll. */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg">Your cart is empty.</p>
              <p className="text-sm">Start shopping to add items!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex gap-4 border-b border-gray-100 pb-4">
                
                {/* Image */}
                <div className="w-20 h-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                {/* CRITICAL FIX: 'min-w-0' is required here for truncate to work in a flex container */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#9CAFAA] truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      Size: {item.size} | Color: {item.color}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-semibold text-[#333]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="flex-none flex flex-col justify-between items-end">
                  <span className="font-bold text-lg text-[#9CAFAA]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-xs text-[#D6A99D] hover:text-red-600 flex items-center gap-1 transition"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 3. Footer (Fixed at Bottom) */}
        <div className="bg-[#FBF3D5] p-6 border-t border-gray-100 flex-none">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Subtotal</span>
            <span className="text-xl font-bold text-[#9CAFAA]">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-4 text-center">
            Shipping and taxes calculated at checkout.
          </p>
          <button onClick={handleCheckout} className="w-full bg-[#9CAFAA] text-white py-3 rounded-full font-bold hover:bg-[#D6A99D] transition-colors shadow-lg">
            Checkout Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default CartSidebar;
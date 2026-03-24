import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaypalButton from "../context/PaypalButton";

function Checkout() {
  const navigate = useNavigate();

  // --- FIX 1: DEFINE MOCK CART DATA HERE ---
  // (Later, you will replace this with: const { cart } = useShopContext(); )
  const cart = {
    products: [
      {
        name: "Test Product",
        size: "M",
        color: "Blue",
        price: 50,
        image: "https://via.placeholder.com/150",
      },
      {
        name: "Test Product 2",
        size: "L",
        color: "Red",
        price: 50,
        image: "https://via.placeholder.com/150",
      },
    ],
    totalPrize: 100,
  };
  // ----------------------------------------

  const [Checkoutid, setCheckoutid] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    pincode: "",
    city: "",
    country: "",
    phone: "",
  });

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    setCheckoutid("mock-checkout-id-12345");
  };

  const handlePaymentSuccess = (details) => {
    alert("Payment Successful! Transaction ID: " + details.id);
    navigate("/order-confirmation");
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 font-sans px-6 tracking-tighter">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl uppercase mb-6">Checkout</h1>
          <form onSubmit={handleCreateCheckout}>
            <h3 className="text-lg mb-4"> Contact Details </h3>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border rounded-md p-2"
                value="user@gmial.com"
                disabled
              />
            </div>
            <h3 className="mb-4 text-lg">Delivery</h3>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Firstname</label>
                <input
                  type="text"
                  value={shippingAddress.firstname}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      firstname: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Lastname</label>
                <input
                  type="text"
                  value={shippingAddress.lastname}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      lastname: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    address: e.target.value,
                  })
                }
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Pincode</label>
                <input
                  type="number"
                  value={shippingAddress.pincode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      pincode: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="number"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phone: e.target.value,
                  })
                }
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div className="mt-6">
              {!Checkoutid ? (
                <button
                  type="submit"
                  className="bg-gray-600 text-white w-full px-4 py-2 rounded-md"
                >
                  Place Order
                </button>
              ) : (
                <div>
                  <h3 className="text-lg mb-4">Pay With Paypal</h3>
                  <PaypalButton
                    amount={cart.totalPrize}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => alert("Payment Failed")}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg mb-4">Order Summary</h3>
          <div className="border-t py-4 mb-4">
            {/* FIX 2: Use lowercase 'cart' here */}
            {cart.products.map((product, index) => (
              <div
                key={index}
                className="flex justify-between mb-4 items-start py-2 border-b"
              >
                <div className="flex items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-24 object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-md">{product.name}</h3>
                    <p className="text-gray-500">Size: {product.size}</p>
                    <p className="text-gray-500">Color: {product.color}</p>
                  </div>
                </div>
                {/* FIX 3: Corrected toLocaleString() typo */}
                <p className="text-xl">${product.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-lg mb-4">
            <p>SubTotal</p>
            <p>${cart.totalPrize?.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center text-lg">
            <p>Shipping</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between items-center text-lg mt-4 border-t p-4">
            <p>Total</p>
            <p>${cart.totalPrize?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
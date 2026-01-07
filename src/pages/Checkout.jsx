import React from "react";
import { useState } from "react";
import PaypalButton from "../context/PaypalButton";

function Checkout() {
  const navigate = useNavigate();
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
    alert("Payment Successful!", details);
    navigate("/order-confirmation");
  }

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
                  type="text"
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
                type="text"
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
                    amount={100}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) => alert("Payment Failed")}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Checkout;

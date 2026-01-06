import React from "react";
import { useState } from "react";

function Checkout() {
  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    pincode: "",
    city: "",
    country: "",
    phone: "",
  });

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 font-sans px-6 tracking-tighter">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl uppercase mb-6">Checkout</h1>
          <form>
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
            </div><div className="mb-4">
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
            <div className="mt-6"></div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Checkout;

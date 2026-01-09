import React, { useState,useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function OrderDetailsPage() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const mockOrderDetails = {
      _id: id,
      createdAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: "PayPal",
      shippingMethod: "Standard",
      shippingAddress: {
        city: "New York",
        country: "USA",
      },
      orderItems: [
        {
          productid: "1",
          name: "jacket",
          price: 100,
          quantity: 2,
          image: "https://placehold.co/150",
        },
        {
          productid: "2",
          name: "jacket",
          price: 100,
          quantity: 2,
          image: "https://placehold.co/150",
        },
      ],
    };
    setOrderDetails(mockOrderDetails);
  }, [id]);

 
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
      {!orderDetails ? (
        <p>No order present</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border">
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <h3 className="text-lg md:text-xl font-semibold">
              Order Id : #{orderDetails._id}
            </h3>
            <p className="text-gray-600">
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <span
              className={`${
                orderDetails.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              } px-3 py-1 rounded-full text-sm font-medium mb-2 `}
            >
              {orderDetails.isPaid ? "Approved" : "Pending"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p>payment Method  : {orderDetails.paymentMethod}</p>
              <p>Status { orderDetails.isPaid ? "Paid" : "Unpaid" } </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p>Shipping Method  : {orderDetails.shippingMethod}</p>
              <p>
                Address : {""}
            {`${orderDetails.shippingAddress.city},${orderDetails.shippingAddress.country}`}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <table className="min-w-full text-gray-600 mb-4">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Unit Price</th>
                        <th className="py-2 px-4">Quantity</th>
                        <th className="py-2 px-4">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.orderItems.map((items) => (
                        <tr key={items.productid} className="border-b" >
                            <td className="py-2 px-4 flex items-center">
                                <img src={items.image} alt={items.name} className="w-12 h-12 object-cover rounded-lg mr-4 "  />
                                <Link to={`/product/${items.productid}`} className="text-blue-500 hover:underline" >{items.name}</Link>
                            </td>
                            <td className="py-2 px-4">${items.price}</td>
                            <td className="py-2 px-4">{items.quantity}</td>
                            <td className="py-2 px-4">${items.price * items.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
          <Link to="/my-orders" className="text-blue-500 hover:underline " > Back to my Orders </Link>
        </div>
      )}
    </div>
  );
}

export default OrderDetailsPage;

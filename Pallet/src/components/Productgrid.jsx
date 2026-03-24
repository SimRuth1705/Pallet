import React from "react";
import { useNavigate } from "react-router-dom";

const Productgrid = ({ Products }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        
        {Products && Products.length > 0 ? (
          Products.map((product) => (
            <div 
              key={product._id} 
              onClick={() => navigate(`/product/${product._id}`)}
              className="group cursor-pointer"
            >
              <div className="w-full h-auto overflow-hidden rounded-lg mb-2 bg-gray-100 relative">
                {/* Handle Image Structure safely */}
                <img
                  src={product.images && product.images.length > 0 ? product.images[0].url : "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-full object-cover object-center hover:scale-110 transition duration-300"
                />
              </div>

              <h3 className="text-sm font-medium text-gray-700 truncate">
                {product.name}
              </h3>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                ${product.price}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
              No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Productgrid;
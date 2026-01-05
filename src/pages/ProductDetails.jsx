import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { getAllProducts } from "../assets/fakeData";

const ProductDetails = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const { productId } = useParams(); 
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const allProducts = getAllProducts();
    setBestSellers(allProducts.slice(0, 5));
  }, []);

  useEffect(() => {
    const fetchProduct = () => {
      const allItems = getAllProducts();
      let foundItem;

      if (productId) {
        foundItem = allItems.find(item => String(item._id) === String(productId));
      } else {
        const randomIndex = Math.floor(Math.random() * allItems.length);
        foundItem = allItems[randomIndex];
      }

      if (foundItem) {
        const standardProduct = {
            ...foundItem,
            price: Number(foundItem.price),
            description: foundItem.description || `This is a premium quality ${foundItem.name}.`,
            colors: foundItem.colors || [],
            sizes: foundItem.sizes || ["S", "M", "L", "XL"],
            details: foundItem.details || { Brand: "Fashion", Material: "Cotton", Fit: "Regular" }
        };

        setProduct(standardProduct);
        if (standardProduct.colors.length > 0) setSelectedColor(standardProduct.colors[0]);
        if (standardProduct.sizes.length > 0) setSelectedSize(standardProduct.sizes[0]);
        
        const related = allItems
            .filter(item => item._id !== standardProduct._id) 
            .slice(5, 10); 
        setRelatedProducts(related);
        
        setLoading(false);
      } else {
        toast.error("Product not found");
        setLoading(false);
      }
    };

    if (productId) window.scrollTo(0, 0); 
    
    setLoading(true);
    setTimeout(fetchProduct, 300); 
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    const imageToSend = product.image || (product.images && product.images.length > 0 ? product.images[0].url : "");

    addToCart(
        { ...product, image: imageToSend }, 
        quantity, 
        selectedColor || "Standard", 
        selectedSize || "M"
    );
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  const handleQuantity = (type) => {
    if (type === "inc") setQuantity(quantity + 1);
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
  };
  
  const handleRelatedClick = (id) => {
      navigate(`/product/${id}`);
      window.scrollTo(0,0);
  };

  if (loading) return <div className="py-20 text-center text-xl text-gray-500">Loading Product...</div>;
  if (!product) return <div className="py-20 text-center text-red-500">Product Not Found</div>;

  return (
    <div className="bg-white border-b border-gray-300 pb-4 mb-4">
      
      <section className="py-10 md:py-20 border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            
            <div className="w-full md:w-1/2 relative group">
              <div className="rounded-xl shadow-lg overflow-hidden h-[400px] md:h-[600px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
              </div>
            </div>

            <div className="w-full md:w-1/2 text-left space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-xl md:text-2xl text-[#D6A99D] font-bold">
                ${product.price}
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                    <p className="font-bold mb-3 text-primary">Size: {selectedSize}</p>
                    <div className="flex gap-3">
                    {product.sizes.map((size) => (
                        <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 border rounded-md flex items-center justify-center font-bold transition-all ${
                            selectedSize === size
                            ? "bg-primary text-white border-primary"
                            : "border-gray-300 text-gray-600 hover:border-primary"
                        }`}
                        >
                        {size}
                        </button>
                    ))}
                    </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-b border-gray-100 pb-8">
                <div className="flex items-center border border-gray-300 rounded-md w-max">
                  <button onClick={() => handleQuantity("dec")} className="px-4 py-3 hover:bg-gray-100">-</button>
                  <span className="px-4 font-bold">{quantity}</span>
                  <button onClick={() => handleQuantity("inc")} className="px-4 py-3 hover:bg-gray-100">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white py-3 px-8 rounded-md font-bold hover:bg-[#D6A99D] transition-all shadow-lg uppercase tracking-wider"
                >
                  Add to Cart
                </button>
              </div>

              <div className="mt-4">
                <ul className="space-y-3 text-gray-600 text-sm">
                    {product.details && Object.entries(product.details).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span className="font-semibold text-gray-800">{key}: </span> {value}
                    </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FBF3D5]">
        <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-primary">You May Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-[1000px] mx-auto">
                {relatedProducts.map((item) => (
                <div 
                    key={item._id} 
                    onClick={() => handleRelatedClick(item._id)} 
                    className="cursor-pointer group bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition"
                >
                    <div className="h-48 md:h-64 w-full overflow-hidden rounded-lg mb-3">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                        <p className="text-[#D6A99D] font-bold text-sm">${item.price}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Sellers</h2>
            <p className="text-gray-500">Our most popular products based on sales.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {bestSellers.map((item) => (
              <div 
                key={item._id} 
                onClick={() => handleProductClick(item._id)} 
                className="cursor-pointer group bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-transparent hover:border-gray-100"
              >
                <div className="h-48 md:h-64 w-full overflow-hidden rounded-lg mb-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="px-1">
                  <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                  <p className="text-[#D6A99D] font-bold text-sm mt-1">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

    </div>
  );
};

export default ProductDetails;
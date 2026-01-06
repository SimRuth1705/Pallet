import { HiShoppingBag } from "react-icons/hi";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { Link } from "react-router-dom";

const FeaturedCollection = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-15">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row bg-[#e8f5e9] rounded-3xl overflow-hidden shadow-sm">
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <p className="text-gray-600 text-sm uppercase font-medium mb-2">
            Comfort and Style
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Apparel made for your everyday life
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Discover high-quality, comfortable clothing that effortlessly blends
            fashion and function. Designed to make you look and feel great every
            day.
          </p>
          <div>
            <Link to="/Collections/:collection" className="inline-block bg-black text-white font-medium py-3 px-8 rounded-full hover:bg-gray-800 transition transform hover:-translate-y-1">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-72 md:h-96 lg:h-auto relative order-first lg:order-last">
          <img
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Apparel made for your everyday life"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex items-center justify-around max-w-7xl mx-auto flex-wrap gap-8">
        <div className="flex flex-col items-center text-center mt-5 md:mt-10 space-y-4">
          <HiShoppingBag className="text-2xl text-gray-300" />
          <h4 className="tracking-tighter mb-2">FREE INTERNATIONAL SHIPPING</h4>
          <p className="tracking-tighter text-sm text-gray-600" >On all orders over $100</p>
        </div>
        <div className="flex flex-col items-center text-center mt-5 md:mt-10 space-y-4">
          <HiArrowPathRoundedSquare  className="text-2xl text-gray-300" />
          <h4 className="tracking-tighter mb-2">45 DAYS RETURN</h4>
          <p className="tracking-tighter text-sm text-gray-600">Money Back Guarantee</p>
        </div>
        <div className="flex flex-col items-center text-center mt-5 md:mt-10 space-y-4">
          <HiOutlineCreditCard className="text-2xl text-gray-300" />
          <h4 className="tracking-tighter mb-2">SECURE CHECKOUT</h4>
          <p className="tracking-tighter text-sm text-gray-600">100% Secure Checkout Process</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;

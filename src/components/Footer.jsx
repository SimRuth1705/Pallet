import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-10">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <h3 className="text-xl font-bold mb-4">ShopName.</h3>
            <p className="text-white/80 text-sm">
              Your one-stop destination for fashion, style, and elegance. 
              We bring the latest trends directly to your doorstep.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><Link to="/women" className="hover:text-white hover:underline transition">Women</Link></li>
              <li><Link to="/men" className="hover:text-white hover:underline transition">Men</Link></li>
              <li><Link to="/kids" className="hover:text-white hover:underline transition">Kids</Link></li>
              <li><Link to="/sale" className="hover:text-white hover:underline transition">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><Link to="/contact" className="hover:text-white hover:underline transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white hover:underline transition">FAQ</Link></li>
              <li><Link to="/returns" className="hover:text-white hover:underline transition">Returns Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-white hover:underline transition">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Stay in the Loop</h4>
            <p className="text-white/80 text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="p-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:border-white placeholder-white/50"
              />
              <button className="bg-white text-primary py-2 px-4 rounded font-bold hover:bg-gray-100 transition shadow-lg">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} ShopName. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <SocialIcon icon={<FaFacebook />} />
            <SocialIcon icon={<FaInstagram />} />
            <SocialIcon icon={<FaTwitter />} />
            <SocialIcon icon={<FaLinkedin />} />
          </div>
        </div>
        
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="text-white/80 hover:text-white text-xl transition transform hover:scale-110">
    {icon}
  </a>
);

export default Footer;
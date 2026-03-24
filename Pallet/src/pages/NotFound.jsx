import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-light/20 text-center p-4">
      
      <h1 className="text-9xl font-extrabold text-primary tracking-widest">
        404
      </h1>

      <div className="bg-secondary px-4 py-2 text-sm rounded rotate-12 absolute text-white shadow-lg">
        Page Not Found
      </div>
      
      <p className="text-2xl font-semibold text-primary/80 mt-10 mb-6">
        Oops! The page you’re looking for doesn't exist.
      </p>

      <Link 
        to="/" 
        className="px-6 py-3 border border-primary text-lg font-medium rounded-lg text-primary hover:bg-primary hover:text-white transition duration-300 shadow-md hover:shadow-xl"
      >
        Go Home
      </Link>
      
    </div>
  );
}

export default NotFound;
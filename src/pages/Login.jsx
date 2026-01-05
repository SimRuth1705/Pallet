import React, { useState } from "react";
import { Link } from "react-router-dom";
import login from "../assets/logo1.png"

function Login() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");


  const handlesubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { Name, Email, Password });
  }
  return (
    <section>
      <div className="flex">
        <div className="w-full md:w-1/2 flex-col flex justify-center items-center p-8 mg:p-12">
          <form
            onSubmit={handlesubmit}
            className="w-full max-w-md bg-white p-8 rounded-lg  border-white border-2 shadow-sm"
          >
            <div className="flex justify-center mb-6">
              <h2 className="font-brand text-6xl text-primary ">pallet</h2>
            </div>

            <h1 className="text-2xl font-bold text-center mb-6">Hi There!</h1>
            <p className="text-center mb-6">
              Enter Your Username and Password To Login
            </p>
            <div className="mb-4">
              <label htmlFor="" className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border-gray-300 border-2   rounded-lg"
                placeholder="Enter Your Email"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="" className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border-gray-300 border-2 rounded-lg"
                placeholder="Enter Your Password"
                required
              />
            </div>
            <button
              type="submit"
              className="flex-1 bg-[#9CAFAA] w-full text-white py-3 px-8 rounded-md font-bold hover:bg-[#D6A99D] transition-all shadow-lg uppercase tracking-wider"
            >
              Sign Up
            </button>
            <p className="mt-6 text-center text-sm">
              Don't Have An Account{" "}
              <Link to="/Register" className="text-blue-500">
                Register
              </Link>{" "}
            </p>
          </form>
        </div>
      
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img src={login} alt="Login To Account" className="h-[750px] w-full object-cover"/>
        </div>
      </div></div>
    </section>
  );
}

export default Login;

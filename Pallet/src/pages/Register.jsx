import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from "../assets/logo1.png";

function Register() {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: Name, email: Email, password: Password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminRole", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Broadcast the change to sibling components
        window.dispatchEvent(new Event('roleChanged'));
        
        navigate("/profile");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
              Enter User name and Password to Register
            </p>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="" className="block text-sm font-semibold mb-2">
                Name
              </label>
              <input
                type="text  "
                value={Name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border-gray-300 border-2   rounded-lg"
                placeholder="Enter Your Name"
                required
              />
            </div>
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
              disabled={isLoading}
              className={`flex-1 bg-primary w-full text-white py-3 px-8 rounded-md font-bold hover:bg-secondary transition-all shadow-lg uppercase tracking-wider ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
            <p className="mt-6 text-center text-sm">
              Already Have An Account{" "}
              <Link to="/Login" className="text-blue-500">
                Login
              </Link>{" "}
            </p>
          </form>
        </div>

        <div className="hidden md:block w-1/2 bg-gray-800">
          <div className="h-full flex flex-col justify-center items-center">
            <img
              src={login}
              alt="Login To Account"
              className="h-[750px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;

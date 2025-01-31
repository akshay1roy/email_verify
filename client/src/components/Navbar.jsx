import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-4 sm:px-24 absolute top-0 left-0">
      {/* Logo */}
      <img src={assets.logo} alt="Company Logo" className="w-20 sm:w-28" />

      {/* Login Button */}
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 border border-blue-500 rounded-full px-6 py-2 text-gray-800 
                         hover:bg-blue-500 hover:text-white hover:border-blue-500 
                         transition-all duration-300 transform hover:scale-105 cursor-pointer"
      >
        Login
        <img src={assets.arrow_icon} alt="Arrow Icon" className="w-4 h-4" />
      </button>
    </div>
  );
};

import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export const Navbar = () => {
  const navigate = useNavigate();
  const {
    userData,
    backendUrl,
    // isLoggedin,
    setIsLoggedin,
    setUserData,
    // getUserData,
  } = useContext(AppContext);

  const sendVerificationOtp=async()=>{
    try {
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(backendUrl+'/api/auth/send-verify-otp')

      if(data.success)
      {

         navigate('/email-verify');
         toast.success(data.message);

      }else{
        toast.error(data.message);
      }


    } catch (error) {
      toast.error(error.message)
    }
  }

  // console.log(userData);

  const logout=async()=>{
    try {
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate('/');
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-4 sm:px-24 absolute top-0 left-0">
      {/* Logo */}
      <img src={assets.logo} alt="Company Logo" className="w-20 sm:w-28" />

      {/* Login Button */}
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
          {" "}
          {userData.name[0].toUpperCase()}
          <div className="min-w-max absolute opacity-0 invisible scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100 top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none mx-4 p-2 bg-gray-100 text-sm w-full">
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className="py-2 px-3 hover:bg-indigo-100 cursor-pointer flex items-center">
                  <img src={assets.mail_icon} className="mr-2" alt="" /> Verify
                  email
                </li>
              )}
              <hr className="border-gray-200" />

              <li onClick={logout} className="py-2 px-3 hover:bg-indigo-100 cursor-pointer flex items-center">
                <img className="w-3 mr-2" src={assets.logout} alt="" /> Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-blue-500 rounded-full px-6 py-2 text-gray-800 
                         hover:bg-blue-500 hover:text-white hover:border-blue-500 
                         transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow Icon" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

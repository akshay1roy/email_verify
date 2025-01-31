import { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");

  const navigate=useNavigate();

  const [name,setName]=useState();
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();


  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-100 to bg-purple-200">
      <img
      onClick={()=>navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-100 text-sm ">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account !"}
        </p>

        <form>
          {state == "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#343b61]">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none"
                onChange={e=>setName(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#343b61]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email id"
              required
              className="bg-transparent outline-none"
              onChange={e=>setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#343b61]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none"
              onChange={e=>setPassword(e.target.value)}
            />
          </div>

          <p onClick={()=>navigate('/reset-password')} className="mb-4 text-indigo-400 cursor-pointer">
            Forgot Password?
          </p>
          <button className="rounded-full w-full py-2.5 bg-gradient-to-r from-indigo-500 to bg-indigo-800 text-white font-medium cursor-pointer hover:opacity-85 transition-all duration-200 ">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4 ">
            Already have an account ?{" "}
            <span onClick={()=>setState('Login')} className="text-blue-400 cursor-pointer underline">
              Login here
            </span>{" "}
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4 ">
            Don't have an account?{" "}
            <span onClick={()=>setState('Sign Up')} className="text-blue-400 cursor-pointer underline">
              Sign up
            </span>{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

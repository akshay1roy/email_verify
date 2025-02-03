import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { data, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Sign Up");

  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin , getUserData} = useContext(AppContext);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onsubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          toast.success("Register successfully ");
          setIsLoggedin(true);
          getUserData()
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          toast.success("Login successfully ");
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-100 to bg-purple-200">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute rounded-xl left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer mix-blend-multiply"
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

        <form onSubmit={onsubmitHandler}>
          {state == "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#343b61]">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none"
                onChange={(e) => setName(e.target.value)}
                autocomplete="name"
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
              onChange={(e) => setEmail(e.target.value)}
               autocomplete="email"
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#343b61]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none"
              onChange={(e) => setPassword(e.target.value)}
              autocomplete={state === "Sign Up" ? "new-password" : "current-password"}
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-400 cursor-pointer"
          >
            Forgot Password?
          </p>
          <button className="rounded-full w-full py-2.5 bg-gradient-to-r from-indigo-500 to bg-indigo-800 text-white font-medium cursor-pointer hover:opacity-85 transition-all duration-200 ">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4 ">
            Already have an account ?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>{" "}
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4 ">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign up
            </span>{" "}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

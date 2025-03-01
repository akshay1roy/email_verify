import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();

  const {backendUrl }=useContext(AppContext)

  axios.defaults.withCredentials=true;


  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEmailSend, setIsEmailSend] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setOtpSubmited] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Prevent default paste behavior
    const paste = e.clipboardData.getData("text"); // Get clipboard text
    const pasteArray = paste.split(""); // Convert text to array of characters

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char; // Assign character to input field
      }
    });
  };

  const onSubmitEmail=async(e)=>{
    e.preventDefault();

    try {
      const {data}= await axios.post(backendUrl+'/api/auth/send-reset-otp',{email});
      // console.log(email,data);
      if(data.success)
      {
        toast.success(data.message);
      }else {
        toast.error(data.message);
      }

      data.success && setIsEmailSend(true);
    } catch (error) {
      toast.error(error.message)
    }
  }


  const onSubmitOtp=async(e)=>{
    e.preventDefault();
    const otpArray= inputRefs.current.map(e=>e.value);
    setOtp(otpArray.join(''));
    setOtpSubmited(true);
    console.log(otpArray);
  }

  const onsubmitNewPassword= async (e)=>{
      e.preventDefault();

      try {
        // console.log(email,otp,newPassword);

        const {data}= await axios.post(backendUrl+'/api/auth/reset-password',{email,otp,newPassword})

        if(data.success)
        {
          toast.success(data.message);
          navigate('/login');
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
  }




  return (
    <div className="flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-100 to bg-purple-200">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute rounded-xl left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer mix-blend-multiply"
      />

      {/*  enter email send */}

      {!isEmailSend && (
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your register Email Address
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" className="w-5 h-5" />
            <input
              type="email"
              placeholder="Email Id"
              className="rounded-full w-full p-1 outline-none bg-transparent text-white placeholder-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-b from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer hover:opacity-80">
            submit
          </button>
        </form>
      )}

      {/*  otp input form */}

      {!isOtpSubmited && isEmailSend && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Rest password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code send to your email id
          </p>

          <div className="flex justify-between mb-8 " onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5c] text-white text-center text-xl rounded-md"
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer hover:opacity-80">
            Submit
          </button>
        </form>
      )}

      {/*  enter new password  */}

      {isOtpSubmited && isEmailSend && (
        <form onSubmit={onsubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Enter new password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" className="w-5 h-5" />
            <input
              type="password"
              placeholder="Enter new password"
              className="rounded-full w-full p-1 outline-none bg-transparent text-white placeholder-gray-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-b from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer hover:opacity-80">
            submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

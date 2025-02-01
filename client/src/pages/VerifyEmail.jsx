import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const {
    userData,
    backendUrl,
    isLoggedin,
    // setIsLoggedin,
    // setUserData,
    getUserData,
  } = useContext(AppContext);

  axios.defaults.withCredentials=true;


  const navigate = useNavigate();

  const inputRefs=useRef([])

  const handleInput=(e,index)=>{
      if(e.target.value.length> 0 && index< inputRefs.current.length-1 )
      {
          inputRefs.current[index+1].focus();
      }
  }

  const handleKeyDown=(e,index)=>{
      if(e.key==='Backspace' && e.target.value==='' && index>0)
      {
         inputRefs.current[index-1].focus();
      }

  }

  useEffect(()=>{

    isLoggedin && userData && userData.isAccountVerified && navigate('/')

  },[isLoggedin , userData])

  const handlePaste = (e) => {
    e.preventDefault(); // Prevent default paste behavior
    const paste = e.clipboardData.getData('text'); // Get clipboard text
    const pasteArray = paste.split(''); // Convert text to array of characters

    pasteArray.forEach((char, index) => {
        if (inputRefs.current[index]) { 
            inputRefs.current[index].value = char; // Assign character to input field
        }
    });
};

const onSubmitHandler=async(e)=>{
    try {
      e.preventDefault();
      const otpArray= inputRefs.current.map(e=>e.value)
      const otp=otpArray.join('')

      const {data}=await axios.post(backendUrl+ '/api/auth/verify-account',{otp})
      if(data.success)
      {
        toast.success('Account successfully verified')
        await getUserData();
        navigate('/');
      }else{
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

      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code send to your email id
        </p>

        <div className="flex justify-between mb-8 " onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
              ref={e=>inputRefs.current[index]=e}
              onInput={(e)=> handleInput(e,index)}
              onKeyDown={(e)=>handleKeyDown(e,index)}
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5c] text-white text-center text-xl rounded-md"
              />
            ))}
        </div>
        <button  className="w-full py-3 bg-gradient-to-b from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer hover:opacity-80">Verify email</button>
      </form>
    </div>
  );
};

export default VerifyEmail;

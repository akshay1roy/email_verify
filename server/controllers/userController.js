

import userModel from "../models/userModel.js";

export const getUserData=async(req,res)=>{
    try {
        const {userId}=req.body;
        // console.log("userId",userId);
        const user= await userModel.findById(userId);
        // consold.log(user.name,user.email);

        if(!user)
        {
            return res.json({success:false, message:"User not found"})
        }

        res.json({success:true, userData:{
            name:user.name,
            isAccountVerified:user.isAccountVerified,

        }})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
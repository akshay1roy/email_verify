import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';



export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' })
    }


    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: 'User already exits' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword })

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_EVN === 'production',
            sameSite: process.env.NODE_EVN === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        console.log("Email", email);

        //  TO SEND EMAIL
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'welcome to Akshayweb',
            text: `welcome to Akshayweb website . Your account has been created with email id: ${email}`
        }

        try {
            // Await email sending and log success
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        } catch (error) {
            // Log error if email fails to send
            console.error('Error sending email:', error);
        }

        // await transporter.sendMail(mailOptions).catch(err=>console.error('email sending failed'))

        return res.json({ success: true, message: user })


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required ' })
    }


    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invlid email' })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' })
        }



        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_EVN === 'production',
            sameSite: process.env.NODE_EVN === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // console.log("token Login ",token);

        return res.json({ success: true, message: { user, token } })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}


export const logout = async (req, res) => {
    try {
        console.log("Logout",res.cookie.token)
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_EVN === 'production',
            sameSite: process.env.NODE_EVN === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "logged out" })
    } catch (error) {

    }
}


// send OTP to user's Email 
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);
        // console.log(user);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account Already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification Otp',
            text: `Your OTP is ${otp} . Verify your account using this OTP.`
        }

        await transporter.sendMail(mailOption)

        res.json({ success: true, message: "verification OTP send on your Email" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details' })
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invlaid OTP" })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' })
        }

        user.isAccountVerified = true;

        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Email verifed Successfully' })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}


// check if user is authenticated 
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}



// send  Password Rest otp 

export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" })
    }

    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }


        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Otp',
            text: `Your OTP for resetting your password is ${otp} . Use this OTP to proceed with resetting your password.`
        }

        await transporter.sendMail(mailOption)

        return res.json({ success: true, message: 'OTP send to your email' })

    } catch (error) {

    }
}


// Reset User  Password
export const resetPassword = async (req, res) => {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email , OTP and new Password are required ' })
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.resetOtp == "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: 'Password has changed Successfully' });



    } catch (error) {
        return res.json({ success: false, message: error.message })
    }


}



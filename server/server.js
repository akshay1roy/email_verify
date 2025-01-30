import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API Endpoints
app.get('/', (req, res) => {
    res.send("API is working");
});


console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS);
console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);



// console.log("SMTP_USER:", process.env.SMTP_USER);
// console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Loaded" : "Not Loaded");


// Set up auth routes

app.use('/api/auth', authRouter);


app.listen(port, () => {
    console.log(`Server is started on ${port}`);
});

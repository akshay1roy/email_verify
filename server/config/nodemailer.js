import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    host:'smtp-relay.brevo.com',
    // service:"gmail",
    port: 587,
    secure: false,
    auth: {
        // user: process.env.SMTP_USER,
        // pass: process.env.SMTP_PASS

        user:"8482a5002@smtp-brevo.com",                 // this is running 
        pass:"K9VsvB8y2g5EfU46",


        // user:"akshaykumar880466@gmail.com",
        // pass:"K9VsvB8y2g5EfU46",         -> brevo password

        // pass:"dvkbvcncwblfdqsk"       // for app password 
    }
})

export default transporter;
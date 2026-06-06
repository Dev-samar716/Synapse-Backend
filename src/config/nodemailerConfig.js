import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "samardevworks@gmail.com", 
        pass: process.env.APP_PASSWORD
    }
})

export default transporter;
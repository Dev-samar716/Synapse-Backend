import generateOtp from "../../../utils/otp.js";
import transporter from "../../../config/nodemailerConfig.js";
import pool from "../../../config/db.js"

const sendOtp = async(req, res) => {
    const { email } = req.body;
    const Otp_Cooldown = 60 * 1000;

    try {
        const existingOtp = await pool.query("SELECT * FROM email_otp WHERE email = $1", [email]);
        const now = Date.now();

        if(existingOtp.rows.length > 0) {
            if(now - existingOtp.rows[0].created_at < Otp_Cooldown) {
                return res.status(429).json({ success: false, message: "Please wait before requesting a new OTP!" });
            } 
        }
    } catch(error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error processing OTP request!" });
    }
    const otp_code = generateOtp();
    const created_at = Date.now();
   const expires_at = created_at + 5 * 60 * 1000; // OTP valid for 5 minutes

   const mailOptions = {
            from: "samardevworks@gmail.com",
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp_code}. It will expire in 5 minutes.`
        }

    try {
      const storeOtp = await pool.query(`INSERT INTO email_otp (email, otp_code, created_at, expires_at) VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE SET 
        otp_code = EXCLUDED.otp_code, 
        created_at = EXCLUDED.created_at, 
        expires_at = EXCLUDED.expires_at`, 
        [email, otp_code, created_at, expires_at]);

        transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, message: "OTP sent successfully!" });
    } catch(error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
}

export default sendOtp
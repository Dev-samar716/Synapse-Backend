import pool from "../../../config/db.js";

const verifyOtp = async(req, res) => {
    const { email, otp_code } = req.body;

    try {
        const verifiedOtp = await pool.query(`SELECT * FROM email_otp WHERE email = $1 AND otp_code = $2
            AND expires_at > $3`, [email, otp_code, Date.now()]);

        if(verifiedOtp.rows.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        } else {
            return res.status(200).json({ success: true, message: "OTP verified successfully!" });
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to verify OTP!" });
    }
}

export default verifyOtp;
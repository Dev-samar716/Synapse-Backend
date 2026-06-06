import jwt from 'jsonwebtoken';
import pool from '../../../config/db.js';

const verifyToken = async(req, res) => {
    const token = req.cookies.token;
    let user_id;

    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Token doesn't exist!"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user_id = Number(decoded);
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Invalid token!"
        })
    }

    try {
        const user = await pool.query("SELECT * FROM users WHERE id=$1", [user_id]);

        res.status(200).json({
            success: true,
            userInfo: {
                username: user.rows[0].username,
                email: user.rows[0].email,
                password: user.rows[0].password
            }
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to find an user account with the decoded id!"
        })
    }
}

export default verifyToken
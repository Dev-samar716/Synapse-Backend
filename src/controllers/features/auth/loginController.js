import pool from "../../../config/db.js";
import bcrypt from "bcrypt";
import generateToken from "../../../utils/generateToken.js";

const logIn = async(req, res) => {
    const { username, password, email } = req.body;

    try {
        const user_email = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

        if(user_email.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email!"
            })
        }
        const user = await pool.query("SELECT * FROM users WHERE username=$1", [username]);

        if(user.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username!"
            })
        }

        const isPasswordValid = bcrypt.compare(password, user.rows[0].password);

        if(!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password!"
            })
        }

        const token = generateToken(user.rows[0].id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: false,
            secure: 'lax'
        })

        res.status(201).json({
            success: true,
            userInfo: {
                username: user.rows[0].username,
                email: user.rows[0].email,
                id: user.rows[0].id
            }
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server faced internal error while trying to log in!"
        })
    }
}

export default logIn;
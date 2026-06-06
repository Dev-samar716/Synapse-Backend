import pool from "../../../config/db.js";
import generateToken from "../../../utils/generateToken.js";
import bcrypt from 'bcrypt'

const signUp = async(req, res) => {
    const { username, email, password } = req.body;

    try { 
        
      const existingUser = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = bcrypt.hash(password, 10);

        const registeredUser = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", 
            [username, email, hashedPassword]);

        const token = generateToken(registeredUser.rows[0].id);

        res.cookie("token", token, {
    httpOnly: true,
    // On Render it will be true, on local machine it will be false
    secure: process.env.NODE_ENV === "production", 
    // On Render it will be 'none', on local machine it will be 'lax'
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
});

        res.status(201).json({
            success: true,
            userInfo: {
                id: registeredUser.rows[0].id,
                username: registeredUser.rows[0].username,
                email: registeredUser.rows[0].email
            }
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'server faced internal error while registering user!'
        })
    }
}

export default signUp
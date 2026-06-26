import pool from "../../../config/db.js"
import jwt from "jsonwebtoken"

const returnConversations = async(req, res) => {
     const token = req.cookies.token;
     console.log(token)
     let user_id;

     if(!token) {
      return res.status(401).json({
        success: false,
        message: 'The user is not authorized!'
      })
     }

     try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user_id = Number(decoded)
      
      if(!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token!'
        })
      }
     } catch(error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Failed to verify user!"
        })
     }

     try {
      const get_conversations_query = "SELECT * FROM conversations WHERE user_id=$1"
      const conversations = await pool.query(get_conversations_query, [user_id]);

      return res.status(200).json({
        success: true,
        conversations: conversations.rows
      })
     } catch(error) {
         console.log(error);
         return res.status(500).json({
            success: false,
            message: "Failed to retrieve all the conversation history from DB!"
         })
     }
}

export default returnConversations;
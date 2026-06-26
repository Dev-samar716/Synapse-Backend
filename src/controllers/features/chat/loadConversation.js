import pool from "../../../config/db.js";
import userIdentityVerification from "../../../functions/userIdentityVerification.js";

const loadConversation = async(req, res) => {
     const currentConversationId = req.params.id;
     const token = req.cookies.token;

     let user_id;
     
          if(!token) {
           return res.status(401).json({
             success: false,
             message: 'The user is not authorized!'
           })
          }
     
          try {
            user_id = userIdentityVerification(token);

            if(!user_id) {
              return res.status(401).json({
               success: false,
               message: 'Invalid token!'
             })
            }
          } catch(error) {
             console.log(error);
             res.status(500).json({
               success: false,
               message: "Failed to verify user!"
             })
          }
     

     try {
        const select_conversation_query = "SELECT * FROM conversations WHERE id=$1 AND user_id=$2"
        const conversation = await pool.query(select_conversation_query , [currentConversationId, user_id]);
    
        if(conversation.rows.length === 0) return res.status(400).json({
            success: false,
            message: "No conversation with the provided credentials exist!"
        })
        const select_messages_query = "SELECT * FROM messages WHERE conversation_id=$1"
        const messagesResult = await pool.query(select_messages_query, [conversation.rows[0].id]);

        console.log(messagesResult.rows)

         res.status(201).json({
            success: true,
            messagesResult: messagesResult.rows
         })
     } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to load conversation!"
        })
     }
}

export default loadConversation;
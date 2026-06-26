import pool from "../config/db.js"

const createConversation = async(title, user_id) => {
     try {
        const insert_query = "INSERT INTO conversations (created_at, user_id, title) VALUES ($1, $2, $3) RETURNING *"
        const createdConversation = await pool.query(insert_query, [Date.now(), user_id, title]);

        return createdConversation.rows[0]
     } catch(error) {
        console.log(error); 
        return null
     }
}

export default createConversation;
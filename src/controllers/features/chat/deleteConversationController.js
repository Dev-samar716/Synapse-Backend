import pool from "../../../config/db.js";

const deleteConversation = async(req, res) => {
    const conversationId = req.params.id;
    
    if(!conversationId) {
        return res.status(400).json({
            success: false,
            message: "Invalid conversation id!"
        })
    } 

    try {
        await pool.query("DELETE FROM conversations WHERE id=$1", [conversationId]);

        res.status(200).json({
            success: true,
            message: "Conversation successfully deleted!"
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: error
        })
    }
}

export default deleteConversation;
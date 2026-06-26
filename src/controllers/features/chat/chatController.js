import systemInstruction from "../../../utils/systemPrompt.js";
import callGroqAPI from "../../../functions/callGroqAPI.js";
import incrementMessageLimit from "../../../functions/incrementMessageLimit.js";
import checkMessageLimit from "../../../functions/checkMessageLimit.js";
import generateTitleAPI from "../../../functions/generateTitleAPI.js";
import pool from "../../../config/db.js";
import createConversation from '../../../functions/createConversation.js';
import jwt from 'jsonwebtoken';

const chatController = async (req, res) => {
    const { contents, currentConversationId } = req.body;
    const token = req.cookies.token;
    let conversation_id;

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
                 res.status(500).json({
                   success: false,
                   message: "Failed to verify user!"
                 })
              }

    const userMessageLimit = await checkMessageLimit(user_id);

    if(!userMessageLimit) {
        return res.status(429).json({
            success: false,
            message: "Message limit reached! Please wait for 24 hours before sending more messages."
        })
    }

    await incrementMessageLimit(user_id);
    
    const { systemPrompt, titleSystemInstructions } = systemInstruction(); 

    try {
        const data = await callGroqAPI(systemPrompt, contents);

        if(!currentConversationId) {
            const createdConversation = await createConversation("New Chat", user_id);
            conversation_id = createdConversation.id
            generateTitleAPI(titleSystemInstructions, contents).then(async(generateTitle) => {
                await pool.query('UPDATE conversations SET title=$1 WHERE id=$2', [generateTitle, conversation_id])

                console.log("Successfully updated title in DB!")
            }).catch(error => console.log("Failed to update title in DB!")) 
        } else {
          conversation_id = currentConversationId;
        }
        const latestUserObj = contents.findLast(item => item.role === "user");
        const userMessage = latestUserObj.parts[0].text;

        const insertUserMessage = pool.query(
        'INSERT INTO messages (created_at, conversation_id, role, content) VALUES ($1, $2, $3, $4)',
        [Date.now(), conversation_id, 'user', userMessage]
    );

    const modelMessage = data.candidates[0].content.parts[0].text;

    const insertModelMessage = pool.query(
        'INSERT INTO messages (created_at, conversation_id, role, content) VALUES ($1, $2, $3, $4)',
        [Date.now(), conversation_id, 'model', modelMessage]
    );

        res.status(201).json({
            success: true,
            data: data,    
            conversationId: conversation_id   
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Web server faced internal error while trying to communicate with LLM!"
        });
    }
};

export default chatController;
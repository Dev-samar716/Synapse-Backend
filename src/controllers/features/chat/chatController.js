import systemInstruction from "../../../utils/systemPrompt.js";
import callGroqAPI from "../../..../../../functions/callGroqAPI.js";
import incrementMessageLimit from "../../../routers/features/chat/incrementMessageLimit.js";
import checkMessageLimit from "../../../routers/features/chat/checkMessageLimit.js";

const chatController = async (req, res) => {
    const { contents, user_id } = req.body;

    const userMessageLimit = await checkMessageLimit(user_id);

    if(!userMessageLimit) {
        return res.status(429).json({
            success: false,
            message: "Message limit reached! Please wait for 24 hours before sending more messages."
        })
    }

    await incrementMessageLimit(user_id);
    
    const systemPrompt = systemInstruction(); 

    try {
        const data = await callGroqAPI(systemPrompt, contents);
        
        console.log("LLM response:", data);

        res.status(201).json({
            success: true,
            data: data,          
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
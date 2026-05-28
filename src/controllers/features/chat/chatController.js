import systemInstruction from "../../../utils/systemPrompt.js";
import callGroqAPI from "../../..../../../functions/callGroqAPI.js";

const chatController = async (req, res) => {
    const { contents } = req.body;
    
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
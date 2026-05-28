import systemInstruction from "../../../utils/systemPrompt.js";
import callGeminiAPI from "../../../functions/callGemini.js";

const chatController = async(req, res) => {
    const { contents } = req.body;
    console.log(contents);
    const systemPrompt = systemInstruction(); 

    try {
        const data = await callGeminiAPI(systemPrompt, contents);
        console.log("LLM response:", data);

        res.status(201).json({
            success: true,
            data: data,
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Web server faced internal error while trying to communicate with LLM server!"
        })
    }
}

export default chatController;
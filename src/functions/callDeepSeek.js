

const callDeepSeekAPI = async (systemPrompt, contents) => {
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    const url = "https://api.deepseek.com/v1/chat/completions";

    // Convert your Gemini-style contents to OpenAI format
    const messages = [];

    if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
    }

    contents.forEach(item => {
        if (item.parts && item.parts[0]?.text) {
            messages.push({
                role: item.role === "model" ? "assistant" : "user",
                content: item.parts[0].text
            });
        }
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-v4-flash",   
                messages: messages,
                max_tokens: 4000,
                temperature: 0.8,
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("DeepSeek Error:", data.error?.message || data);
            throw new Error(data.error?.message || "DeepSeek API call failed");
        }

        return {
            candidates: [{
                content: {
                    role: "model",
                    parts: [{ 
                        text: data.choices[0].message.content 
                    }]
                }
            }]
        };

    } catch (error) {
        console.error("Error calling DeepSeek:", error);
        throw error;
    }
};

export default callDeepSeekAPI;
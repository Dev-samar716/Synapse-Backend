

const callGroqAPI = async (systemPrompt, contents) => {
    const API_KEY = process.env.GROQ_API_KEY.trim();
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const messages = [];

    if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
    }

    contents.forEach(item => {
        if (item.parts?.[0]?.text) {
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
                model: "llama-3.3-70b-versatile", 
                messages: messages,
                max_tokens: 1200,
                temperature: 0.8,
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq Error:", data.error?.message || data);
            throw new Error(data.error?.message || "Groq API failed");
        }

        // Same structure as before
        return {
            candidates: [{
                content: {
                    role: "model",
                    parts: [{ text: data.choices[0].message.content }]
                }
            }]
        };

    } catch (error) {
        console.error("Error calling Groq:", error);
        throw error;
    }
};

export default callGroqAPI;
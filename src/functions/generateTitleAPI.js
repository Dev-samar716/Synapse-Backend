

const generateTitleAPI = async(titleSystemInstructions, contents) => {
    const API_KEY = process.env.GROQ_API_KEY.trim();
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const messages = []

    if (titleSystemInstructions) {
        messages.push({ role: "system", content: titleSystemInstructions });
    }

    messages.push({
        role: "user", 
        content: contents[0].parts[0].text
    })

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", 
                messages: messages,
                max_tokens: 8,
                temperature: 0.8,
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq Error:", data.error?.message || data);
            throw new Error(data.error?.message || "Groq API failed");
        }

        return data.choices[0].message.content.trim();

    } catch(error) {
       console.log(error);
       throw error;
    }
    
}

export default generateTitleAPI
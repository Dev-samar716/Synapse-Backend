

const callGeminiAPI = async(systemPrompt, contents) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                contents: contents,
                systemInstruction: {
                    parts: [{text: systemPrompt}]
                },
                generationConfig: {
                    maxOutputTokens: 4000,
                   temperature: 0.8,
                }
            })
        })

        const data = await response.json();

        if (!response.ok) {
            console.log(data.error.message)
        }

        return data;
    } catch(error) {
        console.error("Error calling Gemini API:", error);
    }
}

export default callGeminiAPI;
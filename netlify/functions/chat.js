exports.handler = async function (event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Method not allowed" })
        };
    }

    try {
        const { message } = JSON.parse(event.body || "{}");

        if (typeof message !== "string" || !message.trim()) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Please enter a message." })
            };
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "JARVIS is not configured yet." })
            };
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{
                            text: "You are JARVIS, a friendly and helpful AI assistant for a school exhibition. Answer the user's question directly and clearly. Never begin every response with Hello or Hi. Only greet the user when they greet you first. Keep answers concise, accurate, and suitable for students. For current facts that may have changed, avoid guessing."
                        }]
                    },
                    contents: [{
                        role: "user",
                        parts: [{ text: message.trim().slice(0, 4000) }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 500,
                        temperature: 0.7
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
console.error("Gemini API error:", response.status, JSON.stringify(data));
return {
statusCode: 502,
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
error: "Gemini API error " + response.status + ": " +
(data.error?.message || "Unknown API error")
})
};
        }

        const answer = data.candidates?.[0]?.content?.parts
    ?.map(part => part.text || "")
    .join("")
    .trim();

if (!answer) {
    console.error("Gemini returned no text:", JSON.stringify(data));
    return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            error: "Google returned no answer. Please try again."
        })
    };
}

return {
    statusCode: 200,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
    },
    body: JSON.stringify({ answer })
};

    } catch (error) {
        console.error("JARVIS function error:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Something went wrong. Please try again." })
        };
    }
};

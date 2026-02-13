import fetch from "node-fetch";

export async function askAI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-haiku",
      messages: [
        {
          role: "system",
          content: "Ты профессиональный AI разработчик. Отвечай строго валидным JSON."
        },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

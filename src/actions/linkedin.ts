"use server";

async function generateContentWithOpenRouter(prompt: string) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Please check your environment variables."
    );
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://careerpal.app",
        "X-Title": "CareerPal LinkedIn Optimizer",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API error response:", errorText);
    console.error("Response status:", response.status);
    console.error("Response status text:", response.statusText);
    throw new Error(
      `OpenRouter API error (${response.status}): ${response.statusText}. Response: ${errorText}`
    );
  }

  const result = await response.json();
  return {
    response: { text: () => result.choices[0]?.message?.content || "" },
  };
}

export async function generateLinkedInContent(data: {
  role: string;
  skills: string;
}) {
  try {
    const prompt = `
        You are a LinkedIn profile optimization expert. Create a catchy, SEO-friendly headline and a professional summary for a user with the following details:
        
        Role: ${data.role}
        Skills: ${data.skills}

        Provide the output in strict JSON format with the following structure:
        {
            "headline": "string (max 220 chars, use keywords and emojis if appropriate)",
            "summary": "string (professional first-person summary, max 2000 chars, engaging and highlighting key skills)"
        }
        Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.
        `;

    const result = await generateContentWithOpenRouter(prompt);
    const response = result.response;
    const text = response.text();

    const jsonStr = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const content = JSON.parse(jsonStr);

    return content;
  } catch (error) {
    console.error("Error generating LinkedIn content:", error);
    throw new Error("Failed to generate LinkedIn content");
  }
}
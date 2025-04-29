import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { product_name, product_description, time_in_seconds, selected_tones } = await req.json();

    const words_per_minute = 200;
    const word_count = Math.round((time_in_seconds / 60) * words_per_minute);

    // Ensure there are at least three tones; otherwise, repeat existing ones
    const tones = selected_tones.length >= 3
      ? selected_tones.slice(0, 3)
      : [...selected_tones, ...selected_tones].slice(0, 3);

    const prompt = `Generate 3 engaging and fun UGC scripts in English for a product called \"${product_name}\".  
Each script must be **exactly ${word_count} words long**—not one word more, not one word less.  

Each script should match the tone provided:  
1️⃣ **Tone: ${tones[0]}**  
2️⃣ **Tone: ${tones[1]}**  
3️⃣ **Tone: ${tones[2]}**  

Ensure the script follows a **natural, conversational flow** without using explicit headers like "Hook", "Problem", "Solution", etc.  
Product Description: \"${product_description}\"  

Provide exactly 3 scripts in this JSON format:  
[
  {"script": "Script 1 (with tone: ${tones[0]})" },
  {"script": "Script 2 (with tone: ${tones[1]})" },
  {"script": "Script 3 (with tone: ${tones[2]})" },
]  

Each script should reflect the specified tone **strongly and consistently**.  
If a script is too short, expand naturally with relevant details. If it is too long, condense without losing meaning.  
Make sure all scripts follow the **exact** ${word_count}-word requirement.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "system", content: prompt }],
        max_tokens: 2500,
        response_format: "json",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000"
              : "https://your-production-domain.com",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
      return NextResponse.json(
        { message: "Error generating script", error: error.response?.data },
        { status: 500 }
      );
    }
  
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Unexpected error" },
      { status: 500 }
    );
  }
  
}


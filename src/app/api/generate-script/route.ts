// app/api/generate-script/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { product_name, product_description, time_in_seconds, selected_tones } = await req.json();
    console.log(selected_tones);
    console.log(product_name);
    console.log(product_description);
    console.log(time_in_seconds);

    // Validate required fields
    if (!product_name || !product_description || !time_in_seconds) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate selected_tones
    if (!Array.isArray(selected_tones)) {
      return NextResponse.json(
        { message: "Selected tones must be an array" },
        { status: 400 }
      );
    }

    if (selected_tones.length !== 3) {
      return NextResponse.json(
        { message: "Exactly 3 tones must be selected" },
        { status: 400 }
      );
    }

    const words_per_minute = 200;
    const word_count = Math.round((Number(time_in_seconds) / 60) * words_per_minute);

    const prompt = `Generate 3 engaging and fun UGC scripts in English for a product called "${product_name}".  
Each script must be exactly ${word_count} words long—not one word more, not one word less.  

Each script should match the tone provided:  
1️⃣ Tone: ${selected_tones[0]}  
2️⃣ Tone: ${selected_tones[1]}  
3️⃣ Tone: ${selected_tones[2]}  

Ensure the script follows a natural, conversational flow without using explicit headers like "Hook", "Problem", "Solution", etc.  
Product Description: "${product_description}"  

Provide exactly 3 scripts in this JSON format:  
[
  {"script": "Script 1 (with tone: ${selected_tones[0]})" },
  {"script": "Script 2 (with tone: ${selected_tones[1]})" },
  {"script": "Script 3 (with tone: ${selected_tones[2]})" },
]  

Each script should reflect the specified tone strongly and consistently.  
If a script is too short, expand naturally with relevant details. If it is too long, condense without losing meaning.  
Make sure all scripts follow the exact ${word_count}-word requirement.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "system", content: prompt }],
        max_tokens: 2500,
        // Remove response_format for Mistral-7B as it doesn't support it
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

    // Parse the response to extract the scripts
    const content = response.data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in response");
    }

    let scripts;
    try {
      scripts = JSON.parse(content);
    } catch (e) {
      // If JSON parsing fails, try to extract scripts from markdown
      const scriptMatches = content.match(/"script":\s*"([^"]+)"/g);
      if (scriptMatches) {
        scripts = scriptMatches.map((match: string) => ({
          script: match.replace(/"script":\s*"/, '').replace(/"$/, '')
        }));
      } else {
        throw new Error("Could not parse scripts from response");
      }
    }

    return NextResponse.json({ scripts });
  } catch (error: unknown) {
    console.error("Error:", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          message: "Error generating script",
          error: error.response?.data?.error || error.message 
        },
        { status: 500 }
      );
    }
  
    return NextResponse.json(
      { 
        message: "Unexpected error",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
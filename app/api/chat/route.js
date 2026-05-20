import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages, profile } = await request.json();

    // Read API key at request time (not module load time)
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, return a helpful demo response
    if (!apiKey) {
      return NextResponse.json({
        message:
          "Namaste! I'm Jan Saathi. The AI service is in demo mode. Please configure GEMINI_API_KEY to enable full AI responses. You can still browse schemes and use the dashboard!",
      });
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are Jan Saathi (जन साथी), a friendly and knowledgeable AI assistant helping Indian citizens navigate government welfare schemes.

Your role:
- Help citizens understand their eligibility for central and state government schemes
- Explain application processes in simple, clear language
- Provide accurate information about PM schemes, subsidies, and entitlements
- Be empathetic and supportive — many users are from low-income backgrounds

${
  profile
    ? `User's profile context:
${JSON.stringify(profile, null, 2)}
Use this profile to give personalized answers.`
    : ""
}

Important guidelines:
- Answer in the same language the user writes in (Hindi or English)
- Keep responses concise and actionable (2-4 short paragraphs max)
- Always mention which documents are needed when discussing a scheme
- If unsure, advise visiting the nearest CSC (Common Service Centre) or official portal
- Do NOT make up schemes or fake government policies
- For emergency/crisis situations, refer to PM-CARE, NDRF, or state helplines

Major schemes you know about:
PM-KISAN, Ayushman Bharat, PM Awas Yojana, MGNREGA, Ujjwala Yojana, Jan Dhan, PM Mudra, PM Fasal Bima, Sukanya Samriddhi, NSP scholarships, PM SVANidhi, e-Shram, One Nation One Ration Card, PM Garib Kalyan, Kisan Credit Card, and all major state schemes.`;

    // Build conversation history for Gemini
    const contents = [];

    if (messages && messages.length > 0) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    // If no messages, add a default first message
    if (contents.length === 0 || contents[0].role !== "user") {
      contents.unshift({
        role: "user",
        parts: [{ text: "Hello, please introduce yourself briefly." }],
      });
    }

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini chat API error:", err);

      // Check if rate limited
      if (response.status === 429 || err.includes("RESOURCE_EXHAUSTED")) {
        return NextResponse.json({
          message:
            "🙏 The AI service is temporarily busy (rate limit reached). Please wait 30 seconds and try again. This is normal with the free API tier.",
        });
      }

      return NextResponse.json({
        message:
          "I'm having trouble connecting right now. Please try again in a moment, or visit your nearest CSC centre for assistance.",
      });
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, I could not generate a response. Please try again.";

    return NextResponse.json({ message: replyText });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({
      message:
        "Something went wrong. Please try again or visit jan.gov.in for official scheme information.",
    });
  }
}

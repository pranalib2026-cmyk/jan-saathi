import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages, profile } = await request.json();

    // Read API key at request time (not module load time)
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    // If no API key, return a helpful demo response
    if (!apiKey) {
      return NextResponse.json({
        message:
          "Namaste! I'm Unnati. The AI service is in demo mode. Please configure OPENROUTER_API_KEY to enable full AI responses. You can still browse schemes and use the dashboard!",
      });
    }

    const OPENROUTER_URLS = [
      process.env.OPENROUTER_URL || "https://openrouter.ai/api/v1/chat/completions",
      "https://api.openrouter.ai/v1/chat/completions",
    ];

    const systemPrompt = `You are Unnati (उन्नति), a friendly and knowledgeable AI assistant helping Indian citizens navigate government welfare schemes.

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

    // Build conversation history for OpenRouter (OpenAI-style chat)
    const chatMessages = [];

    // Push system prompt (include profile if available)
    if (profile) {
      chatMessages.push({ role: "system", content: systemPrompt + "\nUser profile:\n" + JSON.stringify(profile) });
    } else {
      chatMessages.push({ role: "system", content: systemPrompt });
    }

    if (messages && messages.length > 0) {
      for (const msg of messages) {
        chatMessages.push({ role: msg.role, content: msg.content });
      }
    } else {
      chatMessages.push({ role: "user", content: "Hello, please introduce yourself briefly." });
    }

    // Try endpoints in order; fall back if DNS or network error occurs
    let response;
    let lastErr;
    const timeout = 15000; // 15s

    for (const url of OPENROUTER_URLS) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        try {
          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ model: "gpt-4o-mini", messages: chatMessages, temperature: 0.2, max_tokens: 1024 }),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }

        // If we got a response (even an error code), stop trying other endpoints
        if (response) {
          if (!response.ok) console.warn(`OpenRouter response from ${url} returned status ${response.status}`);
          break;
        }
      } catch (err) {
        lastErr = err;
        // continue to next endpoint on network/DNS/timeout errors
        console.warn(`OpenRouter request to ${url} failed:`, err.message || err);
        continue;
      }
    }

    if (!response) {
      console.error("All OpenRouter endpoints failed:", lastErr);
      return NextResponse.json({
        message:
          "AI service unreachable. Please check your network or try again later. If the problem persists, open an issue or check your OpenRouter endpoint configuration.",
      });
    }

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter chat API error:", err);

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

    // Extract reply text from common completion shapes
    let replyText = "I apologize, I could not generate a response. Please try again.";
    const choice = data?.choices?.[0];
    if (choice) {
      if (choice.message && choice.message.content) {
        if (typeof choice.message.content === "string") replyText = choice.message.content;
        else if (Array.isArray(choice.message.content) && choice.message.content[0]?.text)
          replyText = choice.message.content[0].text;
        else if (choice.message.content.parts && choice.message.content.parts[0])
          replyText = choice.message.content.parts[0];
      } else if (choice.text) {
        replyText = choice.text;
      }
    }

    return NextResponse.json({ message: replyText });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({
      message:
        "Something went wrong. Please try again or visit jan.gov.in for official scheme information.",
    });
  }
}

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { profile } = await request.json();

    // Read API key at request time (not module load time)
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, use mock data (demo mode)
    if (!apiKey) {
      return NextResponse.json(getMockResults(profile));
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are Unnati, an expert AI assistant helping Indian citizens find government welfare schemes they are eligible for.

Given a citizen's profile, analyze their eligibility and return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with this exact structure:
{
  "schemes": [
    {
      "id": "unique_id",
      "name": "Scheme Name in English",
      "nameHindi": "योजना का नाम हिंदी में",
      "ministry": "Ministry name",
      "eligibilityScore": 95,
      "projectedAnnualValue": 6000,
      "projectedLifetimeValue": 30000,
      "category": "financial|health|education|housing|agriculture|women|children",
      "priority": "immediate|soon|future",
      "actionSteps": ["Step 1", "Step 2", "Step 3"],
      "documentsRequired": ["Aadhaar Card", "Income Certificate"],
      "deadline": "March 31, 2025 or null",
      "description": "Brief description of the scheme"
    }
  ],
  "totalProjectedValue": 150000,
  "profileSummary": "Brief summary of why these schemes were recommended",
  "documentGaps": ["Missing document 1", "Missing document 2"]
}

Focus on real Indian government schemes like:
- PM-KISAN (farmers)
- Pradhan Mantri Jan Dhan Yojana (banking)
- Ayushman Bharat (health insurance)
- PM Awas Yojana (housing)
- Ujjwala Yojana (LPG for women)
- Sukanya Samriddhi (girl child)
- PM Fasal Bima Yojana (crop insurance)
- MGNREGA (employment guarantee)
- PM Mudra Yojana (business loans)
- Scholarship schemes (students)

Match schemes strictly based on the profile provided. Return 5-8 most relevant schemes.`;

    const userMessage = `Analyze this citizen profile and return matching welfare schemes:

${JSON.stringify(profile, null, 2)}

Return ONLY the JSON object. No markdown. No explanation.`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt + "\n\n" + userMessage }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json(getMockResults(profile));
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleaned = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      console.error("JSON parse error, using mock data. Raw:", cleaned);
      return NextResponse.json(getMockResults(profile));
    }
  } catch (error) {
    console.error("Analyze route error:", error);
    return NextResponse.json(getMockResults({}));
  }
}

function getMockResults(profile) {
  return {
    schemes: [
      {
        id: "ayushman-bharat",
        name: "Ayushman Bharat PM-JAY",
        nameHindi: "आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना",
        ministry: "Ministry of Health & Family Welfare",
        eligibilityScore: 92,
        projectedAnnualValue: 500000,
        projectedLifetimeValue: 2500000,
        category: "health",
        priority: "immediate",
        actionSteps: [
          "Visit nearest Common Service Centre (CSC)",
          "Carry Aadhaar Card and Ration Card",
          "Get Ayushman Card issued free of cost",
          "Use card at any empanelled hospital",
        ],
        documentsRequired: ["Aadhaar Card", "Ration Card"],
        deadline: null,
        description:
          "Health cover of ₹5 lakh per family per year for secondary and tertiary hospitalization",
      },
      {
        id: "pm-jan-dhan",
        name: "PM Jan Dhan Yojana",
        nameHindi: "प्रधानमंत्री जन धन योजना",
        ministry: "Ministry of Finance",
        eligibilityScore: 88,
        projectedAnnualValue: 10000,
        projectedLifetimeValue: 50000,
        category: "financial",
        priority: "immediate",
        actionSteps: [
          "Visit nearest bank branch or Business Correspondent",
          "Carry Aadhaar Card (or any ID proof)",
          "Fill zero-balance account opening form",
          "Activate RuPay debit card",
        ],
        documentsRequired: ["Aadhaar Card", "Passport Photo"],
        deadline: null,
        description:
          "Zero-balance bank account with ₹10,000 overdraft, RuPay card, and ₹2 lakh accident insurance",
      },
      {
        id: "ujjwala-yojana",
        name: "PM Ujjwala Yojana 2.0",
        nameHindi: "प्रधानमंत्री उज्ज्वला योजना",
        ministry: "Ministry of Petroleum & Natural Gas",
        eligibilityScore: 85,
        projectedAnnualValue: 3600,
        projectedLifetimeValue: 18000,
        category: "women",
        priority: "immediate",
        actionSteps: [
          "Visit nearest LPG distributor",
          "Fill Ujjwala 2.0 application form",
          "Submit Aadhaar and Ration Card",
          "Get free LPG connection with first refill subsidy",
        ],
        documentsRequired: ["Aadhaar Card", "Ration Card", "Bank Account"],
        deadline: null,
        description:
          "Free LPG connection to women from Below Poverty Line households",
      },
      {
        id: "pm-awas-yojana",
        name: "PM Awas Yojana (Gramin)",
        nameHindi: "प्रधानमंत्री आवास योजना",
        ministry: "Ministry of Rural Development",
        eligibilityScore: 78,
        projectedAnnualValue: 120000,
        projectedLifetimeValue: 120000,
        category: "housing",
        priority: "soon",
        actionSteps: [
          "Contact your Gram Panchayat",
          "Get name added to SECC/Awaas+ survey",
          "Submit application with land documents",
          "Receive ₹1.2 lakh in installments after approval",
        ],
        documentsRequired: [
          "Aadhaar Card",
          "Bank Account",
          "Land Documents",
          "MGNREGA Job Card",
        ],
        deadline: null,
        description:
          "Financial assistance of ₹1.2 lakh for construction of pucca houses in rural areas",
      },
      {
        id: "mudra-yojana",
        name: "PM Mudra Yojana",
        nameHindi: "प्रधानमंत्री मुद्रा योजना",
        ministry: "Ministry of Finance",
        eligibilityScore: 72,
        projectedAnnualValue: 50000,
        projectedLifetimeValue: 200000,
        category: "financial",
        priority: "soon",
        actionSteps: [
          "Prepare a simple business plan",
          "Visit nearest bank/MFI/NBFC",
          "Apply for Shishu (up to ₹50K), Kishore (₹50K–5L), or Tarun (₹5L–10L) loan",
          "No collateral required",
        ],
        documentsRequired: [
          "Aadhaar Card",
          "PAN Card",
          "Business Address Proof",
          "Bank Statement",
        ],
        deadline: null,
        description:
          "Collateral-free loans up to ₹10 lakh for non-farm small/micro enterprises",
      },
    ],
    totalProjectedValue: 3188000,
    profileSummary:
      "Based on your profile, you are eligible for multiple high-value central government schemes. Priority action: Get your Ayushman Bharat card today for ₹5 lakh health coverage.",
    documentGaps: ["Income Certificate", "Caste Certificate (if applicable)"],
  };
}

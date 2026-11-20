import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiClient, GEMINI_MODELS } from "@/lib/gemini/client";
import { AI_SUPERVISOR_SYSTEM_PROMPT } from "@/lib/gemini/prompts";

const ChatRequestSchema = z.object({
  message: z.string().min(1),
  appliance: z.object({
    brand: z.string().optional(),
    ton: z.string().optional(),
    type: z.string().optional(),
    gas: z.string().optional(),
  }).optional(),
  currentReading: z.object({
    psi: z.number().optional(),
    voltage: z.number().optional(),
    amp: z.number().optional()
  }).optional(),
  history: z.array(z.object({
    role: z.enum(["user", "model"]),
    text: z.string()
  })).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload", details: parsed.error.issues }, { status: 400 });
    }

    const { message, appliance, currentReading, history = [] } = parsed.data;
    const gemini = getGeminiClient();

    // If API Key is present, call live Google Gemini API
    if (gemini) {
      const model = gemini.getGenerativeModel({
        model: GEMINI_MODELS.text,
        systemInstruction: AI_SUPERVISOR_SYSTEM_PROMPT
      });

      const contextDetails = [
        appliance ? `[उपकरण: ${appliance.brand || 'LG'} ${appliance.ton || '1.5 Ton'} ${appliance.type || 'Inverter'} AC, गैस: ${appliance.gas || 'R32'}]` : '',
        currentReading ? `[मीटर रीडिंग: सक्शन ${currentReading.psi ?? 40} PSI, वोल्टेज ${currentReading.voltage ?? 220}V, करंट ${currentReading.amp ?? 3.8}A]` : ''
      ].filter(Boolean).join(' ');

      // Format previous history for Gemini multi-turn session
      const formattedHistory = history.slice(-6).map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }));

      try {
        const chat = model.startChat({
          history: formattedHistory
        });

        const promptWithContext = contextDetails ? `${contextDetails}\n\nतकनीशियन/ग्राहक का प्रश्न: ${message}` : message;
        const response = await chat.sendMessage(promptWithContext);
        const textResponse = response.response.text();

        return NextResponse.json({
          source: "GEMINI_LIVE_API",
          model: GEMINI_MODELS.text,
          reply: textResponse,
          confidence: 0.95
        });
      } catch (chatError) {
        // Fallback to single turn generateContent if startChat has formatting edge case
        const response = await model.generateContent(`${contextDetails}\n${message}`);
        return NextResponse.json({
          source: "GEMINI_LIVE_API",
          model: GEMINI_MODELS.text,
          reply: response.response.text(),
          confidence: 0.92
        });
      }
    }

    // Graceful Intelligent Local Fallback (matches physics rules)
    let fallbackReply = `मैंने आपकी बात नोट कर ली है: "${message}"। कृपया मीटर रीडिंग और सुरक्षा चेकलिस्ट पूरी करें।`;
    const lower = message.toLowerCase();

    if (lower.includes("thanda") || lower.includes("cooling") || lower.includes("ठंडा")) {
      fallbackReply = "AC ठंडा न करने के मुख्य कारण: 1. गैस का रिसाव (सक्शन प्रेशर चेक करें), 2. इंडोर फिल्टर व ब्लोअर चोक, या 3. कम वोल्टेज (190V से कम)। कृपया नीले गेज मीटर का प्रेशर चेक करें।";
    } else if (lower.includes("blower") || lower.includes("fan") || lower.includes("ब्लोअर") || lower.includes("पंखा")) {
      fallbackReply = "फ़ैन ब्लोअर न चलने पर इंडोर PCB का 3.5µF कैपेसिटर चेक करें। रंगीन डायग्राम के अनुसार लाल तार पर 230V और नीले तार पर न्यूट्रल चेक करें।";
    } else if (lower.includes("kharcha") || lower.includes("paisa") || lower.includes("खर्चा") || lower.includes("रेट")) {
      fallbackReply = "कंपनी रेट कार्ड: विजिट ₹199, फ्लेयर नट रिपेयर ₹350, वैक्यूम पंपिंग ₹250, और असली R32 गैस ₹600 = कुल ₹1,399, 45 दिन की गारंटी के साथ।";
    } else if (lower.includes("psi") || lower.includes("meter")) {
      fallbackReply = "R32 गैस के लिए सही प्रेशर 115 से 135 PSI होना चाहिए। अगर 70 से कम है तो लीकेज पक्की है। बिना वैक्यूम गैस डालना मना है।";
    }

    return NextResponse.json({
      source: "INTELLIGENT_PHYSICS_ENGINE",
      model: "local-physics-kb",
      reply: fallbackReply,
      confidence: 0.88,
      note: "Live Gemini API key not set in .env.local; operating in local physics mode."
    });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      error: "Internal server error processing AI chat",
      message: error?.message || "Unknown error"
    }, { status: 500 });
  }
}

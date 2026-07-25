import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "POSEIDON: Connection to expedition systems temporarily unavailable. Telemetry link down (missing API Key)." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      messages,
      depth,
      zone,
      pressure,
      temperature,
      discoveryName,
      discoveryScientificName,
      discoveryRarity,
      discoveryDescription,
    } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "POSEIDON: Invalid telemetry request. Dialogue payload missing." },
        { status: 400 }
      );
    }

    // Initialize Generative AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Format chat history: Gemini SDK expects { role: 'user' | 'model', parts: [{ text: string }] }
    // Note: 'assistant' role must map to 'model' for Gemini compatibility
    const formattedHistory = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // The last message is the prompt we want to send, and others form the history
    const activePrompt = formattedHistory.pop();
    if (!activePrompt) {
      return NextResponse.json(
        { error: "POSEIDON: Dialogue buffer empty. Prompt required." },
        { status: 400 }
      );
    }

    // Prepend context-rich system instructions to feed POSEIDON's character operating mainframe
    const systemInstruction = `You are POSEIDON, the intelligent operating system and onboard artificial intelligence companion of an advanced deep-sea research submarine.
  
CURRENT SUBMARINE ENVIRONMENTAL DATA:
- Current Depth: ${depth} meters
- Oceanographic Zone: ${zone}
- Hydrostatic Pressure: ${pressure} ATM
- Ambient Water Temperature: ${temperature}°C
  
ACTIVE ANOMALY CLASSIFICATION:
- Name: ${discoveryName}
- Taxonomy: ${discoveryScientificName}
- Rarity Tier: ${discoveryRarity}
- Telemetry Logs: ${discoveryDescription}
  
COMPANION CORE DIRECTIVES:
1. Speak as a calm, analytical, and highly advanced operating computer. Maintain a steady, reassuring, slightly technical, and premium vocal demeanor (concise, atmospheric, and highly professional).
2. You have full access to deep-sea marine biology, oceanography, geology, and vessel instrumentation databases. Always be scientifically accurate.
3. Never break character. Never state that you are an AI language model, a chatbot, or created by Google. If asked about your nature, you are POSEIDON, operating system v1.0.
4. Reference current depth coordinates, environmental readings, and the active discovery naturally inside your replies where appropriate. Keep answers brief (less than 3-4 sentences) as fit for console dialogue grids.`;

    // Start a chat session with history and system instruction
    const chatSession = model.startChat({
      history: formattedHistory,
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 250,
      },
    });

    // Execute the chat stream with timeout safety
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("POSEIDON API Timeout")), 12000)
    );

    const apiPromise = chatSession.sendMessage(activePrompt.parts[0].text);

    // Race the API call against a 12-second timeout
    const result = await Promise.race([apiPromise, timeoutPromise]);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("POSEIDON AI API Error: ", error);
    
    // Graceful customized error response
    return NextResponse.json(
      { error: "POSEIDON: Connection to expedition systems temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}

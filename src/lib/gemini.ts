import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

/**
 * Sends a prompt to the Google Gemini model and returns the text response.
 * Uses verified active Gemini models with intelligent fallback support.
 */
export async function generateGeminiResponse(prompt: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is missing in .env.local.');
  }

  const candidateModels = [
    'gemini-flash-lite-latest',
    'gemini-flash-latest',
    'gemini-3.5-flash-lite',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash'
  ];

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      const text = response.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`Model ${modelName} call failed, attempting next candidate:`, error.message || error);
    }
  }

  throw new Error(`Failed to generate response from Gemini API across candidate models. Last error: ${lastError?.message || lastError}`);
}

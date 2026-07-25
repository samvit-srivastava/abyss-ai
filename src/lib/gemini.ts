import { GoogleGenAI } from '@google/genai';

// Retrieve API key from environment variables.
const apiKey = process.env.GEMINI_API_KEY;

// Create the GoogleGenAI instance.
// Using a fallback dummy-key avoids crash on initialization if key is missing initially,
// but we will throw an explicit error when a request is made.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

/**
 * Sends a prompt to the Google Gemini 2.5 Flash model and returns the text response.
 * @param prompt The prompt to send to Gemini.
 * @returns Promise resolving to the generated text response.
 */
export async function generateGeminiResponse(prompt: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not defined.');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      throw new Error('No text content returned from the Gemini API.');
    }

    return text;
  } catch (error: any) {
    console.error('Gemini API Error details:', error);
    throw new Error(`Failed to generate Gemini response: ${error.message || error}`);
  }
}

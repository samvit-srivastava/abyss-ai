import { NextRequest, NextResponse } from 'next/server';
import { oceanObjects } from '@/data/ocean';
import { buildOceanContext } from '@/lib/contextBuilder';
import { buildOceanPrompt } from '@/lib/promptBuilder';
import { generateGeminiResponse } from '@/lib/gemini';
import { ChatResponse, ChatRequest } from '@/types/ocean';

export async function POST(req: NextRequest) {
  try {
    // 1. Parse JSON body safely
    const body = await req.json().catch(() => null) as ChatRequest | null;
    
    if (!body) {
      return NextResponse.json<ChatResponse>(
        { success: false, error: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    const { objectId, question } = body;

    // 2. Validate payload presence
    if (!objectId) {
      return NextResponse.json<ChatResponse>(
        { success: false, error: 'Missing required field: objectId' },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return NextResponse.json<ChatResponse>(
        { success: false, error: 'Missing or empty field: question' },
        { status: 400 }
      );
    }

    // 3. Find target object in ocean dataset
    const oceanObject = oceanObjects.find((obj) => obj.id === objectId);
    if (!oceanObject) {
      return NextResponse.json<ChatResponse>(
        { success: false, error: `Invalid objectId: '${objectId}' not found in the ocean dataset.` },
        { status: 404 }
      );
    }

    // 4. Generate structured context information
    const context = buildOceanContext(oceanObject);

    // 5. Generate immersive prompt
    const prompt = buildOceanPrompt(context, question.trim());

    // 6. Call Gemini LLM wrapper
    const answer = await generateGeminiResponse(prompt);

    // 7. Return successful response containing generated answer and the source object
    return NextResponse.json<ChatResponse>({
      success: true,
      answer,
      object: oceanObject,
    });
  } catch (error: any) {
    console.error('Error in API /api/chat:', error);
    
    return NextResponse.json<ChatResponse>(
      {
        success: false,
        error: error.message || 'An unexpected internal error occurred.',
      },
      { status: 500 }
    );
  }
}

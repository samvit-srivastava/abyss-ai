import { NextRequest, NextResponse } from 'next/server';
import { oceanObjects } from '@/data/ocean';
import { DISCOVERIES } from '@/data/discoveries';
import { OCEAN_CREATURES_50 } from '@/data/oceanCreatures';
import { buildOceanPrompt } from '@/lib/promptBuilder';
import { generateGeminiResponse } from '@/lib/gemini';
import { ChatResponse, ChatRequest, OceanObject } from '@/types/ocean';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as ChatRequest | null;
    
    if (!body) {
      return NextResponse.json<ChatResponse>(
        { success: false, error: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    const { objectId, question } = body;

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

    // 1. Search in oceanObjects dataset
    let oceanObject: OceanObject | undefined = oceanObjects.find(
      (obj) => obj.id === objectId || obj.name.toLowerCase().includes(objectId.toLowerCase())
    );

    // 2. Fallback search in DISCOVERIES dataset
    if (!oceanObject) {
      const discoveryMatch = DISCOVERIES.find(
        (d) => d.id === objectId || d.name.toLowerCase().includes(objectId.toLowerCase())
      );
      if (discoveryMatch) {
        oceanObject = {
          id: discoveryMatch.id,
          name: discoveryMatch.name,
          zone: discoveryMatch.targetDepth > 6000 ? 'Hadal Zone' : discoveryMatch.targetDepth > 1000 ? 'Midnight Zone' : 'Sunlight Zone',
          depth: discoveryMatch.targetDepth,
          description: discoveryMatch.description,
          interestingFacts: [
            `Scientific / Classification tag: ${discoveryMatch.scientificName}.`,
            `Recorded target depth: ${discoveryMatch.targetDepth} meters beneath surface.`,
            `Rarity tier: ${discoveryMatch.rarity}.`
          ],
          sampleQuestions: [
            `How does ${discoveryMatch.name} adapt to deep ocean pressure?`,
            `What is the history or biological role of ${discoveryMatch.name}?`,
            `What happens at a depth of ${discoveryMatch.targetDepth} meters?`
          ],
          imagePlaceholder: discoveryMatch.name
        };
      }
    }

    // 3. Fallback search in OCEAN_CREATURES_50 dataset
    if (!oceanObject) {
      const creatureMatch = OCEAN_CREATURES_50.find(
        (c) => c.id === objectId || c.name.toLowerCase().includes(objectId.toLowerCase())
      );
      if (creatureMatch) {
        oceanObject = {
          id: creatureMatch.id,
          name: creatureMatch.name,
          zone: `${creatureMatch.zone} Zone`,
          depth: Math.round((creatureMatch.depthMin + creatureMatch.depthMax) / 2),
          description: `${creatureMatch.name} (${creatureMatch.scientificName}) is a marine organism inhabiting the ${creatureMatch.zone} zone between ${creatureMatch.depthMin}m and ${creatureMatch.depthMax}m.`,
          interestingFacts: [
            `Scientific name: ${creatureMatch.scientificName}.`,
            `Depth range: ${creatureMatch.depthMin}m to ${creatureMatch.depthMax}m.`,
            `Adapted to low light, freezing temperatures, and hydrostatic pressure.`
          ],
          sampleQuestions: [
            `How does ${creatureMatch.name} navigate in dark waters?`,
            `What does ${creatureMatch.name} feed on?`,
            `How does its body structure handle pressure?`
          ],
          imagePlaceholder: creatureMatch.name
        };
      }
    }

    // 4. Default generic fallback if objectId is arbitrary
    if (!oceanObject) {
      oceanObject = {
        id: objectId,
        name: objectId.replace(/[-_]/g, ' '),
        zone: 'Deep Ocean',
        depth: 1000,
        description: `A deep sea target identified as ${objectId}.`,
        interestingFacts: [`Located in the ocean depth column.`],
        sampleQuestions: [`Tell me about ${objectId}.`],
        imagePlaceholder: objectId
      };
    }

    // Build prompt & request response from Gemini API
    const prompt = buildOceanPrompt(oceanObject, question.trim());
    const answer = await generateGeminiResponse(prompt);

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
        error: error.message || 'An unexpected internal error occurred in Gemini API.',
      },
      { status: 500 }
    );
  }
}

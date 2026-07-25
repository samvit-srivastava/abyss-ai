import { OceanObject } from '../types/ocean';

export interface OceanContext {
  name: string;
  depth: number;
  zone: string;
  description: string;
  interestingFacts: string[];
  sampleQuestions: string[];
}

/**
 * Extracts and structures the necessary context from an OceanObject.
 * This separates the data layer from the prompt layer.
 * 
 * @param object The selected ocean discovery object.
 * @returns Structured contextual information.
 */
export function buildOceanContext(object: OceanObject): OceanContext {
  return {
    name: object.name,
    depth: object.depth,
    zone: object.zone,
    description: object.description,
    interestingFacts: object.interestingFacts,
    sampleQuestions: object.sampleQuestions,
  };
}

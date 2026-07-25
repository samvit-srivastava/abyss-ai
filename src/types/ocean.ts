export interface OceanObject {
  id: string;
  name: string;
  zone: string;
  depth: number; // in meters
  description: string;
  interestingFacts: string[];
  sampleQuestions: string[];
  imagePlaceholder: string;
}

export type OceanZoneName =
  | 'Surface'
  | 'Sunlight Zone'
  | 'Twilight Zone'
  | 'Midnight Zone'
  | 'Abyssal Zone'
  | 'Hadal Zone';

export interface OceanZone {
  name: OceanZoneName;
  depthRange: string; // e.g. "0m", "0m - 200m"
  description: string;
  objects: OceanObject[];
}

export interface ChatRequest {
  objectId: string;
  question: string;
}

export interface ChatResponse {
  success: boolean;
  answer?: string;
  object?: OceanObject;
  error?: string;
}

export interface CharacterInputs {
  name: string;
  archetype: string;
  appearance: string;
  clothing: string;
  accessories: string;
  expressions: string;
  secretItem: string;
  image: File | null;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedResult {
  imageUrl: string;
  promptUsed: string;
}

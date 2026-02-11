export interface User {
  email: string;
  name: string;
  phone_number?: string;
  address?: string;
  profile_picture_url?: string;
}

export interface LegalSection {
  id: string;
  act: string;
  section: string;
  title: string;
  description: string;
  punishment?: string;
  keywords: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  retrievedContext?: LegalSection[]; // The "RAG" part
  isThinking?: boolean;
}

export interface ScenarioInput {
  text: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RETRIEVING = 'RETRIEVING',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR'
}
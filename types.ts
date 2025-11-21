export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean; // Visual state for reasoning models
  error?: boolean;
}

export type GeminiModel = 
  | 'gemini-2.5-flash' 
  | 'gemini-3-pro-preview';

export interface ChatConfig {
  model: GeminiModel;
  systemInstruction: string;
  temperature: number;
  thinkingBudget: number; // For 2.5 models
}

export const DEFAULT_CONFIG: ChatConfig = {
  model: 'gemini-2.5-flash',
  systemInstruction: "You are Nexus, a helpful, intelligent, and precise AI assistant. Answer concisely using Markdown.",
  temperature: 0.7,
  thinkingBudget: 0, // Disabled by default
};

export const MODELS: { id: GeminiModel; name: string; description: string; supportThinking: boolean }[] = [
  { 
    id: 'gemini-2.5-flash', 
    name: 'Gemini 2.5 Flash', 
    description: 'Fast, efficient, and low latency.',
    supportThinking: true
  },
  { 
    id: 'gemini-3-pro-preview', 
    name: 'Gemini 3.0 Pro', 
    description: 'Complex reasoning and coding tasks.',
    supportThinking: true
  }
];
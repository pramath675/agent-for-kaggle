import { GoogleGenAI, Chat, ChatSession } from "@google/genai";
import { ChatConfig } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
    }
    // Initialize with the key.
    this.ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key' });
  }

  /**
   * Initializes or resets a chat session with specific configuration.
   */
  public startChat(config: ChatConfig) {
    const generationConfig: any = {
      temperature: config.temperature,
    };

    // Apply thinking config if budget > 0 and model supports it (Both models used here support it)
    if (config.thinkingBudget > 0) {
      generationConfig.thinkingConfig = { thinkingBudget: config.thinkingBudget };
      // When thinking is enabled, we usually don't set standard temperature, 
      // but the API allows some mixing. 
    }

    this.chatSession = this.ai.chats.create({
      model: config.model,
      config: {
        systemInstruction: config.systemInstruction,
        ...generationConfig
      },
    });
  }

  /**
   * Sends a message and yields chunks for streaming.
   */
  public async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.chatSession) {
      throw new Error("Chat session not initialized. Call startChat first.");
    }

    try {
      const resultStream = await this.chatSession.sendMessageStream({ message });

      for await (const chunk of resultStream) {
        // Directly access text property from the chunk
        const text = chunk.text;
        if (text) {
          yield text;
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
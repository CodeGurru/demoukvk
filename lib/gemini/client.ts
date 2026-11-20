/**
 * Google Gemini SDK Client Integration
 * Uses @google/generative-ai (with official fallbacks)
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

export const GEMINI_MODELS = {
  text: process.env.MODEL_TEXT || "gemini-1.5-flash",
  vision: process.env.MODEL_VISION || "gemini-1.5-flash",
  image: process.env.MODEL_IMAGE || "imagen-3.0-generate-002",
  live: process.env.MODEL_LIVE || "gemini-2.0-flash-exp",
};

export function getGeminiModel(modelName: string = GEMINI_MODELS.text) {
  const client = getGeminiClient();
  if (!client) return null;
  return client.getGenerativeModel({ model: modelName });
}

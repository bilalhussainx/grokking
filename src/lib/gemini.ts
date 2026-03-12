import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export function getGeminiModel(systemInstruction?: string) {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    ...(systemInstruction && { systemInstruction }),
  });
}

export function getGeminiChat(systemInstruction: string, history?: { role: string; parts: { text: string }[] }[]) {
  const model = getGeminiModel(systemInstruction);
  return model.startChat({
    history: history || [],
  });
}

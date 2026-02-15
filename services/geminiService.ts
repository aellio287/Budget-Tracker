
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBudgetInsights(transactions: Transaction[]): Promise<string> {
  if (transactions.length === 0) {
    return "Add some transactions to get personalized AI budget tips!";
  }

  // Updated to use transaction.title
  const summary = transactions.map(t => `${t.type}: ${t.title} ($${t.amount})`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these transactions and give one short, helpful, and motivating budgeting tip (max 2 sentences): \n${summary}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Keep tracking your spending to stay on top of your goals!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error getting AI insights. Check your connection.";
  }
}

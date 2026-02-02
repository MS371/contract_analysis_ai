
import { GoogleGenAI, Type } from "@google/genai";
import { ContractAnalysisResult, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    contractType: { type: Type.STRING },
    parties: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
        },
        required: ["name", "role"],
      },
    },
    summary: { type: Type.STRING },
    overallRiskScore: { type: Type.NUMBER },
    keyDates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          date: { type: Type.STRING },
        },
        required: ["label", "date"],
      },
    },
    clauses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          clauseTitle: { type: Type.STRING },
          originalText: { type: Type.STRING },
          simplifiedExplanation: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          riskDescription: { type: Type.STRING },
          suggestedAlternative: { type: Type.STRING },
        },
        required: ["clauseTitle", "originalText", "simplifiedExplanation", "riskLevel", "riskDescription"],
      },
    },
    unfavorableTerms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    complianceCheck: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          statute: { type: Type.STRING },
          status: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
        required: ["statute", "status", "notes"],
      },
    },
    mitigationStrategies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    "contractType", "parties", "summary", "overallRiskScore", 
    "keyDates", "clauses", "unfavorableTerms", 
    "complianceCheck", "mitigationStrategies"
  ],
};

export async function analyzeContract(text: string, language: 'en' | 'hi' = 'en'): Promise<ContractAnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const systemPrompt = `
    You are an expert Indian Corporate Lawyer and SME Legal Advisor. 
    Analyze the provided contract text and provide a structured risk assessment and plain-language explanation.
    Focus on Indian laws like the Indian Contract Act (1872), IT Act, Labor Laws, etc.
    If the contract is in Hindi, normalize it to English for analysis but provide explanations in simple business English.
    Ensure riskLevel is one of: LOW, MEDIUM, HIGH, CRITICAL.
    Overall risk score should be 0-100 (100 is most dangerous).
    Look specifically for:
    - Indemnity and Liability caps
    - Unilateral termination clauses
    - Arbitration and Jurisdiction (Prefer SME-friendly locations)
    - Auto-renewal and lock-in periods
    - Intellectual Property transfer
    - Non-compete and restrictive covenants
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Contract Text:\n\n${text}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA as any,
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze contract. Please try again later.");
  }
}

export async function generateTemplate(type: string): Promise<string> {
  const model = "gemini-3-pro-preview";
  const prompt = `Generate a standard, SME-friendly ${type} template for an Indian business. 
  Include placeholder fields in [SQUARE_BRACKETS]. 
  Ensure it follows modern Indian legal standards and protects the SME from common risks like delayed payments and unfair termination.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Template Generation Error:", error);
    return "Failed to generate template.";
  }
}

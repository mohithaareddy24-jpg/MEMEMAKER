import { GoogleGenAI } from "@google/genai";

// Lazily initialize the API client
let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing. Please set it in your .env file.");
      throw new Error("API Key Missing");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const generateMemeCaption = async (memeName: string): Promise<{ topText: string; bottomText: string }> => {
  try {
    const api = getClient();
    const model = "gemini-3-flash-preview";
    const prompt = `Generate a funny, witty, and relevant caption for the meme template "${memeName}". 
    Return ONLY a JSON object with "topText" and "bottomText" keys. 
    Keep the text concise and suitable for a meme. 
    Do not include markdown formatting or explanations.`;

    const response = await api.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from API");

    const json = JSON.parse(text);
    return {
      topText: json.topText || "",
      bottomText: json.bottomText || ""
    };
  } catch (error) {
    console.error("Error generating caption:", error);
    if ((error as Error).message === "API Key Missing") {
      return { topText: "API KEY", bottomText: "MISSING" };
    }
    return { topText: "GENERATION", bottomText: "FAILED" };
  }
};

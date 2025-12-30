import { GoogleGenAI, Type } from "@google/genai";
import { TaskStatus } from "../types";

// Initialize the Gemini client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateProjectPlan = async (
  projectTitle: string,
  projectDescription: string
): Promise<{ title: string; description: string; status: TaskStatus }[]> => {
  const ai = getClient();
  if (!ai) {
    console.warn("Gemini API Key not found. Returning mock data.");
    return [
      { title: "Define Requirements", description: "List all core features.", status: TaskStatus.TODO },
      { title: "Setup Repo", description: "Initialize git repository.", status: TaskStatus.TODO },
    ];
  }

  try {
    const prompt = `
      I am starting a new project titled "${projectTitle}".
      Description: "${projectDescription}".
      
      Please generate a list of 3-5 initial tasks to get this project started.
      The status should mostly be TODO, but maybe one IN_PROGRESS.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              status: { type: Type.STRING, enum: [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE] },
            },
            required: ["title", "description", "status"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const suggestTaskImprovement = async (
  taskTitle: string,
  taskDescription: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Please add an API Key to use AI features.";

  try {
    const prompt = `
      Review this task:
      Title: "${taskTitle}"
      Description: "${taskDescription}"
      
      Suggest a better, more actionable description for this task. Keep it concise (under 3 sentences).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || taskDescription;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return taskDescription;
  }
};
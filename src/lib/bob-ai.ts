import { supabase } from "@/integrations/supabase/client";
import { ProjectFormData, ChatMessage } from "@/components/builder/types";

export type { ChatMessage } from "@/components/builder/types";

export interface GeneratedQuestion {
  question: string;
  suggestions: string[];
}

interface BobAIResponse {
  content: string;
  error?: string;
}

interface BobAIResponse {
  content: string;
  error?: string;
}

async function callBobAI(payload: Record<string, unknown>): Promise<string> {
  const { data, error } = await supabase.functions.invoke<BobAIResponse>("bob-ai", {
    body: payload,
  });

  if (error) {
    console.error("Bob AI error:", error);
    throw new Error(error.message || "AI request failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.content || "";
}

export async function generateGreeting(formData: ProjectFormData): Promise<string> {
  try {
    return await callBobAI({ action: "greeting", formData });
  } catch (error) {
    console.error("Failed to generate greeting:", error);
    return `Let me help you design the architecture for your project. I'll ask a few questions to understand your needs better.`;
  }
}

export async function generateQuestions(formData: ProjectFormData): Promise<GeneratedQuestion[]> {
  try {
    const response = await callBobAI({ action: "generate_questions", formData });
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Invalid JSON response");
  } catch (error) {
    console.error("Failed to generate questions:", error);
    return [
      {
        question: "What's the primary purpose of this application?",
        suggestions: ["Data management", "User interaction", "Automation", "Analytics"],
      },
      {
        question: "How many users do you expect?",
        suggestions: ["Under 100", "100-1,000", "1,000-10,000", "10,000+"],
      },
      {
        question: "What's your deployment target?",
        suggestions: ["Cloud (AWS/GCP/Azure)", "Vercel/Netlify", "On-premise", "Not sure yet"],
      },
    ];
  }
}

export async function acknowledgeResponse(
  formData: ProjectFormData,
  currentQuestion: string,
  userMessage: string,
): Promise<string> {
  try {
    return await callBobAI({
      action: "acknowledge_response",
      formData,
      currentQuestion,
      userMessage,
    });
  } catch (error) {
    console.error("Failed to acknowledge response:", error);
    return "Got it, thanks! Let me continue...";
  }
}

export async function validateProject(project: string): Promise<{ valid: boolean; message?: string }> {
  if (project.length < 10) {
    return { valid: false, message: "Could you add a bit more detail? Just a few words about what you want to build." };
  }

  try {
    const response = await callBobAI({
      action: "validate_project",
      formData: { project, teamSize: "", timeline: "", experience: "" },
    });
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { valid: true };
  } catch (error) {
    console.error("Validation error:", error);
    return { valid: true }; // Fail open
  }
}

export async function generateArchitecture(
  formData: ProjectFormData,
  conversationHistory: ChatMessage[],
): Promise<Record<string, unknown> | null> {
  try {
    const response = await callBobAI({
      action: "generate_architecture",
      formData,
      conversationHistory,
    });
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Invalid JSON response");
  } catch (error) {
    console.error("Failed to generate architecture:", error);
    return null;
  }
}

export async function getChatResponse(
  formData: ProjectFormData,
  conversationHistory: ChatMessage[],
  userMessage: string,
): Promise<string> {
  try {
    return await callBobAI({
      action: "chat_response",
      formData,
      conversationHistory,
      userMessage,
    });
  } catch (error) {
    console.error("Failed to get chat response:", error);
    return "I understand. Let me think about that...";
  }
}

export async function generateScaffoldFiles(
  formData: ProjectFormData,
  conversationHistory: ChatMessage[],
  architecture: Record<string, unknown>,
): Promise<Record<string, string>> {
  try {
    const response = await callBobAI({
      action: "generate_scaffold_files",
      formData,
      conversationHistory,
      architecture,
    });

    // Expect: { "files": { "path": "content", ... } }
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON response");

    const parsed = JSON.parse(jsonMatch[0]);
    const files = parsed?.files;

    if (files && typeof files === "object") {
      return files as Record<string, string>;
    }

    return {};
  } catch (error) {
    console.error("Failed to generate scaffold files:", error);
    return {};
  }
}

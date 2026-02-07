import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ProjectFormData {
  project: string;
  teamSize: string;
  timeline: string;
  experience: string;
  techPreferences?: {
    frontend: string[];
    backend: string[];
    database: string[];
    deployment: string[];
  };
}

// Helper to flatten techPreferences object into a string
function getTechPreferencesString(techPreferences?: ProjectFormData['techPreferences']): string {
  if (!techPreferences) return 'None specified';
  const all = [
    ...techPreferences.frontend,
    ...techPreferences.backend,
    ...techPreferences.database,
    ...techPreferences.deployment,
  ].filter(Boolean);
  return all.length > 0 ? all.join(', ') : 'None specified';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, formData, conversationHistory, userMessage, currentQuestion } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "greeting":
        systemPrompt = `You are Bob, a friendly and professional AI code architect. You help developers design the perfect project architecture.`;
        userPrompt = `A user wants to build: "${formData.project}"
Team size: ${formData.teamSize}
Timeline: ${formData.timeline}
Experience: ${formData.experience}

Generate a warm, professional greeting (2-3 sentences) that:
1. Shows you understand their project WITHOUT quoting it back verbatim
2. Mentions you'll ask clarifying questions
3. Feels conversational and natural

DO NOT use quotes around the project name.
DO NOT say "I understand you're building X" - paraphrase instead.
Be concise and friendly.`;
        break;

      case "generate_questions":
        systemPrompt = `You are Bob, an expert software architect. Generate contextual questions based on the project.`;
        userPrompt = `Analyze this project and generate 3 CONTEXTUAL questions.

PROJECT: ${formData.project}
Team size: ${formData.teamSize}
Timeline: ${formData.timeline}
Experience level: ${formData.experience}
Tech preferences: ${getTechPreferencesString(formData.techPreferences)}

Generate 3 highly relevant questions for THIS SPECIFIC PROJECT.
Questions should be directly relevant (don't ask about payments for a calculator app).

Return ONLY a JSON array:
[
  {"question": "Question text?", "suggestions": ["Option 1", "Option 2", "Option 3", "Option 4"]},
  {"question": "Second question?", "suggestions": ["Option A", "Option B", "Option C"]},
  {"question": "Third question?", "suggestions": ["Choice 1", "Choice 2", "Choice 3"]}
]`;
        break;

      case "acknowledge_response":
        systemPrompt = `You are Bob, a friendly software architect. Acknowledge user responses naturally.`;
        userPrompt = `The user just answered your question.

Project: ${formData.project}
Your question: ${currentQuestion}
User's answer: ${userMessage}

Generate a brief (1-2 sentences) natural acknowledgment that:
1. Shows you understood their answer
2. Doesn't quote their response verbatim
3. Feels conversational
4. Optionally mentions which specialist agent will handle this (Security, Performance, Cost)

Be concise and natural.`;
        break;

      case "validate_project":
        systemPrompt = `You are a helpful AI that validates project descriptions.`;
        userPrompt = `Is this a valid software project description?

"${formData.project}"

Respond with JSON:
{"valid": true/false, "message": "optional friendly message if invalid"}

Valid: "e-commerce store", "mobile fitness app", "REST API", "dashboard"
Invalid: random letters, nonsense, single meaningless words

Return ONLY the JSON object.`;
        break;

      case "generate_architecture":
        const conversationText = conversationHistory?.map((msg: ChatMessage) => 
          `${msg.role === 'bot' ? 'Bob' : 'User'}: ${msg.content}`
        ).join('\n') || '';

        systemPrompt = `You are Bob, an expert software architect. Generate complete project architecture.`;
        userPrompt = `Based on this conversation, generate a complete project architecture.

PROJECT: ${formData.project}
Team: ${formData.teamSize}
Timeline: ${formData.timeline}
Experience: ${formData.experience}
Tech: ${getTechPreferencesString(formData.techPreferences)}

CONVERSATION:
${conversationText}

Generate architecture including file structure, rules, agent decisions, and tech stack.

IMPORTANT: Adapt to the project type:
- Python: use app/, tests/, requirements.txt
- React Native: use src/, android/, ios/
- Next.js: use App Router structure
- REST API: use backend structure

Return JSON:
{
  "projectName": "string",
  "fileStructure": {
    "name": "root-folder",
    "type": "folder",
    "children": [{"name": "src", "type": "folder", "children": [...]}]
  },
  "agentDecisions": [
    {"id": "security", "icon": "🛡️", "name": "Security Agent", "summary": ["point1", "point2"], "details": [{"title": "Auth", "items": ["item1"]}]}
  ],
  "architectureRules": [
    {"category": "Code Structure", "color": "bg-primary/10", "rules": ["rule1", "rule2"]}
  ],
  "techStack": {"frontend": "string", "backend": "string", "database": "string", "deployment": "string"},
  "toolRecommendations": [{"id": "lovable", "name": "Lovable", "icon": "💜", "purpose": "UI development", "reason": "Fast prototyping"}]
}

Return ONLY the JSON.`;
        break;

      case "chat_response":
        const historyText = conversationHistory?.map((msg: ChatMessage) => 
          `${msg.role === 'bot' ? 'Bob' : 'User'}: ${msg.content}`
        ).join('\n') || '';

        systemPrompt = `You are Bob, a friendly AI code architect. You're having a conversation about designing software architecture.`;
        userPrompt = `Conversation so far:
${historyText}

User says: ${userMessage}

Respond naturally and helpfully. Keep responses concise (2-4 sentences).`;
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("bob-ai error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

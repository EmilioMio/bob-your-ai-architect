import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
  projectType?: string;
  techPreferences?: {
    frontend: string[];
    backend: string[];
    database: string[];
    deployment: string[];
  };
}

function getTechPreferencesString(techPreferences?: ProjectFormData["techPreferences"]): string {
  if (!techPreferences) return "None specified";
  const all = [
    ...techPreferences.frontend,
    ...techPreferences.backend,
    ...techPreferences.database,
    ...techPreferences.deployment,
  ].filter(Boolean);
  return all.length > 0 ? all.join(", ") : "None specified";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, formData, conversationHistory, userMessage, currentQuestion, architecture } = await req.json();

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

      case "generate_architecture": {
        const conversationText =
          conversationHistory
            ?.map((msg: ChatMessage) => `${msg.role === "bot" ? "Bob" : "User"}: ${msg.content}`)
            .join("\n") || "";

        systemPrompt = `You are Bob, a senior software architect with 15+ years of experience designing production systems across all tech stacks - web, mobile, backend, desktop, and embedded systems.`;

        userPrompt = `CONVERSATION WITH USER:
${conversationText}

PROJECT DETAILS:
Title: ${formData.project}
Project Type: ${formData.projectType || "Not specified"}
Team Size: ${formData.teamSize}
Timeline: ${formData.timeline}
Experience Level: ${formData.experience}
Tech Preferences: ${getTechPreferencesString(formData.techPreferences)}

YOUR MISSION: Generate a COMPLETE, PRODUCTION-READY project architecture that is SPECIFIC to this exact project.

FIRST, ANALYZE THE PROJECT:
1. Is it web frontend, mobile, backend API, fullstack, or desktop?
2. What tech stack makes sense based on the conversation and preferences?
3. Does it need a database? What type (SQL vs NoSQL)?
4. What are the main features discussed?

GENERATE COMPREHENSIVE ARCHITECTURE:

1. FILE STRUCTURE - Adapt to project type:
   
   For WEB FRONTEND (React/Vue/Next/etc):
   - src/components/, pages/ or app/, hooks/, lib/, styles/
   
   For BACKEND API (Python/Node/Go):
   - app/ or src/, routes/ or routers/, controllers/, models/, services/, middleware/
   
   For MOBILE (React Native/Flutter):
   - src/screens/, components/, navigation/, services/, utils/
   
   For FULLSTACK:
   - Separate frontend/ and backend/ structures
   
   For DESKTOP (Electron/Tauri):
   - src/main/, renderer/, preload/, shared/

2. DATABASE SCHEMA (if project needs database):
   - Identify ALL tables/collections needed for the features discussed
   - Define columns with proper types
   - Define relationships (one-to-many, many-to-many)
   - Make it SPECIFIC to this project!

3. API ENDPOINTS (if applicable):
   - List actual endpoints this project needs
   - Format: METHOD /path - Purpose
   - Include auth requirements

4. AGENT DECISIONS - Spawn appropriate specialists:
   - Security Agent (if auth, payments, sensitive data)
   - Performance Agent (if high traffic, real-time)
   - Cost Agent (always - budget optimization)
   - Scalability Agent (if growth expected)
   - Mobile Agent (if mobile app)
   - Payment Agent (if e-commerce)
   
   Each agent gives SPECIFIC recommendations for THIS project!

5. ARCHITECTURE RULES:
   Rules MUST match the chosen tech stack:
   - For Python: "API routes in app/routers/", "Pydantic models"
   - For React Native: "Screens in src/screens/", "Navigation setup"
   - For Next.js: "Server components by default", "API routes in app/api/"

6. TECH STACK:
   Recommend specific technologies based on conversation.

7. TOOL RECOMMENDATIONS:
   Explain WHY each AI tool fits THIS specific project.

CRITICAL RULES:
- DO NOT default to Next.js for everything!
- If user wants Python API, give Python structure!
- If user wants mobile app, give mobile structure!
- Database schema must match actual features discussed!
- Agent recommendations must be project-specific!

OUTPUT FORMAT - Return ONLY this JSON structure (no markdown, no code blocks):

{
  "projectName": "Project Name",
  "projectType": "web|mobile|backend|fullstack|desktop",
  "summary": "Brief 2-sentence summary of the architecture design",
  
  "fileStructure": {
    "frontend": {
      "name": "frontend",
      "type": "folder",
      "description": "Frontend built with X",
      "children": [
        {"name": "src", "type": "folder", "children": [
          {"name": "components", "type": "folder", "description": "UI components", "fileCount": 12},
          {"name": "pages", "type": "folder", "description": "Route pages"}
        ]}
      ]
    },
    "backend": {
      "name": "backend",
      "type": "folder",
      "description": "Backend API built with X",
      "children": [
        {"name": "app", "type": "folder", "children": [
          {"name": "routers", "type": "folder", "description": "API routes"},
          {"name": "models", "type": "folder", "description": "Data models"}
        ]}
      ]
    }
  },
  
  "database": {
    "required": true,
    "type": "PostgreSQL",
    "description": "Relational database for X",
    "tables": [
      {
        "name": "users",
        "columns": [
          {"name": "id", "type": "UUID", "primaryKey": true},
          {"name": "email", "type": "VARCHAR(255)", "unique": true},
          {"name": "created_at", "type": "TIMESTAMP"}
        ]
      }
    ],
    "relationships": [
      {"from": "orders", "to": "users", "type": "many-to-one", "foreignKey": "user_id"}
    ]
  },
  
  "apiEndpoints": [
    {"method": "GET", "path": "/api/users", "purpose": "List all users", "auth": true},
    {"method": "POST", "path": "/api/auth/login", "purpose": "User login", "auth": false}
  ],
  
  "agentDecisions": [
    {
      "id": "security",
      "name": "Security Agent",
      "icon": "🔒",
      "summary": ["JWT authentication", "Rate limiting", "HTTPS only"],
      "details": [{"title": "Auth Strategy", "items": ["JWT in httpOnly cookies", "Refresh token rotation"]}],
      "reasoning": "For apps with user accounts, robust auth is critical.",
      "estimate": null
    },
    {
      "id": "cost",
      "name": "Cost Agent",
      "icon": "💰",
      "summary": ["Start with free tier", "Scale as needed"],
      "reasoning": "Minimize initial costs for small team.",
      "estimate": "$0-25/month initially"
    }
  ],
  
  "architectureRules": [
    {
      "category": "Component Organization",
      "color": "bg-primary",
      "rules": ["UI components in /components/ui/", "Max 200 lines per file"]
    },
    {
      "category": "API Design",
      "color": "bg-emerald-500",
      "rules": ["RESTful endpoints", "Input validation with Zod/Pydantic"]
    }
  ],
  
  "techStack": {
    "frontend": "Next.js 14 with TypeScript",
    "backend": "Python FastAPI",
    "database": "PostgreSQL",
    "authentication": "JWT with NextAuth.js",
    "deployment": "Vercel + Railway",
    "caching": "Redis (at scale)"
  },
  
  "toolRecommendations": [
    {"id": "lovable", "name": "Lovable", "icon": "🎨", "purpose": "UI development", "reason": "Fast UI prototyping for your components."},
    {"id": "cursor", "name": "Cursor AI", "icon": "💻", "purpose": "Backend logic", "reason": "Complex business logic implementation."}
  ],
  
  "tradeoffResolution": {
    "conflict": "Security vs Speed",
    "decision": "Modular Monolith",
    "reasoning": "Easier for your team size, can split later"
  }
}

IMPORTANT:
- Return ONLY valid JSON, no markdown formatting
- Ensure all JSON is properly escaped
- fileStructure.frontend and fileStructure.backend can be null if not applicable
- database can have required: false if no database needed
- Make everything SPECIFIC to the project discussed!`;
        break;
      }

      case "generate_scaffold_files": {
        const conversationText =
          conversationHistory
            ?.map((msg: ChatMessage) => `${msg.role === "bot" ? "Bob" : "User"}: ${msg.content}`)
            .join("\n") || "";

        systemPrompt = `You are Bob, a senior software engineer and architect. You generate minimal, runnable starter code for new projects. Output MUST be valid JSON only (no markdown, no backticks).`;

        userPrompt = `CONVERSATION:
      ${conversationText}
      
      PROJECT DETAILS:
      Title: ${formData.project}
      Project Type: ${formData.projectType || "Not specified"}
      Team Size: ${formData.teamSize}
      Timeline: ${formData.timeline}
      Experience: ${formData.experience}
      Tech Preferences: ${getTechPreferencesString(formData.techPreferences)}
      
      ARCHITECTURE JSON:
      ${JSON.stringify(architecture ?? {}, null, 2)}

      
      TASK:
      Generate real starter code files for this project so the user can start building immediately.
      
      OUTPUT FORMAT (JSON only):
      {
        "files": {
          "frontend/src/pages/Home.jsx": "...",
          "frontend/src/pages/Home.css": "...",
          "backend/src/index.ts": "...",
          "mobile/src/screens/HomeScreen.tsx": "..."
        }
      }
      
      RULES:
      - Return ONLY valid JSON. No markdown.
      - Generate 10–25 files max.
      - Paths MUST align with the architecture file tree where possible.
      - The code should be minimal and compile (or be very close).
      - Use file extensions appropriate to stack:
        - React/Vite: .jsx/.tsx + .css
        - Next.js: app/ structure + .tsx
        - React Native: .tsx + navigation + screen styles
        - Node/Express: .ts or .js based on architecture/stack
      - Include at least:
        WEB: App entry + router + 1–3 pages + basic styling
        MOBILE: App entry + navigation + 1–2 screens + styles
        BACKEND: server entry + /health route + example route + env example
      - Keep it short and practical. No giant boilerplate.
      
      Now output the JSON.`;
        break;
      }

      case "chat_response": {
        const historyText =
          conversationHistory
            ?.map((msg: ChatMessage) => `${msg.role === "bot" ? "Bob" : "User"}: ${msg.content}`)
            .join("\n") || "";

        systemPrompt = `You are Bob, a friendly AI code architect. You're having a conversation about designing software architecture.`;
        userPrompt = `Conversation so far:
${historyText}

User says: ${userMessage}

Respond naturally and helpfully. Keep responses concise (2-4 sentences).`;
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`Processing action: ${action}`);

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

    console.log(`Action ${action} completed successfully`);

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

export interface ProjectFormData {
  project: string;
  teamSize: string;
  timeline: string;
  experience: string;
  projectType: string;
  techPreferences: {
    frontend: string[];
    backend: string[];
    database: string[];
    deployment: string[];
  };
}

export interface Agent {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'analyzing' | 'active' | 'complete';
}

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  agentConsulting?: string;
}

export interface ArchitectureFile {
  name: string;
  type: 'folder' | 'file';
  children?: ArchitectureFile[];
  agentBadge?: string;
  description?: string;
  fileCount?: number;
}

export interface AgentDecision {
  agentId: string;
  agentName: string;
  agentIcon: string;
  title: string;
  summary: string[];
  details?: {
    title: string;
    items: string[];
    files?: string[];
  }[];
}

export interface ArchitectureRule {
  category: string;
  color: string;
  icon?: string;
  rules: string[];
}

export interface ToolRecommendation {
  id: string;
  name: string;
  icon: string;
  purpose: string;
  reason: string;
  action: string;
}

export type BuilderStep = 'input' | 'analyzing' | 'chat' | 'architecture';

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

export interface DatabaseColumn {
  name: string;
  type: string;
  primaryKey?: boolean;
  unique?: boolean;
  foreignKey?: string;
  nullable?: boolean;
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
  description?: string;
}

export interface DatabaseRelationship {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  foreignKey: string;
}

export interface DatabaseSchema {
  required: boolean;
  type: string;
  description: string;
  tables: DatabaseTable[];
  relationships: DatabaseRelationship[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  purpose: string;
  auth: boolean;
}

export interface AgentDecision {
  id: string;
  name: string;
  icon: string;
  summary: string[];
  details?: {
    title: string;
    items: string[];
    files?: string[];
  }[];
  reasoning?: string;
  estimate?: string | null;
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
  action?: string;
}

export interface TechStack {
  frontend?: string;
  backend?: string;
  database?: string;
  authentication?: string;
  deployment?: string;
  caching?: string;
  storage?: string;
}

export interface TradeoffResolution {
  conflict: string;
  decision: string;
  reasoning: string;
}

export interface GeneratedArchitecture {
  projectName: string;
  projectType: 'web' | 'mobile' | 'backend' | 'fullstack' | 'desktop';
  summary: string;
  fileStructure: {
    frontend?: ArchitectureFile;
    backend?: ArchitectureFile;
    mobile?: ArchitectureFile;
  };
  database?: DatabaseSchema;
  apiEndpoints?: ApiEndpoint[];
  agentDecisions: AgentDecision[];
  architectureRules: ArchitectureRule[];
  techStack: TechStack;
  toolRecommendations: ToolRecommendation[];
  tradeoffResolution?: TradeoffResolution;
}

export type BuilderStep = 'input' | 'analyzing' | 'chat' | 'architecture';

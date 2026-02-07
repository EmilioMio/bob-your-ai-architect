import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronRight, FolderTree, FileCode, Shield, Zap, 
  Coins, Settings, Download, Copy, ExternalLink, ArrowLeft,
  Check, Lightbulb, Scale, Target, Loader2, X
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProjectFormData, Agent, ChatMessage } from './types';

interface ArchitectureProposalProps {
  formData: ProjectFormData;
  agents: Agent[];
  conversationHistory: ChatMessage[];
  onBack: () => void;
}

// File tree structure
const generateFileTree = (projectName: string) => ({
  name: projectName.toLowerCase().replace(/\s+/g, '-'),
  type: 'folder' as const,
  children: [
    {
      name: 'src',
      type: 'folder' as const,
      fileCount: 45,
      children: [
        {
          name: 'app',
          type: 'folder' as const,
          description: 'Next.js routes',
          children: [
            { name: '(auth)', type: 'folder' as const, children: [
              { name: 'login', type: 'folder' as const },
              { name: 'register', type: 'folder' as const },
            ]},
            { name: '(dashboard)', type: 'folder' as const, children: [
              { name: 'analytics', type: 'folder' as const },
              { name: 'settings', type: 'folder' as const },
              { name: 'page.tsx', type: 'file' as const },
            ]},
            { name: 'api', type: 'folder' as const, children: [
              { name: 'auth', type: 'folder' as const },
              { name: 'analytics', type: 'folder' as const },
            ]},
          ],
        },
        {
          name: 'components',
          type: 'folder' as const,
          children: [
            { name: 'ui', type: 'folder' as const, description: '12 reusable UI components', fileCount: 12 },
            { name: 'features', type: 'folder' as const, description: 'Feature-specific components', fileCount: 8 },
          ],
        },
        {
          name: 'lib',
          type: 'folder' as const,
          children: [
            { name: 'api', type: 'folder' as const, children: [{ name: 'client.ts', type: 'file' as const }] },
            { name: 'auth', type: 'folder' as const, agentBadge: '🔒', children: [
              { name: 'session.ts', type: 'file' as const },
              { name: 'rbac.ts', type: 'file' as const, agentBadge: '🔒' },
            ]},
            { name: 'db', type: 'folder' as const, children: [
              { name: 'client.ts', type: 'file' as const },
              { name: 'schema.ts', type: 'file' as const },
            ]},
            { name: 'utils.ts', type: 'file' as const },
          ],
        },
        {
          name: 'hooks',
          type: 'folder' as const,
          children: [
            { name: 'useAuth.ts', type: 'file' as const },
            { name: 'useAnalytics.ts', type: 'file' as const },
            { name: 'useRBAC.ts', type: 'file' as const, agentBadge: '🔒' },
          ],
        },
      ],
    },
    { name: 'public', type: 'folder' as const, children: [{ name: 'images', type: 'folder' as const }] },
    { name: '.env.example', type: 'file' as const },
    { name: 'package.json', type: 'file' as const },
    { name: 'tsconfig.json', type: 'file' as const },
    { name: 'next.config.js', type: 'file' as const },
  ],
});

const agentDecisions = [
  {
    id: 'security',
    icon: '🔒',
    name: 'Security Agent',
    summary: ['Role-Based Access Control (RBAC)', 'JWT with refresh tokens', 'Environment-based secret management'],
    details: [
      { title: 'RBAC Implementation', items: ['Middleware in /src/lib/auth/rbac.ts', 'Roles: admin, editor, viewer', 'Permission checks on API routes'], files: ['/src/lib/auth/rbac.ts', '/src/middleware.ts'] },
      { title: 'JWT Authentication', items: ['Access token: 15min expiry', 'Refresh token: 7 day expiry', 'HttpOnly cookies for security'] },
    ],
  },
  {
    id: 'performance',
    icon: '⚡',
    name: 'Performance Agent',
    summary: ['Server Components by default', 'Redis caching for analytics', 'Dynamic imports for charts'],
    details: [
      { title: 'Rendering Strategy', items: ['Server Components for data fetching', 'Client Components only for interactivity', 'Streaming for long-running queries'] },
    ],
  },
  {
    id: 'cost',
    icon: '💰',
    name: 'Cost Agent',
    summary: ['PostgreSQL on Supabase (free tier → $25/mo)', 'Vercel hosting (free tier covers MVP)', 'Redis caching only after 1000+ users'],
    estimate: '$0-25/month for first 6 months',
  },
  {
    id: 'structure',
    icon: '📁',
    name: 'Structure Agent',
    summary: ['Feature-based organization', 'Colocation of related code', 'Clear separation: UI vs Business Logic'],
  },
];

const architectureRules = [
  {
    category: 'Component Rules',
    color: 'bg-primary',
    rules: [
      'UI components → /src/components/ui/',
      'Feature components → /src/components/features/',
      'Max 200 lines per component',
      'One component per file',
    ],
  },
  {
    category: 'Business Logic Rules',
    color: 'bg-emerald-500',
    rules: [
      'API calls only in /src/lib/api/',
      'Database queries in /src/lib/db/',
      'No business logic in components',
    ],
  },
  {
    category: 'Authentication Rules',
    color: 'bg-purple-500',
    icon: '🔒',
    rules: [
      'Session management in /src/lib/auth/',
      'RBAC checks via middleware',
      'No inline permission checks',
    ],
  },
  {
    category: 'Naming Conventions',
    color: 'bg-slate-500',
    rules: [
      'Components: PascalCase',
      'Utilities: camelCase',
      'Hooks: must start with "use"',
      'API routes: kebab-case',
    ],
  },
];

const toolRecommendations = [
  { id: 'lovable', name: 'Lovable.dev', icon: '🎨', purpose: 'UI component scaffolding', reason: 'Your dashboard needs 12 UI components. Lovable excels at rapid UI generation.', action: 'Generate UI with Lovable' },
  { id: 'cursor', name: 'Cursor AI', icon: '💻', purpose: 'API routes and business logic', reason: 'Complex RBAC and analytics logic benefits from Cursor\'s code generation.', action: 'Set up Cursor' },
  { id: 'copilot', name: 'GitHub Copilot', icon: '🧪', purpose: 'Test generation', reason: 'Your 12 planned tests can be auto-generated from the architecture.', action: 'Generate tests' },
];

interface FileTreeNode {
  name: string;
  type: 'folder' | 'file';
  children?: FileTreeNode[];
  agentBadge?: string;
  description?: string;
  fileCount?: number;
}

interface TreeNodeProps {
  node: FileTreeNode;
  depth?: number;
}

function TreeNode({ node, depth = 0 }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1.5 py-1 px-1 rounded hover:bg-muted/50 cursor-pointer text-sm ${
          depth === 0 ? 'font-medium' : ''
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <span className="w-3.5" />
        )}
        
        {node.type === 'folder' ? (
          <FolderTree className="w-4 h-4 text-primary" />
        ) : (
          <FileCode className="w-4 h-4 text-muted-foreground" />
        )}
        
        <span className="text-foreground">{node.name}</span>
        
        {node.agentBadge && (
          <span className="text-xs">{node.agentBadge}</span>
        )}
        
        {node.fileCount && (
          <span className="text-xs text-muted-foreground">({node.fileCount})</span>
        )}
      </div>
      
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {node.children!.map((child, idx) => (
              <TreeNode key={`${child.name}-${idx}`} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Generate file contents for the zip
const generateFileContents = (projectName: string, formData: ProjectFormData) => {
  const safeName = projectName.toLowerCase().replace(/\s+/g, '-');
  
  return {
    'README.md': `# ${projectName}

## Project Overview
${formData.project}

## Team
- Size: ${formData.teamSize}
- Experience: ${formData.experience}
- Timeline: ${formData.timeline}

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Architecture
This project follows a modular monolith architecture with feature-based organization.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architectural guidelines.

## Tech Stack
- Frontend: Next.js 14 (App Router), React, TypeScript
- Styling: Tailwind CSS
- Database: PostgreSQL (Supabase)
- Auth: NextAuth.js with JWT
- Deployment: Vercel
`,
    'ARCHITECTURE.md': `# Architecture Guidelines

## File Structure Rules

### Component Rules
- UI components → /src/components/ui/
- Feature components → /src/components/features/
- Max 200 lines per component
- One component per file

### Business Logic Rules
- API calls only in /src/lib/api/
- Database queries in /src/lib/db/
- No business logic in components

### Authentication Rules
- Session management in /src/lib/auth/
- RBAC checks via middleware
- No inline permission checks

### Naming Conventions
- Components: PascalCase
- Utilities: camelCase
- Hooks: must start with "use"
- API routes: kebab-case

## Security Considerations
- Role-Based Access Control (RBAC)
- JWT with refresh tokens
- Environment-based secret management

## Performance Guidelines
- Server Components by default
- Redis caching for analytics (at scale)
- Dynamic imports for heavy libraries
`,
    'package.json': JSON.stringify({
      name: safeName,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        next: '^14.0.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        typescript: '^5.0.0',
        '@tanstack/react-query': '^5.0.0',
        'next-auth': '^4.24.0',
        tailwindcss: '^3.4.0',
        zod: '^3.22.0',
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        eslint: '^8.0.0',
        'eslint-config-next': '^14.0.0',
      },
    }, null, 2),
    '.env.example': `# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
`,
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    }, null, 2),
    'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
`,
    'src/app/layout.tsx': `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '${projectName}',
  description: '${formData.project}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`,
    'src/app/page.tsx': `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">${projectName}</h1>
      <p className="text-gray-600">Your project is ready to go!</p>
    </main>
  );
}
`,
    'src/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}
`,
    'src/lib/utils.ts': `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
    'src/lib/api/client.ts': `// API client for making requests
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(\`\${API_BASE}\${endpoint}\`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(\`API error: \${response.status}\`);
  }

  return response.json();
}
`,
    'src/lib/auth/session.ts': `// Session management utilities
import { getServerSession } from 'next-auth';

export async function getSession() {
  return await getServerSession();
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
}
`,
    'src/hooks/useAuth.ts': `'use client';

import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
`,
  };
};

export function ArchitectureProposal({ formData, agents, onBack }: ArchitectureProposalProps) {
  const [expandedAgents, setExpandedAgents] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const projectName = formData.project.split(' ').slice(0, 3).join(' ');
  const fileTree = generateFileTree(projectName);

  const toggleAgent = (id: string) => {
    setExpandedAgents(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleCopyRules = () => {
    const rulesText = architectureRules.map(cat => 
      `## ${cat.category}\n${cat.rules.map(r => `- ${r}`).join('\n')}`
    ).join('\n\n');
    navigator.clipboard.writeText(rulesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateFiles = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const zip = new JSZip();
      const files = generateFileContents(projectName, formData);
      const fileEntries = Object.entries(files);
      
      // Simulate progress
      for (let i = 0; i < fileEntries.length; i++) {
        const [path, content] = fileEntries[i];
        zip.file(path, content);
        setGenerationProgress(Math.round(((i + 1) / fileEntries.length) * 100));
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' });
      const safeName = projectName.toLowerCase().replace(/\s+/g, '-');
      saveAs(blob, `${safeName}-project.zip`);
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error generating files:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleExportArchitecture = () => {
    const safeName = projectName.toLowerCase().replace(/\s+/g, '-');
    
    // Export JSON
    const architectureData = {
      projectName,
      formData,
      fileTree,
      agentDecisions,
      architectureRules,
      toolRecommendations,
      generatedAt: new Date().toISOString(),
    };
    
    const jsonBlob = new Blob([JSON.stringify(architectureData, null, 2)], { type: 'application/json' });
    saveAs(jsonBlob, `${safeName}-architecture.json`);

    // Export Markdown
    const mdContent = `# ${projectName} - Architecture Documentation

## Project Details
- **Description**: ${formData.project}
- **Team Size**: ${formData.teamSize}
- **Timeline**: ${formData.timeline}
- **Experience Level**: ${formData.experience}

## Agent Recommendations

${agentDecisions.map(agent => `### ${agent.icon} ${agent.name}
${agent.summary.map(s => `- ${s}`).join('\n')}
${agent.estimate ? `\n**Estimate**: ${agent.estimate}` : ''}`).join('\n\n')}

## Architectural Rules

${architectureRules.map(cat => `### ${cat.category} ${cat.icon || ''}
${cat.rules.map(r => `- ${r}`).join('\n')}`).join('\n\n')}

## Recommended Tools

${toolRecommendations.map(tool => `### ${tool.icon} ${tool.name}
- **Purpose**: ${tool.purpose}
- **Why**: ${tool.reason}`).join('\n\n')}

---
*Generated by Bob the Architect on ${new Date().toLocaleDateString()}*
`;

    const mdBlob = new Blob([mdContent], { type: 'text/markdown' });
    saveAs(mdBlob, `${safeName}-architecture.md`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Your Custom Architecture
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Designed by Bob's specialist team for your {formData.teamSize} team, {formData.timeline.replace('-', ' to ')} project
          </p>
        </div>
        <button onClick={onBack} className="btn-ghost text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Chat
        </button>
      </div>

      {/* Three Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Panel 1: File Structure */}
        <div className="lg:col-span-1 card-elevated p-4 max-h-[500px] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-primary" />
              File Structure
            </h3>
          </div>
          <div className="overflow-y-auto flex-1 -mr-2 pr-2">
            <TreeNode node={fileTree} />
          </div>
        </div>

        {/* Panel 2: Agent Decisions */}
        <div className="lg:col-span-1 card-elevated p-4 max-h-[500px] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Agent Decisions
            </h3>
          </div>
          <div className="overflow-y-auto flex-1 space-y-3 -mr-2 pr-2">
            {agentDecisions.map((agent) => (
              <div key={agent.id} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleAgent(agent.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{agent.icon}</span>
                    <span className="font-medium text-sm text-foreground">{agent.name}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedAgents.includes(agent.id) ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {expandedAgents.includes(agent.id) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 pt-0 space-y-2">
                        {agent.summary.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                        {agent.estimate && (
                          <div className="mt-2 pt-2 border-t border-border text-xs text-primary font-medium">
                            Est. cost: {agent.estimate}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Trade-off Resolution */}
            <div className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-sm text-foreground">Trade-off Resolution</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Security Agent recommended microservices; Cost Agent recommended monolith. 
                <span className="text-foreground font-medium"> Bob's decision: Modular Monolith</span> — 
                easier for your team size, can split later.
              </p>
            </div>
          </div>
        </div>

        {/* Panel 3: Rules & Tools */}
        <div className="lg:col-span-1 card-elevated p-4 max-h-[500px] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Rules & Tools
            </h3>
            <button
              onClick={handleCopyRules}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="overflow-y-auto flex-1 space-y-4 -mr-2 pr-2">
            {/* Rules */}
            <div className="space-y-3">
              {architectureRules.map((category) => (
                <div key={category.category} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${category.color}`} />
                    <span className="text-xs font-medium text-foreground">
                      {category.category} {category.icon}
                    </span>
                  </div>
                  {category.rules.map((rule, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground pl-4">
                      ✓ {rule}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-medium text-foreground mb-3">Recommended Tools</h4>
              <div className="space-y-2">
                {toolRecommendations.map((tool) => (
                  <div key={tool.id} className="p-2 rounded-lg border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{tool.icon}</span>
                      <span className="text-xs font-medium text-foreground">{tool.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{tool.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          className="flex-1 btn-primary py-4 text-lg group disabled:opacity-70"
          whileHover={{ scale: isGenerating ? 1 : 1.01 }}
          whileTap={{ scale: isGenerating ? 1 : 0.99 }}
          onClick={handleGenerateFiles}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating... {generationProgress}%
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Generate Project Files
            </>
          )}
        </motion.button>
        <button 
          className="btn-ghost px-6"
          onClick={handleExportArchitecture}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Export Architecture
        </button>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">✅ Project Generated!</h3>
                <button onClick={() => setShowSuccessModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Your "{projectName}" project has been downloaded. Push it to GitHub in 3 steps:
              </p>
              
              <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 font-medium">1</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Create a new repository</p>
                    <p className="text-xs text-muted-foreground">Click the button below to open GitHub</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 font-medium">2</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Unzip & drag files</p>
                    <p className="text-xs text-muted-foreground">Unzip the download, then drag all files into the new repo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 font-medium">3</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Commit changes</p>
                    <p className="text-xs text-muted-foreground">Click "Commit changes" and you're done!</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  💡 <strong>Pro tip:</strong> After creating the repo, click "uploading an existing file" on the empty repo page, then drag your unzipped folder contents directly into the browser.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={`https://github.com/new?name=${encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-'))}&description=${encodeURIComponent(formData.project)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Create Repository on GitHub
                </a>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full btn-ghost text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

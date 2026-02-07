import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronRight, FolderTree, FileCode, Shield, Zap, 
  Coins, Settings, Download, Copy, ExternalLink, ArrowLeft,
  Check, Lightbulb, Scale, Target
} from 'lucide-react';
import { ProjectFormData, Agent } from './types';

interface ArchitectureProposalProps {
  formData: ProjectFormData;
  agents: Agent[];
  onBack: () => void;
}

// File tree structure
const generateFileTree = () => ({
  name: 'analytics-dashboard',
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

export function ArchitectureProposal({ formData, agents, onBack }: ArchitectureProposalProps) {
  const [expandedAgents, setExpandedAgents] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const fileTree = generateFileTree();

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
          className="flex-1 btn-primary py-4 text-lg group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Download className="w-5 h-5 mr-2" />
          Generate Project Files
        </motion.button>
        <button className="btn-ghost px-6">
          <ExternalLink className="w-4 h-4 mr-2" />
          Export Architecture
        </button>
      </div>
    </motion.div>
  );
}

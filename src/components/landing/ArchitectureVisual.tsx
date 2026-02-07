import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, FileCode, Check, Download, RefreshCw,
  Palette, Cpu, GitBranch, Shield
} from 'lucide-react';

interface FileItem {
  name: string;
  type: string;
  color: string;
  badge?: string;
  children?: FileItem[];
}

const fileStructure: FileItem[] = [
  { name: 'src', type: 'folder', color: 'ui', children: [
    { name: 'app', type: 'folder', color: 'ui', children: [
      { name: '(auth)', type: 'folder', color: 'config' },
      { name: '(dashboard)', type: 'folder', color: 'ui' },
      { name: 'layout.tsx', type: 'file', color: 'ui' },
    ]},
    { name: 'components', type: 'folder', color: 'ui', badge: '20 files', children: [
      { name: 'ui', type: 'folder', color: 'ui' },
      { name: 'features', type: 'folder', color: 'logic' },
    ]},
    { name: 'lib', type: 'folder', color: 'logic', children: [
      { name: 'api', type: 'folder', color: 'logic' },
      { name: 'auth', type: 'folder', color: 'config' },
      { name: 'utils.ts', type: 'file', color: 'tools' },
    ]},
    { name: 'hooks', type: 'folder', color: 'logic' },
  ]},
  { name: 'public', type: 'folder', color: 'tools' },
  { name: 'package.json', type: 'file', color: 'tools' },
  { name: 'tsconfig.json', type: 'file', color: 'tools' },
];

const rules = [
  'Components must live in /src/components/[ui|features]',
  'API calls only in /src/lib/api',
  'Custom hooks in /src/hooks with \'use\' prefix',
  'No direct DOM manipulation in components',
  'Max component file size: 200 lines',
];

const agents = [
  { name: 'Lovable', task: 'UI scaffolding & components', icon: Palette, color: 'bg-pink-500' },
  { name: 'Cursor', task: 'Backend API & business logic', icon: Cpu, color: 'bg-purple-500' },
  { name: 'GitHub Copilot', task: 'Test generation', icon: GitBranch, color: 'bg-secondary' },
];

interface ArchitectureVisualProps {
  onBack: () => void;
}

export function ArchitectureVisual({ onBack }: ArchitectureVisualProps) {
  const [viewMode, setViewMode] = useState<'visual' | 'tree'>('tree');
  const [experienceMode, setExperienceMode] = useState<'beginner' | 'expert'>('expert');

  const colorMap = {
    ui: 'text-primary border-primary/30 bg-primary/5',
    logic: 'text-accent border-accent/30 bg-accent/5',
    config: 'text-code-keyword border-code-keyword/30 bg-code-keyword/5',
    tools: 'text-muted-foreground border-muted-foreground/30 bg-muted-foreground/5',
  };

  const renderTree = (items: FileItem[], depth = 0): JSX.Element => (
    <div className={`${depth > 0 ? 'ml-4 border-l border-border pl-4' : ''}`}>
      {items.map((item, idx) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: idx * 0.05 + depth * 0.1 }}
          className="py-1"
        >
          <div className={`flex items-center gap-2 px-2 py-1 rounded-md ${colorMap[item.color as keyof typeof colorMap]}`}>
            {item.type === 'folder' ? (
              <FolderOpen className="w-4 h-4" />
            ) : (
              <FileCode className="w-4 h-4" />
            )}
            <span className="text-sm font-mono">{item.name}</span>
            {item.badge && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-background border border-border">
                {item.badge}
              </span>
            )}
          </div>
          {item.children && renderTree(item.children, depth + 1)}
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Your Architecture</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'visual' ? 'tree' : 'visual')}
            className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors"
          >
            {viewMode === 'visual' ? 'Tree View' : 'Visual View'}
          </button>
        </div>
      </div>

      {/* File Structure */}
      <div className="bg-muted/30 rounded-lg p-4 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground">saas-analytics-dashboard/</span>
        </div>
        {renderTree(fileStructure)}
      </div>

      {/* Architectural Rules */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-muted/30 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-foreground">Your Architectural Rules</h4>
        </div>
        <ul className="space-y-2">
          {rules.map((rule, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              {rule}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Multi-Agent Orchestration */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-muted/30 rounded-lg p-4"
      >
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          🤝 Bob recommends delegating:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {agents.map((agent, idx) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border"
            >
              <div className={`w-8 h-8 rounded-lg ${agent.color} flex items-center justify-center`}>
                <agent.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.task}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Experience Level Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
      >
        <span className="text-sm font-medium text-foreground">Complexity:</span>
        <div className="flex items-center bg-background rounded-lg border border-border p-1">
          {(['beginner', 'expert'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setExperienceMode(mode)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                experienceMode === mode
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {experienceMode === 'beginner' 
            ? 'More comments, simpler patterns' 
            : 'Clean architecture, DDD patterns'}
        </span>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="btn-ghost flex-1">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refine Architecture
        </button>
        <button className="btn-primary flex-1 group">
          <Download className="mr-2 h-4 w-4" />
          Generate Project Files
        </button>
      </div>
    </div>
  );
}

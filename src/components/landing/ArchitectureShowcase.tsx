import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, FileCode, Check } from 'lucide-react';

const projects = {
  'nextjs-saas': {
    name: 'Next.js SaaS',
    structure: [
      { name: 'src', children: [
        { name: 'app', children: [
          { name: '(auth)', children: [
            { name: 'login', children: [] },
            { name: 'register', children: [] },
          ]},
          { name: '(dashboard)', children: [
            { name: 'layout.tsx', file: true },
            { name: 'page.tsx', file: true },
          ]},
          { name: 'layout.tsx', file: true },
        ]},
        { name: 'components', badge: '20 files', children: [
          { name: 'ui', badge: '12', children: [] },
          { name: 'features', badge: '8', children: [] },
        ]},
        { name: 'lib', children: [
          { name: 'api', children: [] },
          { name: 'auth', children: [] },
          { name: 'utils.ts', file: true },
        ]},
        { name: 'hooks', children: [] },
      ]},
      { name: 'public', children: [] },
      { name: 'package.json', file: true },
      { name: 'tsconfig.json', file: true },
    ],
    explanation: {
      why: 'Next.js 14 App Router with route groups for auth flow',
      points: [
        'Component separation: ui (reusable) vs features (domain-specific)',
        'Centralized API calls in /lib/api for easy mocking',
        'Custom hooks isolated for testability',
      ],
      rules: [
        'Server components by default',
        'Client components only when needed',
        'No business logic in page files',
        'Consistent naming conventions',
      ],
    },
  },
  'react-native': {
    name: 'React Native App',
    structure: [
      { name: 'src', children: [
        { name: 'screens', badge: '8 screens', children: [
          { name: 'auth', children: [] },
          { name: 'home', children: [] },
          { name: 'profile', children: [] },
        ]},
        { name: 'components', badge: '15 files', children: [
          { name: 'ui', children: [] },
          { name: 'forms', children: [] },
        ]},
        { name: 'navigation', children: [
          { name: 'RootNavigator.tsx', file: true },
          { name: 'AuthNavigator.tsx', file: true },
        ]},
        { name: 'services', children: [
          { name: 'api.ts', file: true },
          { name: 'storage.ts', file: true },
        ]},
        { name: 'hooks', children: [] },
        { name: 'utils', children: [] },
      ]},
      { name: 'assets', children: [] },
      { name: 'app.json', file: true },
    ],
    explanation: {
      why: 'Feature-based screen organization with React Navigation',
      points: [
        'Clear navigation hierarchy with typed routes',
        'Shared UI components separate from screen-specific',
        'Services layer for all external interactions',
      ],
      rules: [
        'Screens only orchestrate, no business logic',
        'All API calls through services layer',
        'Typed navigation params',
        'Platform-specific code isolated',
      ],
    },
  },
  'python-api': {
    name: 'Python API',
    structure: [
      { name: 'src', children: [
        { name: 'api', children: [
          { name: 'routes', children: [
            { name: 'users.py', file: true },
            { name: 'auth.py', file: true },
          ]},
          { name: 'deps.py', file: true },
        ]},
        { name: 'core', children: [
          { name: 'config.py', file: true },
          { name: 'security.py', file: true },
        ]},
        { name: 'models', children: [] },
        { name: 'schemas', children: [] },
        { name: 'services', children: [] },
        { name: 'main.py', file: true },
      ]},
      { name: 'tests', children: [] },
      { name: 'pyproject.toml', file: true },
      { name: 'Dockerfile', file: true },
    ],
    explanation: {
      why: 'FastAPI with clean architecture principles',
      points: [
        'Route handlers thin, services contain logic',
        'Pydantic schemas for validation and serialization',
        'Dependency injection for testability',
      ],
      rules: [
        'No ORM queries in routes',
        'All env vars through config',
        'Async by default',
        'Type hints everywhere',
      ],
    },
  },
  'monorepo': {
    name: 'Full-stack Monorepo',
    structure: [
      { name: 'apps', children: [
        { name: 'web', badge: 'Next.js', children: [] },
        { name: 'api', badge: 'Express', children: [] },
        { name: 'mobile', badge: 'Expo', children: [] },
      ]},
      { name: 'packages', children: [
        { name: 'ui', badge: 'shared', children: [] },
        { name: 'utils', children: [] },
        { name: 'types', children: [] },
        { name: 'config', children: [] },
      ]},
      { name: 'turbo.json', file: true },
      { name: 'package.json', file: true },
      { name: 'pnpm-workspace.yaml', file: true },
    ],
    explanation: {
      why: 'Turborepo with pnpm for optimal DX and build caching',
      points: [
        'Shared packages for code reuse across apps',
        'Independent deployment per app',
        'Centralized TypeScript and ESLint configs',
      ],
      rules: [
        'No cross-app imports, use packages',
        'Shared types in @repo/types',
        'UI components in @repo/ui',
        'Environment-specific configs only',
      ],
    },
  },
};

type ProjectKey = keyof typeof projects;

export function ArchitectureShowcase() {
  const [activeTab, setActiveTab] = useState<ProjectKey>('nextjs-saas');
  const project = projects[activeTab];

  const renderTree = (items: any[], depth = 0): JSX.Element => (
    <div className={depth > 0 ? 'ml-4' : ''}>
      {items.map((item, idx) => (
        <div key={item.name} className="py-0.5">
          <div className="flex items-center gap-2 text-sm font-mono">
            {depth > 0 && (
              <span className="text-border">
                {idx === items.length - 1 ? '└── ' : '├── '}
              </span>
            )}
            {item.file ? (
              <FileCode className="w-4 h-4 text-muted-foreground" />
            ) : (
              <FolderOpen className="w-4 h-4 text-primary" />
            )}
            <span className={item.file ? 'text-muted-foreground' : 'text-foreground'}>
              {item.name}
            </span>
            {item.badge && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {item.badge}
              </span>
            )}
          </div>
          {item.children && item.children.length > 0 && renderTree(item.children, depth + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="section-container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See what Bob creates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production-ready architectures for every stack
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(Object.keys(projects) as ProjectKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {projects[key].name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto"
          >
            {/* File Structure */}
            <div className="card-elevated p-6 bg-muted/20">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <span className="text-sm font-mono text-muted-foreground">
                  {activeTab === 'nextjs-saas' && 'my-saas-app/'}
                  {activeTab === 'react-native' && 'fitness-app/'}
                  {activeTab === 'python-api' && 'fastapi-service/'}
                  {activeTab === 'monorepo' && 'company-platform/'}
                </span>
              </div>
              {renderTree(project.structure)}
            </div>

            {/* Explanation */}
            <div className="space-y-6">
              <div className="card-elevated p-6">
                <h4 className="font-semibold text-foreground mb-3">Why this structure?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.explanation.why}
                </p>
                <ul className="space-y-2">
                  {project.explanation.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-elevated p-6">
                <h4 className="font-semibold text-foreground mb-3">Rules enforced:</h4>
                <ul className="space-y-2">
                  {project.explanation.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

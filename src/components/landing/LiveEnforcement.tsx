import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, Zap, X, ArrowRight, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type ScenarioType = 'standard' | 'scalability';

interface Scenario {
  id: string;
  title: string;
  badCode: string;
  warning: {
    title: string;
    message: string;
  };
  rule: string;
  fixedCode: string;
  type?: ScenarioType;
  fixButtonText?: string;
  whyItMatters?: string;
}

const scenarios: Scenario[] = [
  {
    id: 'api-call',
    title: 'Direct API call in component',
    badCode: `// src/UserProfile.jsx
function UserProfile() {
  const [data, setData] = useState(null);
  
  // Direct API call - wrong pattern!
  fetch('/api/user').then(res => setData(res));
  
  return <div>{data?.name}</div>;
}`,
    warning: {
      title: 'Bob caught something',
      message: 'API calls should be in /src/lib/api/\nThis keeps your components pure and testable.',
    },
    rule: 'API calls only in /src/lib/api/',
    fixedCode: `// src/lib/api/userApi.js
export const fetchUser = async () => {
  const res = await fetch('/api/user');
  return res.json();
};

// src/UserProfile.jsx
import { fetchUser } from '@/lib/api/userApi';
import { useQuery } from '@tanstack/react-query';

function UserProfile() {
  const { data } = useQuery(['user'], fetchUser);
  return <div>{data?.name}</div>;
}`,
    type: 'standard',
  },
  {
    id: 'wrong-location',
    title: 'Component outside /components',
    badCode: `// src/pages/Dashboard/UserCard.jsx
// ❌ Component in wrong location!

function UserCard({ user }) {
  return (
    <div className="card">
      <img src={user.avatar} />
      <h3>{user.name}</h3>
    </div>
  );
}`,
    warning: {
      title: 'Bob caught something',
      message: 'Components belong in /src/components/\nThis maintains a clean separation of concerns.',
    },
    rule: 'Components should be in /src/components/',
    fixedCode: `// src/components/features/UserCard.jsx
// ✓ Moved to correct location

function UserCard({ user }) {
  return (
    <div className="card">
      <img src={user.avatar} />
      <h3>{user.name}</h3>
    </div>
  );
}`,
    type: 'standard',
  },
  {
    id: 'large-file',
    title: '300+ line component file',
    badCode: `// src/components/Dashboard.jsx
// 📄 312 lines - exceeds 200 line limit

function Dashboard() {
  // ... massive component with
  // multiple responsibilities
  // poor separation of concerns
  // hard to test and maintain
  
  return (
    <div>
      {/* Everything crammed here */}
    </div>
  );
}`,
    warning: {
      title: 'Bob caught something',
      message: 'Component exceeds 200 lines (currently 312)\nConsider splitting into smaller, focused components.',
    },
    rule: 'Max 200 lines per component',
    fixedCode: `// src/components/features/Dashboard/
// ├── index.jsx (42 lines)
// ├── DashboardHeader.jsx (65 lines)
// ├── DashboardStats.jsx (58 lines)
// ├── DashboardChart.jsx (72 lines)
// └── DashboardTable.jsx (75 lines)

// Each component is now focused,
// testable, and maintainable! ✓`,
    type: 'standard',
  },
  {
    id: 'future-proof',
    title: 'Future-Proof Analysis',
    badCode: `// src/services/UserService.js
async function syncAllUsers() {
  const users = await db.query('SELECT * FROM users');
  
  // Potential bottleneck detected at 10k+ users
  for (const user of users) {
    // Synchronous API call without caching
    const profile = await fetch(\`/api/profile/\${user.id}\`);
    const analytics = await fetch(\`/api/analytics/\${user.id}\`);
    
    await db.query(
      'UPDATE users SET profile = ?, analytics = ?',
      [profile, analytics]
    );
  }
  
  return { synced: users.length };
}`,
    warning: {
      title: 'Bob detected a scaling risk',
      message: 'This pattern will cause database locks once you hit ~1,200 concurrent users. Tomorrow\'s target is 10,000.',
    },
    rule: 'Batch operations for scale',
    fixedCode: `// src/services/UserService.js
import { cache } from '@/lib/cache';
import { batchProcessor } from '@/lib/batch';

async function syncAllUsers() {
  const users = await db.query('SELECT * FROM users');
  
  // ✓ Batch processing with connection pooling
  const batches = batchProcessor.chunk(users, 100);
  
  for (const batch of batches) {
    // ✓ Parallel requests with caching
    const results = await Promise.all(
      batch.map(user => cache.wrap(
        \`user:\${user.id}\`,
        () => fetchUserData(user.id),
        { ttl: 300 }
      ))
    );
    
    // ✓ Bulk insert for efficiency
    await db.bulkUpdate('users', results);
  }
  
  return { synced: users.length };
}`,
    type: 'scalability',
    fixButtonText: 'Optimize for Scale',
    whyItMatters: 'Scaling isn\'t just about servers; it\'s about code efficiency. Bob analyzes your logic against real-world traffic patterns to ensure you don\'t crash on launch day.',
  },
];

const exampleRules = [
  'API calls only in /src/lib/api/',
  'Components should be in /src/components/',
  'Max 200 lines per component',
  'Hooks must start with "use"',
  'No inline styles in components',
  'Batch operations for scale',
];

export function LiveEnforcement() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [isFixed, setIsFixed] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [showIgnoreMessage, setShowIgnoreMessage] = useState(false);
  const [showUpdateRuleModal, setShowUpdateRuleModal] = useState(false);
  const [customRule, setCustomRule] = useState('');
  const [ruleUpdated, setRuleUpdated] = useState(false);

  const handleFix = () => {
    setIsFixing(true);
    setTimeout(() => {
      setIsFixed(true);
      setIsFixing(false);
    }, 1500);
  };

  const handleScenarioChange = (scenario: typeof scenarios[0]) => {
    setActiveScenario(scenario);
    setIsFixed(false);
    setIsFixing(false);
    setShowIgnoreMessage(false);
    setRuleUpdated(false);
  };

  const handleIgnore = () => {
    setShowIgnoreMessage(true);
    setTimeout(() => {
      setShowIgnoreMessage(false);
      // Move to next scenario or reset
      const currentIndex = scenarios.findIndex(s => s.id === activeScenario.id);
      const nextIndex = (currentIndex + 1) % scenarios.length;
      handleScenarioChange(scenarios[nextIndex]);
    }, 2500);
  };

  const handleUpdateRule = () => {
    setCustomRule(activeScenario.rule);
    setShowUpdateRuleModal(true);
  };

  const handleSaveRule = () => {
    setShowUpdateRuleModal(false);
    setRuleUpdated(true);
    setTimeout(() => setRuleUpdated(false), 3000);
  };

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
            See Bob in action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bob doesn't change your code—he guides you to better patterns
          </p>
        </motion.div>

        {/* Scenario Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeScenario.id === scenario.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {scenario.title}
            </button>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Code Editor */}
          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
              <div className="bg-code-bg px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <span className="text-code-comment text-sm ml-2">VS Code</span>
              </div>
            <div className="bg-code-bg p-4 min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={isFixed ? 'fixed' : 'bad'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-mono leading-relaxed overflow-x-auto"
                >
                  <code className="text-code-text whitespace-pre">
                    {isFixed ? activeScenario.fixedCode : activeScenario.badCode}
                  </code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>

          {/* Bob's Feedback */}
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {showIgnoreMessage ? (
                <motion.div
                  key="ignore"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-elevated p-6 border-l-4 border-l-muted-foreground"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <X className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Warning ignored
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Bob won't flag this pattern again in this session.
                        Moving to next scenario...
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : ruleUpdated ? (
                <motion.div
                  key="updated"
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-elevated p-6 border-l-4 border-l-primary"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        ✓ Rule updated successfully
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your custom rule has been saved. Bob will now use this rule
                        for future enforcement.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : !isFixed ? (
                <motion.div
                  key="warning"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`card-elevated p-6 border-l-4 ${
                    activeScenario.type === 'scalability' 
                      ? 'border-l-amber-500 bg-amber-500/5' 
                      : 'border-l-warning'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {activeScenario.type === 'scalability' ? (
                      <TrendingUp className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-2 ${
                        activeScenario.type === 'scalability' ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
                      }`}>
                        {activeScenario.type === 'scalability' ? '📈' : '⚠️'} {activeScenario.warning.title}
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                        {activeScenario.warning.message}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeScenario.type === 'scalability' ? (
                          <motion.button
                            onClick={handleFix}
                            disabled={isFixing}
                            className="relative inline-flex items-center justify-center text-sm py-2 px-4 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                            animate={!isFixing ? {
                              boxShadow: [
                                '0 0 0 0 rgba(245, 158, 11, 0.4)',
                                '0 0 0 8px rgba(245, 158, 11, 0)',
                              ]
                            } : {}}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: 'easeOut'
                            }}
                          >
                            {isFixing ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="mr-2"
                                >
                                  <TrendingUp className="w-4 h-4" />
                                </motion.div>
                                Optimizing...
                              </>
                            ) : (
                              <>
                                <TrendingUp className="w-4 h-4 mr-2" />
                                {activeScenario.fixButtonText || 'Auto-fix'}
                              </>
                            )}
                          </motion.button>
                        ) : (
                          <button
                            onClick={handleFix}
                            disabled={isFixing}
                            className="btn-primary text-sm py-2 px-4"
                          >
                            {isFixing ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="mr-2"
                                >
                                  <Zap className="w-4 h-4" />
                                </motion.div>
                                Fixing...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Auto-fix
                              </>
                            )}
                          </button>
                        )}
                        <button 
                          className="btn-ghost text-sm py-2 px-4"
                          onClick={handleIgnore}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Ignore this time
                        </button>
                        <button 
                          className="btn-ghost text-sm py-2 px-4"
                          onClick={handleUpdateRule}
                        >
                          Update rule
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className={`card-elevated p-6 border-l-4 ${
                    activeScenario.type === 'scalability' ? 'border-l-amber-500' : 'border-l-accent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activeScenario.type === 'scalability' ? 'bg-amber-500/10' : 'bg-accent/10'
                    }`}>
                      <Check className={`w-6 h-6 ${
                        activeScenario.type === 'scalability' ? 'text-amber-500' : 'text-accent'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {activeScenario.type === 'scalability' 
                          ? '✓ Optimized for scale' 
                          : '✓ Fixed and following pattern'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {activeScenario.type === 'scalability'
                          ? 'Bob has restructured your code to handle 10,000+ concurrent users with efficient batching and caching.'
                          : 'Bob has restructured your code to follow architectural best practices. Your codebase is now cleaner and more maintainable.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Card */}
            <div className={`card-elevated p-6 ${
              activeScenario.type === 'scalability' ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-muted/30'
            }`}>
              <h4 className="font-medium text-foreground mb-2">Why this matters</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeScenario.whyItMatters || 
                  'Consistent architecture makes your codebase easier to understand, test, and maintain. Bob ensures every team member follows the same patterns, reducing code review friction and onboarding time.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Update Rule Modal */}
      <Dialog open={showUpdateRuleModal} onOpenChange={setShowUpdateRuleModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Architectural Rule</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current rule:</p>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm font-mono text-foreground">{activeScenario.rule}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">New rule:</p>
              <Textarea
                value={customRule}
                onChange={(e) => setCustomRule(e.target.value)}
                placeholder="Enter your custom rule..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Example rules for inspiration:</p>
              <div className="flex flex-wrap gap-1.5">
                {exampleRules.map((rule) => (
                  <button
                    key={rule}
                    onClick={() => setCustomRule(rule)}
                    className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                  >
                    {rule}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowUpdateRuleModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRule} disabled={!customRule.trim()}>
              Update Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

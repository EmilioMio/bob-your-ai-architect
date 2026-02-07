import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Check, Zap, X, ArrowRight } from 'lucide-react';

const scenarios = [
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
    fixedCode: `// src/components/features/Dashboard/
// ├── index.jsx (42 lines)
// ├── DashboardHeader.jsx (65 lines)
// ├── DashboardStats.jsx (58 lines)
// ├── DashboardChart.jsx (72 lines)
// └── DashboardTable.jsx (75 lines)

// Each component is now focused,
// testable, and maintainable! ✓`,
  },
];

export function LiveEnforcement() {
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [isFixed, setIsFixed] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

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
              {!isFixed ? (
                <motion.div
                  key="warning"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-elevated p-6 border-l-4 border-l-warning"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">
                        ⚠️ {activeScenario.warning.title}
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                        {activeScenario.warning.message}
                      </p>
                      <div className="flex flex-wrap gap-2">
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
                        <button className="btn-ghost text-sm py-2 px-4">
                          <X className="w-4 h-4 mr-2" />
                          Ignore this time
                        </button>
                        <button className="btn-ghost text-sm py-2 px-4">
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
                  className="card-elevated p-6 border-l-4 border-l-accent"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        ✓ Fixed and following pattern
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Bob has restructured your code to follow architectural best practices. 
                        Your codebase is now cleaner and more maintainable.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Card */}
            <div className="card-elevated p-6 bg-muted/30">
              <h4 className="font-medium text-foreground mb-2">Why this matters</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Consistent architecture makes your codebase easier to understand, test, and maintain. 
                Bob ensures every team member follows the same patterns, reducing code review friction 
                and onboarding time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

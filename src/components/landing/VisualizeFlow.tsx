import { motion } from 'framer-motion';
import { Code2, Database, Globe, Server, Zap, ArrowRight, Lightbulb, ArrowDown } from 'lucide-react';

const layers = [
  {
    name: 'UI Layer',
    icon: Globe,
    color: 'bg-primary/10 border-primary/30 text-primary',
    description: 'React components, user interactions, styling',
    codeHere: true,
    timeSpent: '40%',
  },
  {
    name: 'API Layer',
    icon: Server,
    color: 'bg-accent/10 border-accent/30 text-accent',
    description: 'Edge functions, REST endpoints, validation',
    codeHere: true,
    timeSpent: '30%',
  },
  {
    name: 'Business Logic',
    icon: Code2,
    color: 'bg-code-keyword/10 border-code-keyword/30 text-code-keyword',
    description: 'Core algorithms, data transformations, rules',
    codeHere: true,
    timeSpent: '25%',
  },
  {
    name: 'Data Layer',
    icon: Database,
    color: 'bg-secondary/10 border-secondary/30 text-secondary-foreground',
    description: 'Database queries, storage, caching',
    codeHere: false,
    timeSpent: '5%',
  },
];

const connections = [
  { from: 'User clicks button', to: 'React component handles event', type: 'sync' },
  { from: 'Component calls API', to: 'Edge function processes request', type: 'async' },
  { from: 'API validates & queries', to: 'Database returns data', type: 'async' },
  { from: 'Response flows back', to: 'UI updates with new state', type: 'sync' },
];

const flowSteps = [
  { label: 'Client (Browser)', items: ['React Components', 'App State'], icon: '🖥️', color: 'primary' },
  { label: 'Backend (Server)', items: ['API Routes', 'Business Logic'], icon: '⚡', color: 'accent' },
  { label: 'Data Layer', items: ['Database', 'Auth', 'External APIs'], icon: '💾', color: 'code-keyword' },
];

const stackLayers = [
  { 
    category: 'UI Layer', 
    tools: ['⚛️ React + TypeScript', '🎨 Tailwind CSS', '✨ Framer Motion'],
    color: 'primary'
  },
  { 
    category: 'API Layer', 
    tools: ['⚡ Edge Functions', '🔒 Zod Validation'],
    color: 'accent'
  },
  { 
    category: 'Business Logic', 
    tools: ['🪝 Custom Hooks', '🛠️ Utility Functions', '📊 React Query'],
    color: 'code-keyword'
  },
  { 
    category: 'Data Layer', 
    tools: ['🗄️ Database', '🔐 Authentication', '📁 File Storage'],
    color: 'secondary'
  },
];

export function VisualizeFlow() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visualize your flow
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand how requests move through your system—and where your code belongs.
          </p>
        </motion.div>

        {/* 1. High-Level Mental Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">The Mental Model</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Every web app follows the same pattern: <span className="text-foreground font-medium">a user interacts with your UI</span>, 
              which triggers a request to your backend. The backend processes the request—validating data, 
              applying business rules, querying databases—then sends a response back. 
              <span className="text-foreground font-medium"> Your UI updates to reflect the new state.</span> That's it. 
              Everything else is just details about <em>how</em> each layer is implemented.
            </p>
          </div>
        </motion.div>

        {/* 2. Visual Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">1</span>
            How requests flow through your system
          </h3>
          
          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            {/* Flow Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              {flowSteps.map((step, idx) => (
                <div key={step.label} className="flex flex-col md:flex-row items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                    className={`relative p-5 rounded-xl border-2 bg-${step.color}/5 border-${step.color}/30 min-w-[200px]`}
                  >
                    <div className="text-2xl mb-2">{step.icon}</div>
                    <h4 className={`font-semibold text-foreground mb-3`}>{step.label}</h4>
                    <ul className="space-y-1">
                      {step.items.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full bg-${step.color}`}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  
                  {idx < flowSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + 0.1 * idx }}
                      className="flex items-center text-muted-foreground"
                    >
                      <ArrowRight className="w-6 h-6 hidden md:block" />
                      <ArrowDown className="w-6 h-6 md:hidden" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Request Flow Numbers */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                {['1. User action', '2. API call', '3. Process', '4. Query DB', '5. Return data', '6. Update UI'].map((step, idx) => (
                  <motion.span
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + 0.05 * idx }}
                    className="px-3 py-1.5 bg-muted rounded-full text-muted-foreground"
                  >
                    {step}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 text-center">
            ↑ This is the request lifecycle. Every feature you build follows this pattern.
          </p>
        </motion.div>

        {/* 3. Where You Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">2</span>
            Where you'll write code
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {layers.map((layer, idx) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className={`relative p-5 rounded-xl border-2 ${layer.color} ${
                  layer.codeHere ? 'ring-2 ring-primary/20' : ''
                }`}
              >
                {layer.codeHere && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    You code here
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${layer.color} flex items-center justify-center flex-shrink-0`}>
                    <layer.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-foreground">{layer.name}</h4>
                      <span className="text-xs text-muted-foreground">{layer.timeSpent} of time</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{layer.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Pro tip:</span> The Data Layer is mostly handled by your database service. 
              You define schemas and write queries, but you rarely touch the underlying infrastructure. 
              Focus your energy on the <span className="text-accent font-medium">UI, API, and Business Logic</span> layers.
            </div>
          </div>
        </motion.div>

        {/* 4. Layer Connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">3</span>
            How layers communicate
          </h3>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
              {connections.map((conn, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="p-5 relative"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      conn.type === 'async' 
                        ? 'bg-warning/10 text-warning' 
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {conn.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{conn.from}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground my-1" />
                  <p className="text-sm text-muted-foreground">{conn.to}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <span className="text-muted-foreground"><strong className="text-foreground">Sync:</strong> Happens immediately, blocks until done</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              <span className="text-muted-foreground"><strong className="text-foreground">Async:</strong> Returns a promise, doesn't block</span>
            </div>
          </div>
        </motion.div>

        {/* 5. Tool-Annotated Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">4</span>
            Your stack mapped to layers
          </h3>
          
          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            {/* Visual Stack */}
            <div className="space-y-3">
              {stackLayers.map((layer, idx) => (
                <motion.div
                  key={layer.category}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border bg-${layer.color}/5 border-${layer.color}/20`}
                >
                  <span className={`text-sm font-semibold text-${layer.color} min-w-[120px]`}>
                    {layer.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {layer.tools.map((tool) => (
                      <span 
                        key={tool}
                        className="px-3 py-1 bg-background rounded-md text-sm text-foreground border border-border"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Arrows indicating flow */}
            <div className="flex justify-center my-4">
              <div className="flex flex-col items-center text-muted-foreground">
                <ArrowDown className="w-5 h-5" />
                <span className="text-xs">Data flows down & up</span>
                <ArrowDown className="w-5 h-5 rotate-180" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="font-medium text-foreground mb-1">🎯 Most of your time</p>
              <p className="text-muted-foreground">React components, custom hooks, edge functions</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <p className="font-medium text-foreground mb-1">⚙️ Configure once</p>
              <p className="text-muted-foreground">Tailwind, TypeScript, validation schemas</p>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <p className="font-medium text-foreground mb-1">🔌 Just works</p>
              <p className="text-muted-foreground">Database, auth, storage (managed for you)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

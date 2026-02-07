import { motion } from 'framer-motion';
import { Monitor, Brain, Users, FileCode, ArrowRight, Shield } from 'lucide-react';

const flowLayers = [
  {
    title: 'Input',
    icon: Monitor,
    color: 'from-primary/20 to-primary/5',
    borderColor: 'border-primary/30',
    iconColor: 'text-primary',
    dotColor: 'bg-primary',
    nodes: ['User Interface', 'API Gateway'],
  },
  {
    title: 'Core Engine',
    icon: Brain,
    color: 'from-accent/20 to-accent/5',
    borderColor: 'border-accent/30',
    iconColor: 'text-accent',
    dotColor: 'bg-accent',
    nodes: ['Parser', 'Analyzer', 'AI', 'Rules'],
  },
  {
    title: 'Orchestration',
    icon: Users,
    color: 'from-code-keyword/20 to-code-keyword/5',
    borderColor: 'border-code-keyword/30',
    iconColor: 'text-code-keyword',
    dotColor: 'bg-code-keyword',
    nodes: ['Lovable', 'Cursor', 'Copilot'],
  },
  {
    title: 'Output',
    icon: FileCode,
    color: 'from-warning/20 to-warning/5',
    borderColor: 'border-warning/30',
    iconColor: 'text-warning',
    dotColor: 'bg-warning',
    nodes: ['File Gen', 'VS Code', 'Enforce'],
  },
];

export function BackendFlowDiagram() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visualize your flow
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            How Bob's architecture engine works under the hood
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex justify-center gap-6 mb-12 flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent" />
            <span>main workflow</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-12 h-0.5 border-t-2 border-dashed border-muted-foreground/40" />
            <span>internal dependency</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-12 h-0.5 border-t border-dotted border-muted-foreground/30" />
            <span>supportive / tooling</span>
          </div>
        </motion.div>

        {/* Desktop: Network-style Architecture */}
        <div className="hidden lg:block relative max-w-6xl mx-auto" style={{ minHeight: '600px' }}>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <defs>
              <linearGradient id="mainFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            
            {/* Main workflow: Client → API → Data → Deploy */}
            <motion.line
              x1="16%" y1="50%" x2="30%" y2="50%"
              stroke="url(#mainFlow)"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.line
              x1="46%" y1="50%" x2="58%" y2="50%"
              stroke="url(#mainFlow)"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
            <motion.line
              x1="74%" y1="50%" x2="84%" y2="50%"
              stroke="url(#mainFlow)"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />

            {/* Internal dependency: Backend Tools → API */}
            <motion.line
              x1="38%" y1="28%" x2="38%" y2="42%"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="2"
              strokeDasharray="6,4"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
            />

            {/* Supportive connections (dotted) */}
            <motion.line
              x1="13%" y1="18%" x2="34%" y2="42%"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1.5"
              strokeDasharray="2,3"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.4 }}
            />
            <motion.line
              x1="13%" y1="82%" x2="34%" y2="58%"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1.5"
              strokeDasharray="2,3"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.5 }}
            />
          </svg>

          <div className="relative">
            {/* Row 1: Frontend Tools & Backend Tools */}
            <div className="flex justify-start gap-12 mb-8">
              {/* Frontend Tools */}
              <motion.div
                className="w-56"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-sm bg-purple-500" />
                    <span className="text-sm font-semibold text-foreground">Frontend Tools</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="px-3 py-2 rounded-lg bg-background/60 border border-border/40 text-sm font-medium">
                      Next.js
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-background/60 border border-border/40 text-sm font-medium">
                      Tailwind CSS
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Backend Tools */}
              <motion.div
                className="w-56 ml-28"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-sm bg-blue-500" />
                    <span className="text-sm font-semibold text-foreground">Backend Tools</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-background/60 border border-border/40 text-sm font-medium">
                    Supabase
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Row 2: Client → API → Data → Deploy */}
            <div className="flex items-center justify-between gap-6 mb-8">
              {/* Client */}
              <motion.div
                className="w-56"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className={`rounded-2xl bg-gradient-to-br ${flowLayers[0].color} border ${flowLayers[0].borderColor} p-5 backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl bg-background/80 ${flowLayers[0].iconColor}`}>
                      <Monitor className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground text-base">Client</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${flowLayers[0].dotColor} opacity-60 flex-shrink-0`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">UI</div>
                        <div className="text-xs text-muted-foreground">Interface layer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* API */}
              <motion.div
                className="w-64"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className={`rounded-2xl bg-gradient-to-br ${flowLayers[1].color} border-2 ${flowLayers[1].borderColor} p-5 backdrop-blur-sm shadow-lg`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl bg-background/80 ${flowLayers[1].iconColor} shadow-sm`}>
                      <Brain className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-foreground text-lg">API</span>
                  </div>
                  <div className="space-y-2">
                    {flowLayers[1].nodes.map((node) => (
                      <div key={node} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${flowLayers[1].dotColor} opacity-60`} />
                        <div className="px-3 py-1.5 rounded-lg bg-background/70 border border-border/40 text-sm font-medium flex-1">
                          {node}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Data */}
              <motion.div
                className="w-64"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className={`rounded-2xl bg-gradient-to-br ${flowLayers[2].color} border ${flowLayers[2].borderColor} p-5 backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl bg-background/80 ${flowLayers[2].iconColor}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground text-base">Data</span>
                  </div>
                  <div className="space-y-2">
                    {flowLayers[2].nodes.map((node) => (
                      <div key={node} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${flowLayers[2].dotColor} opacity-60`} />
                        <div className="px-3 py-1.5 rounded-lg bg-background/70 border border-border/40 text-sm font-medium flex-1">
                          {node}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Deploy */}
              <motion.div
                className="w-64"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className={`rounded-2xl bg-gradient-to-br ${flowLayers[3].color} border ${flowLayers[3].borderColor} p-5 backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl bg-background/80 ${flowLayers[3].iconColor}`}>
                      <FileCode className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground text-base">Deploy</span>
                  </div>
                  <div className="space-y-2">
                    {flowLayers[3].nodes.map((node) => (
                      <div key={node} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${flowLayers[3].dotColor} opacity-60`} />
                        <div className="px-3 py-1.5 rounded-lg bg-background/70 border border-border/40 text-sm font-medium flex-1">
                          {node}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Row 3: Support */}
            <div className="flex justify-start">
              <motion.div
                className="w-56"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="rounded-2xl bg-gradient-to-br from-slate-500/10 to-slate-500/5 border border-slate-500/20 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-sm bg-slate-500" />
                    <span className="text-sm font-semibold text-foreground">Support</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="px-3 py-2 rounded-lg bg-background/60 border border-border/40 text-sm font-medium">
                      Stripe
                    </div>
                    <div className="px-3 py-2 rounded-lg bg-background/60 border border-border/40 text-sm font-medium">
                      TypeScript
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feedback Loop */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-muted/30 border border-border/50">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-accent">
                <path
                  d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"
                  fill="currentColor"
                />
              </svg>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-foreground">Continuous Feedback</span>
                <span className="text-sm text-muted-foreground">Enforcement → Rules Engine</span>
              </div>
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-accent"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

        {/* Mobile: Vertical Workflow */}
        <div className="lg:hidden relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-accent/30 to-warning/30" />

          <div className="space-y-6">
            {flowLayers.map((layer, idx) => (
              <motion.div
                key={layer.title}
                className="relative pl-16"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className={`absolute left-5 top-6 w-7 h-7 rounded-full ${layer.dotColor} flex items-center justify-center text-white text-xs font-bold shadow-md z-10`}>
                  {idx + 1}
                </div>

                <div className={`rounded-2xl bg-gradient-to-r ${layer.color} border ${layer.borderColor} p-5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl bg-background/80 ${layer.iconColor}`}>
                      <layer.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground">{layer.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layer.nodes.map((node) => (
                      <span
                        key={node}
                        className="px-3 py-1.5 rounded-full bg-background/70 border border-border/40 text-xs text-foreground font-medium"
                      >
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

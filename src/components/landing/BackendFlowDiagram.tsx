import { motion } from 'framer-motion';
import { Monitor, Brain, Users, FileCode, Shield, ArrowRight } from 'lucide-react';

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

        {/* Desktop: Horizontal Workflow */}
        <div className="hidden lg:block relative">
          {/* Connection Lines SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Main flow line */}
            <motion.path
              d="M 12% 50% Q 25% 35% 37% 50% T 62% 50% T 88% 50%"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>

          <div className="relative flex items-stretch justify-between max-w-6xl mx-auto gap-6">
            {flowLayers.map((layer, idx) => (
              <motion.div
                key={layer.title}
                className="relative flex-1 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                {/* Step Number */}
                <motion.div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${layer.dotColor} flex items-center justify-center text-white text-sm font-bold shadow-lg z-10`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.15 + 0.3, type: "spring" }}
                >
                  {idx + 1}
                </motion.div>

                {/* Layer Card */}
                <div
                  className={`relative h-full rounded-3xl bg-gradient-to-b ${layer.color} border ${layer.borderColor} p-6 backdrop-blur-sm`}
                >
                  {/* Icon Header */}
                  <div className="flex items-center gap-3 mb-5 mt-2">
                    <div className={`p-2.5 rounded-xl bg-background/80 ${layer.iconColor} shadow-sm`}>
                      <layer.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground">{layer.title}</span>
                  </div>

                  {/* Nodes with connecting dots */}
                  <div className="space-y-2.5">
                    {layer.nodes.map((node, nodeIdx) => (
                      <motion.div
                        key={node}
                        className="relative flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.15 + nodeIdx * 0.05 + 0.3 }}
                      >
                        {/* Node dot */}
                        <div className={`w-2 h-2 rounded-full ${layer.dotColor} opacity-60 flex-shrink-0`} />
                        {/* Node label */}
                        <div
                          className="flex-1 px-3 py-2 rounded-xl bg-background/70 border border-border/40 text-sm text-foreground font-medium hover:bg-background hover:border-border/60 transition-all cursor-default"
                        >
                          {node}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Arrow Connector */}
                {idx < flowLayers.length - 1 && (
                  <motion.div
                    className="absolute top-1/2 -right-5 transform -translate-y-1/2 z-10"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.15 + 0.5 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-background border border-border/60 flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Feedback Loop */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-muted/30 border border-border/50">
              {/* Curved arrow back */}
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
          {/* Vertical connection line */}
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
                {/* Step Number on the line */}
                <div className={`absolute left-5 top-6 w-7 h-7 rounded-full ${layer.dotColor} flex items-center justify-center text-white text-xs font-bold shadow-md z-10`}>
                  {idx + 1}
                </div>

                {/* Card */}
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

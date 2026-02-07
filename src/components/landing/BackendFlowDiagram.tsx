import { motion } from 'framer-motion';
import { Monitor, Server, Brain, Cpu, Users, FileCode, Code2, Shield } from 'lucide-react';

const flowLayers = [
  {
    title: 'Input',
    icon: Monitor,
    color: 'from-primary/20 to-primary/5',
    borderColor: 'border-primary/30',
    iconColor: 'text-primary',
    nodes: ['User Interface', 'API Gateway'],
  },
  {
    title: 'Core Engine',
    icon: Brain,
    color: 'from-accent/20 to-accent/5',
    borderColor: 'border-accent/30',
    iconColor: 'text-accent',
    nodes: ['Parser', 'Analyzer', 'AI', 'Rules'],
  },
  {
    title: 'Orchestration',
    icon: Users,
    color: 'from-code-keyword/20 to-code-keyword/5',
    borderColor: 'border-code-keyword/30',
    iconColor: 'text-code-keyword',
    nodes: ['Lovable', 'Cursor', 'Copilot'],
  },
  {
    title: 'Output',
    icon: FileCode,
    color: 'from-warning/20 to-warning/5',
    borderColor: 'border-warning/30',
    iconColor: 'text-warning',
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

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative flex items-center justify-between max-w-6xl mx-auto">
            {flowLayers.map((layer, idx) => (
              <motion.div
                key={layer.title}
                className="relative flex-1 flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                {/* Layer Card */}
                <div
                  className={`relative w-full max-w-[200px] rounded-3xl bg-gradient-to-b ${layer.color} border ${layer.borderColor} p-6 backdrop-blur-sm`}
                >
                  {/* Icon Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl bg-background/80 ${layer.iconColor}`}>
                      <layer.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">{layer.title}</span>
                  </div>

                  {/* Nodes */}
                  <div className="space-y-2">
                    {layer.nodes.map((node, nodeIdx) => (
                      <motion.div
                        key={node}
                        className="px-3 py-2 rounded-xl bg-background/60 border border-border/50 text-xs text-muted-foreground font-medium text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.15 + nodeIdx * 0.05 + 0.2 }}
                        whileHover={{ scale: 1.02, backgroundColor: 'hsl(var(--background))' }}
                      >
                        {node}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Connector Arrow */}
                {idx < flowLayers.length - 1 && (
                  <motion.div
                    className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.15 + 0.4 }}
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" className="text-border">
                      <circle cx="16" cy="16" r="12" fill="hsl(var(--background))" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16h8m-4-4l4 4-4 4" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Feedback Loop */}
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-muted/50 border border-border/50">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Feedback loop: Enforcement → Rules Engine</span>
              <motion.div
                className="w-2 h-2 rounded-full bg-accent"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

        {/* Mobile: Vertical Flow */}
        <div className="lg:hidden space-y-4">
          {flowLayers.map((layer, idx) => (
            <motion.div
              key={layer.title}
              className={`relative rounded-2xl bg-gradient-to-r ${layer.color} border ${layer.borderColor} p-5`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
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
                    className="px-3 py-1.5 rounded-full bg-background/60 border border-border/50 text-xs text-muted-foreground font-medium"
                  >
                    {node}
                  </span>
                ))}
              </div>
              
              {idx < flowLayers.length - 1 && (
                <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
                  <svg width="24" height="16" viewBox="0 0 24 16" className="text-border">
                    <path d="M12 0v12m-4-4l4 4 4-4" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

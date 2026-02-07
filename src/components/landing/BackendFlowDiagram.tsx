import { motion } from 'framer-motion';
import { 
  Globe, Cpu, Users, Palette, GitBranch, 
  FileCode, Shield, ArrowDown, ArrowRight 
} from 'lucide-react';

const layers = [
  {
    id: 'input',
    title: 'Input Layer',
    emoji: '📥',
    color: 'border-primary bg-primary/5',
    nodes: [
      { name: 'User Interface', icon: Globe },
      { name: 'API Gateway', icon: Cpu },
    ],
  },
  {
    id: 'core',
    title: 'Core Engine',
    emoji: '🧠',
    color: 'border-accent bg-accent/5',
    nodes: [
      { name: 'Request Parser', icon: FileCode },
      { name: 'Project Analyzer', icon: Cpu },
      { name: 'AI Architecture', icon: Cpu },
      { name: 'Rules Engine', icon: Shield },
    ],
  },
  {
    id: 'orchestration',
    title: 'Multi-Agent',
    emoji: '🤝',
    color: 'border-code-keyword bg-code-keyword/5',
    nodes: [
      { name: 'Task Delegator', icon: Users },
      { name: 'Lovable', icon: Palette },
      { name: 'Cursor', icon: Cpu },
      { name: 'Copilot', icon: GitBranch },
    ],
  },
  {
    id: 'output',
    title: 'Output Layer',
    emoji: '📤',
    color: 'border-muted-foreground bg-muted/30',
    nodes: [
      { name: 'File Generator', icon: FileCode },
      { name: 'VS Code', icon: FileCode },
      { name: 'Enforcement', icon: Shield },
    ],
  },
];

export function BackendFlowDiagram() {
  return (
    <section className="py-24 md:py-32 bg-muted/20">
      <div className="section-container">
        <motion.div
          className="text-center mb-12"
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

        {/* Flow Diagram */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-2">
            {layers.map((layer, layerIdx) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: layerIdx * 0.1 }}
                className="flex-1 flex flex-col items-center"
              >
                {/* Layer Card */}
                <div className={`w-full rounded-xl border-2 ${layer.color} p-4`}>
                  <div className="text-center mb-3">
                    <span className="text-lg">{layer.emoji}</span>
                    <h3 className="text-sm font-semibold text-foreground">{layer.title}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {layer.nodes.map((node, nodeIdx) => (
                      <motion.div
                        key={node.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: layerIdx * 0.1 + nodeIdx * 0.05 }}
                        className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border border-border text-xs font-medium text-foreground"
                      >
                        <node.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {node.name}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Arrow between layers */}
                {layerIdx < layers.length - 1 && (
                  <div className="py-2 lg:hidden">
                    <ArrowDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Horizontal arrows for desktop */}
          <div className="hidden lg:flex justify-between px-8 -mt-[140px] mb-[100px] pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 flex justify-end pr-2">
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>

          {/* Feedback loop indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 flex justify-center"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-dashed border-border">
              <span className="text-xs text-muted-foreground">↻ Feedback loop: Enforcement → Rules Engine</span>
            </div>
          </motion.div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mt-10"
        >
          {[
            { label: 'Input', color: 'bg-primary/20 border-primary' },
            { label: 'Processing', color: 'bg-accent/20 border-accent' },
            { label: 'Orchestration', color: 'bg-code-keyword/20 border-code-keyword' },
            { label: 'Output', color: 'bg-muted border-muted-foreground' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border ${item.color}`} />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

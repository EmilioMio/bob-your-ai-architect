import { motion } from 'framer-motion';
import { Monitor, Brain, Database, Rocket, Shield, Zap, Coins } from 'lucide-react';

const treeData = {
  root: {
    id: 'input',
    title: 'Input',
    description: 'Describe your project',
    icon: Monitor,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    borderColor: 'border-primary/40',
  },
  agents: [
    {
      id: 'security',
      title: 'Security',
      description: 'Auth & permissions',
      icon: Shield,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-500/10',
      borderColor: 'border-purple-500/40',
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'Speed optimization',
      icon: Zap,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
      borderColor: 'border-amber-500/40',
    },
    {
      id: 'cost',
      title: 'Cost',
      description: 'Budget analysis',
      icon: Coins,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/40',
    },
  ],
  synthesis: {
    id: 'analyze',
    title: 'Analyze',
    description: 'AI synthesis',
    icon: Brain,
    iconColor: 'text-accent',
    iconBg: 'bg-accent/10',
    borderColor: 'border-accent/40',
  },
  outputs: [
    {
      id: 'design',
      title: 'Design',
      description: 'Architecture',
      icon: Database,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
      borderColor: 'border-blue-500/40',
    },
    {
      id: 'deploy',
      title: 'Deploy',
      description: 'Export & build',
      icon: Rocket,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-500/10',
      borderColor: 'border-rose-500/40',
    },
  ],
};

interface NodeProps {
  node: typeof treeData.root;
  delay?: number;
  className?: string;
}

function TreeNode({ node, delay = 0, className = '' }: NodeProps) {
  const Icon = node.icon;
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <div
        className={`rounded-2xl bg-card/80 backdrop-blur-sm border-2 ${node.borderColor} p-4 w-32 lg:w-36 text-center shadow-lg`}
      >
        <div className={`w-10 h-10 rounded-xl ${node.iconBg} ${node.iconColor} flex items-center justify-center mx-auto mb-2`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-foreground text-sm mb-0.5">
          {node.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {node.description}
        </p>
      </div>
    </motion.div>
  );
}

function ConnectingLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      
      {/* Input to Agents - curved lines */}
      <motion.path
        d="M 130 160 C 180 160, 200 80, 280 80"
        fill="none"
        stroke="url(#lineGradient1)"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.path
        d="M 130 160 C 180 160, 200 160, 280 160"
        fill="none"
        stroke="url(#lineGradient1)"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.path
        d="M 130 160 C 180 160, 200 240, 280 240"
        fill="none"
        stroke="url(#lineGradient1)"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      
      {/* Agents to Synthesis */}
      <motion.path
        d="M 415 80 C 465 80, 485 160, 535 160"
        fill="none"
        stroke="url(#lineGradient1)"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.path
        d="M 415 160 C 465 160, 485 160, 535 160"
        fill="none"
        stroke="url(#lineGradient1)"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        d="M 415 240 C 465 240, 485 160, 535 160"
        fill="none"
        stroke="url(#lineGradient1)"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />
      
      {/* Synthesis to Outputs */}
      <motion.path
        d="M 670 160 C 720 160, 740 120, 790 120"
        fill="none"
        stroke="url(#lineGradient2)"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />
      <motion.path
        d="M 670 160 C 720 160, 740 200, 790 200"
        fill="none"
        stroke="url(#lineGradient2)"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.9 }}
      />
    </svg>
  );
}

function MobileConnectingLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <defs>
        <linearGradient id="mobileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      
      {/* Vertical trunk line */}
      <motion.line
        x1="50%"
        y1="60"
        x2="50%"
        y2="100%"
        stroke="url(#mobileGradient)"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />
    </svg>
  );
}

export function BackendFlowDiagram() {
  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
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

        {/* Desktop: Tree Structure */}
        <div className="hidden lg:block relative max-w-5xl mx-auto">
          <div className="relative h-[320px]">
            <ConnectingLines />
            
            {/* Level 1: Input */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2" style={{ zIndex: 1 }}>
              <TreeNode node={treeData.root} delay={0} />
            </div>
            
            {/* Level 2: Agents */}
            <div className="absolute left-[280px] top-1/2 -translate-y-1/2 flex flex-col gap-3" style={{ zIndex: 1 }}>
              {treeData.agents.map((agent, idx) => (
                <TreeNode key={agent.id} node={agent} delay={0.1 + idx * 0.1} />
              ))}
            </div>
            
            {/* Level 3: Synthesis */}
            <div className="absolute left-[535px] top-1/2 -translate-y-1/2" style={{ zIndex: 1 }}>
              <TreeNode node={treeData.synthesis} delay={0.4} />
            </div>
            
            {/* Level 4: Outputs */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3" style={{ zIndex: 1 }}>
              {treeData.outputs.map((output, idx) => (
                <TreeNode key={output.id} node={output} delay={0.5 + idx * 0.1} />
              ))}
            </div>
          </div>
        </div>

        {/* Tablet: Simplified horizontal */}
        <div className="hidden md:flex lg:hidden items-center justify-center gap-6 max-w-3xl mx-auto">
          <TreeNode node={treeData.root} delay={0} />
          <div className="w-8 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
          <TreeNode node={treeData.synthesis} delay={0.2} />
          <div className="w-8 h-0.5 bg-gradient-to-r from-accent/50 to-emerald-500/50" />
          <TreeNode node={treeData.outputs[0]} delay={0.4} />
        </div>

        {/* Mobile: Vertical Tree */}
        <div className="md:hidden relative max-w-xs mx-auto">
          <MobileConnectingLines />
          
          <div className="relative flex flex-col items-center gap-6">
            <TreeNode node={treeData.root} delay={0} />
            
            {/* Agents row */}
            <div className="flex gap-2 justify-center">
              {treeData.agents.map((agent, idx) => (
                <motion.div
                  key={agent.id}
                  className="w-20"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
                >
                  <div className={`rounded-xl bg-card/80 backdrop-blur-sm border ${agent.borderColor} p-3 text-center`}>
                    <div className={`w-8 h-8 rounded-lg ${agent.iconBg} ${agent.iconColor} flex items-center justify-center mx-auto mb-1`}>
                      <agent.icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-foreground">{agent.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <TreeNode node={treeData.synthesis} delay={0.4} />
            
            {/* Outputs row */}
            <div className="flex gap-4 justify-center">
              {treeData.outputs.map((output, idx) => (
                <TreeNode key={output.id} node={output} delay={0.5 + idx * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

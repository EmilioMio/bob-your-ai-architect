import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Brain, Database, Rocket, Shield, Zap, Coins, Upload, Github, Loader2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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
  isActive?: boolean;
}

function TreeNode({ node, delay = 0, className = '', isActive = false }: NodeProps) {
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
        className={`rounded-2xl bg-card/80 backdrop-blur-sm border-2 ${node.borderColor} p-4 w-32 lg:w-36 text-center shadow-lg transition-all duration-300 ${
          isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' : ''
        }`}
      >
        <div className={`w-10 h-10 rounded-xl ${node.iconBg} ${node.iconColor} flex items-center justify-center mx-auto mb-2`}>
          {isActive ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-5 h-5" />
            </motion.div>
          ) : (
            <Icon className="w-5 h-5" />
          )}
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
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setUploadedFileName(null);
    
    // Animate through nodes sequentially
    const nodeSequence = ['input', 'security', 'performance', 'cost', 'analyze', 'design', 'deploy'];
    let currentIndex = 0;
    
    const animateNodes = () => {
      if (currentIndex < nodeSequence.length) {
        setActiveNodeId(nodeSequence[currentIndex]);
        currentIndex++;
        setTimeout(animateNodes, 600);
      } else {
        setActiveNodeId(null);
        setIsAnalyzing(false);
        toast({
          title: "Analysis complete",
          description: "Architecture recommendations are ready",
        });
      }
    };
    
    animateNodes();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadedFileName(null);
      
      // Simulate file reading
      setTimeout(() => {
        setIsUploading(false);
        setUploadedFileName(file.name);
        toast({
          title: "Project files loaded successfully",
          description: `Loaded ${file.name}`,
        });
        
        // Trigger the same analysis animation
        simulateAnalysis();
      }, 1500);
    }
    // Reset input value so the same file can be selected again
    event.target.value = '';
  };

  const clearUploadedFile = () => {
    setUploadedFileName(null);
  };

  const isNodeActive = (nodeId: string) => activeNodeId === nodeId;

  return (
    <section id="flow-diagram" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="section-container">
        <motion.div
          className="text-center mb-8"
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

        {/* GitHub URL Input Section */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card-elevated p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* GitHub Input */}
              <div className="relative flex-1">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="https://github.com/username/repo"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={isAnalyzing || isUploading}
                />
              </div>
              
              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={simulateAnalysis}
                  disabled={isAnalyzing || isUploading}
                  className="btn-primary px-6 py-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Simulate'
                  )}
                </button>
                
                <button
                  onClick={handleUploadClick}
                  disabled={isAnalyzing || isUploading}
                  className="relative inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-secondary text-secondary-foreground font-medium transition-all hover:bg-secondary/80 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Reading Files...</span>
                      <span className="sm:hidden">Reading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Upload Project</span>
                      <span className="sm:hidden">Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Uploaded file badge */}
            <AnimatePresence>
              {uploadedFileName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 flex items-center gap-2"
                >
                  <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
                    <span className="text-xs">{uploadedFileName}</span>
                    <button
                      onClick={clearUploadedFile}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="hidden"
          />
        </motion.div>

        {/* Desktop: Tree Structure */}
        <div className="hidden lg:block relative max-w-5xl mx-auto">
          <div className="relative h-[320px]">
            <ConnectingLines />
            
            {/* Level 1: Input */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2" style={{ zIndex: 1 }}>
              <TreeNode node={treeData.root} delay={0} isActive={isNodeActive('input')} />
            </div>
            
            {/* Level 2: Agents */}
            <div className="absolute left-[280px] top-1/2 -translate-y-1/2 flex flex-col gap-3" style={{ zIndex: 1 }}>
              {treeData.agents.map((agent, idx) => (
                <TreeNode key={agent.id} node={agent} delay={0.1 + idx * 0.1} isActive={isNodeActive(agent.id)} />
              ))}
            </div>
            
            {/* Level 3: Synthesis */}
            <div className="absolute left-[535px] top-1/2 -translate-y-1/2" style={{ zIndex: 1 }}>
              <TreeNode node={treeData.synthesis} delay={0.4} isActive={isNodeActive('analyze')} />
            </div>
            
            {/* Level 4: Outputs */}
            <div className="absolute right-[100px] top-1/2 -translate-y-1/2 flex flex-col gap-3" style={{ zIndex: 1 }}>
              {treeData.outputs.map((output, idx) => (
                <TreeNode key={output.id} node={output} delay={0.5 + idx * 0.1} isActive={isNodeActive(output.id)} />
              ))}
            </div>
          </div>
        </div>

        {/* Tablet: Simplified horizontal */}
        <div className="hidden md:flex lg:hidden items-center justify-center gap-6 max-w-3xl mx-auto">
          <TreeNode node={treeData.root} delay={0} isActive={isNodeActive('input')} />
          <div className="w-8 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
          <TreeNode node={treeData.synthesis} delay={0.2} isActive={isNodeActive('analyze')} />
          <div className="w-8 h-0.5 bg-gradient-to-r from-accent/50 to-success/50" />
          <TreeNode node={treeData.outputs[0]} delay={0.4} isActive={isNodeActive('design')} />
        </div>

        {/* Mobile: Vertical Tree */}
        <div className="md:hidden relative max-w-xs mx-auto">
          <MobileConnectingLines />
          
          <div className="relative flex flex-col items-center gap-6">
            <TreeNode node={treeData.root} delay={0} isActive={isNodeActive('input')} />
            
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
                  <div className={`rounded-xl bg-card/80 backdrop-blur-sm border ${agent.borderColor} p-3 text-center transition-all duration-300 ${
                    isNodeActive(agent.id) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-lg ${agent.iconBg} ${agent.iconColor} flex items-center justify-center mx-auto mb-1`}>
                      {isNodeActive(agent.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <agent.icon className="w-4 h-4" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-foreground">{agent.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <TreeNode node={treeData.synthesis} delay={0.4} isActive={isNodeActive('analyze')} />
            
            {/* Outputs row */}
            <div className="flex gap-4 justify-center">
              {treeData.outputs.map((output, idx) => (
                <TreeNode key={output.id} node={output} delay={0.5 + idx * 0.1} isActive={isNodeActive(output.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

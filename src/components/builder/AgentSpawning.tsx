import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, FolderTree, Shield, Coins, Zap, Check, Loader2, Smartphone, CreditCard, BarChart3, Bot } from 'lucide-react';
import { ProjectFormData, Agent } from './types';

const agentIcons: Record<string, React.ElementType> = {
  orchestrator: Brain,
  structure: FolderTree,
  security: Shield,
  cost: Coins,
  performance: Zap,
  mobile: Smartphone,
  payment: CreditCard,
  scalability: BarChart3,
  ai: Bot,
  speed: Zap,
};

const agentDescriptions: Record<string, string> = {
  orchestrator: 'Leading architecture decisions',
  structure: 'Designing folder hierarchy',
  security: 'Planning authentication & data protection',
  cost: 'Optimizing for budget efficiency',
  performance: 'Ensuring fast load times',
  mobile: 'Optimizing mobile experience',
  payment: 'Setting up payment infrastructure',
  scalability: 'Planning for growth',
  ai: 'Integrating AI/ML capabilities',
  speed: 'Focusing on MVP delivery',
};

interface AgentSpawningProps {
  formData: ProjectFormData;
  onComplete: (agents: Agent[]) => void;
}

export function AgentSpawning({ formData, onComplete }: AgentSpawningProps) {
  const [phase, setPhase] = useState<'analyzing' | 'spawning' | 'complete'>('analyzing');
  const [analysisSteps, setAnalysisSteps] = useState([
    { label: 'Understanding requirements', done: false },
    { label: 'Identifying priorities', done: false },
    { label: 'Assembling specialist team', done: false },
  ]);
  const [agents, setAgents] = useState<Agent[]>([]);

  // Determine which agents to spawn based on form data
  const determineAgents = (): Agent[] => {
    const projectLower = formData.project.toLowerCase();
    const agentList: Agent[] = [
      { id: 'orchestrator', name: 'Orchestrator (Bob)', icon: '🧠', description: agentDescriptions.orchestrator, status: 'analyzing' },
      { id: 'structure', name: 'Structure Agent', icon: '📁', description: agentDescriptions.structure, status: 'analyzing' },
    ];

    // Conditional agents based on project description
    if (projectLower.includes('auth') || projectLower.includes('login') || projectLower.includes('user')) {
      agentList.push({ id: 'security', name: 'Security Agent', icon: '🔒', description: agentDescriptions.security, status: 'analyzing' });
    }

    if (projectLower.includes('payment') || projectLower.includes('checkout') || projectLower.includes('subscription')) {
      agentList.push({ id: 'payment', name: 'Payment Agent', icon: '💳', description: agentDescriptions.payment, status: 'analyzing' });
    }

    if (projectLower.includes('mobile') || formData.projectType === 'mobile') {
      agentList.push({ id: 'mobile', name: 'Mobile Agent', icon: '📱', description: agentDescriptions.mobile, status: 'analyzing' });
    }

    if (projectLower.includes('ai') || projectLower.includes('ml') || projectLower.includes('machine learning')) {
      agentList.push({ id: 'ai', name: 'AI/ML Agent', icon: '🤖', description: agentDescriptions.ai, status: 'analyzing' });
    }

    // Always add cost agent
    agentList.push({ id: 'cost', name: 'Cost Agent', icon: '💰', description: agentDescriptions.cost, status: 'analyzing' });

    // Add based on team size
    if (['11-50', '50+'].includes(formData.teamSize)) {
      agentList.push({ id: 'scalability', name: 'Scalability Agent', icon: '📊', description: agentDescriptions.scalability, status: 'analyzing' });
    }

    // Add based on timeline
    if (['week', '2-4weeks'].includes(formData.timeline)) {
      agentList.push({ id: 'speed', name: 'Speed Agent', icon: '⚡', description: agentDescriptions.speed, status: 'analyzing' });
    }

    // Always add performance
    agentList.push({ id: 'performance', name: 'Performance Agent', icon: '⚡', description: agentDescriptions.performance, status: 'analyzing' });

    return agentList;
  };

  useEffect(() => {
    // Simulate analysis phase
    const stepTimers = [
      setTimeout(() => setAnalysisSteps(prev => prev.map((s, i) => i === 0 ? { ...s, done: true } : s)), 800),
      setTimeout(() => setAnalysisSteps(prev => prev.map((s, i) => i === 1 ? { ...s, done: true } : s)), 1600),
      setTimeout(() => {
        setAnalysisSteps(prev => prev.map((s, i) => i === 2 ? { ...s, done: true } : s));
        setPhase('spawning');
        setAgents(determineAgents());
      }, 2400),
    ];

    return () => stepTimers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== 'spawning' || agents.length === 0) return;

    // Animate agents becoming active then complete
    let currentIndex = 0;
    
    const activateNext = () => {
      if (currentIndex < agents.length) {
        setAgents(prev => prev.map((a, i) => 
          i === currentIndex ? { ...a, status: 'active' } : a
        ));
        
        setTimeout(() => {
          setAgents(prev => prev.map((a, i) => 
            i === currentIndex ? { ...a, status: 'complete' } : a
          ));
          currentIndex++;
          
          if (currentIndex < agents.length) {
            setTimeout(activateNext, 300);
          } else {
            setTimeout(() => {
              setPhase('complete');
              onComplete(agents.map(a => ({ ...a, status: 'complete' })));
            }, 500);
          }
        }, 400);
      }
    };

    const timer = setTimeout(activateNext, 300);
    return () => clearTimeout(timer);
  }, [phase, agents.length]);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'analyzing': return 'text-muted-foreground bg-muted';
      case 'active': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'complete': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
    }
  };

  const getStatusLabel = (status: Agent['status']) => {
    switch (status) {
      case 'analyzing': return 'ANALYZING';
      case 'active': return 'ACTIVE';
      case 'complete': return 'COMPLETE';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Analysis Phase */}
      {phase === 'analyzing' && (
        <div className="text-center space-y-6 py-8">
          <motion.div
            className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Brain className="w-10 h-10 text-primary" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-foreground">
            Bob is analyzing your project...
          </h3>
          
          <div className="max-w-xs mx-auto space-y-3">
            {analysisSteps.map((step, idx) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.3 }}
                className="flex items-center gap-3 text-sm"
              >
                {step.done ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                )}
                <span className={step.done ? 'text-foreground' : 'text-muted-foreground'}>
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Spawning Phase */}
      {(phase === 'spawning' || phase === 'complete') && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-foreground">
              Bob's Team for Your Project
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Specialists assembled based on your requirements
            </p>
          </div>

          <div className="grid gap-3">
            {agents.map((agent, idx) => {
              const IconComponent = agentIcons[agent.id] || Brain;
              
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    agent.status === 'active' 
                      ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-900/10' 
                      : agent.status === 'complete'
                      ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-900/10'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      agent.status === 'complete' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-muted'
                    }`}>
                      <span className="text-lg">{agent.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{agent.name}</h4>
                      <p className="text-xs text-muted-foreground">{agent.description}</p>
                    </div>
                  </div>
                  
                  <motion.span
                    key={agent.status}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}
                  >
                    {agent.status === 'complete' && <Check className="w-3 h-3 inline mr-1" />}
                    {getStatusLabel(agent.status)}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

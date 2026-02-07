import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { ProjectInputForm } from './ProjectInputForm';
import { AgentSpawning } from './AgentSpawning';
import { ChatInterface } from './ChatInterface';
import { ArchitectureProposal } from './ArchitectureProposal';
import { BuilderStep, ProjectFormData, Agent, ChatMessage } from './types';

export function InteractiveDemoBuilder() {
  const [step, setStep] = useState<BuilderStep>('input');
  const [formData, setFormData] = useState<ProjectFormData | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);

  const stepLabels: Record<BuilderStep, string> = {
    input: 'Project Details',
    analyzing: 'Analyzing',
    chat: 'Chat with Bob',
    architecture: 'Architecture',
  };

  const stepOrder: BuilderStep[] = ['input', 'analyzing', 'chat', 'architecture'];
  const currentStepIndex = stepOrder.indexOf(step);

  const handleFormSubmit = (data: ProjectFormData) => {
    setFormData(data);
    setStep('analyzing');
  };

  const handleAgentSpawningComplete = (spawnedAgents: Agent[]) => {
    setAgents(spawnedAgents);
    setStep('chat');
  };

  const handleChatComplete = (messages: ChatMessage[]) => {
    setConversationHistory(messages);
    setStep('architecture');
  };

  const handleBackToChat = () => {
    setStep('chat');
  };

  return (
    <section id="demo" className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="section-container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Tell Bob what you're building
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bob's specialist team will help design your architecture
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {stepOrder.map((s, idx) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      idx < currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : idx === currentStepIndex
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {idx < currentStepIndex ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block ${
                    idx <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {stepLabels[s]}
                  </span>
                </div>
                {idx < stepOrder.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 mx-2 transition-all ${
                      idx < currentStepIndex ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Main Card */}
          <div className="card-elevated p-6 md:p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 'input' && (
                <ProjectInputForm key="input" onSubmit={handleFormSubmit} />
              )}
              
              {step === 'analyzing' && formData && (
                <AgentSpawning 
                  key="analyzing" 
                  formData={formData} 
                  onComplete={handleAgentSpawningComplete}
                />
              )}
              
              {step === 'chat' && formData && (
                <ChatInterface
                  key="chat"
                  formData={formData}
                  agents={agents}
                  onComplete={handleChatComplete}
                />
              )}
              
              {step === 'architecture' && formData && (
                <ArchitectureProposal
                  key="architecture"
                  formData={formData}
                  agents={agents}
                  conversationHistory={conversationHistory}
                  onBack={handleBackToChat}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

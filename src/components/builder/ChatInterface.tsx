import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ArrowRight } from 'lucide-react';
import { ChatMessage, ProjectFormData, Agent } from './types';

interface ChatInterfaceProps {
  formData: ProjectFormData;
  agents: Agent[];
  onComplete: () => void;
}

// Simulated conversation flow based on project type
const generateConversation = (formData: ProjectFormData): Omit<ChatMessage, 'id' | 'timestamp'>[] => {
  const projectType = formData.project.toLowerCase();
  const hasAuth = projectType.includes('auth') || projectType.includes('login') || projectType.includes('user');
  const hasPayments = projectType.includes('payment') || projectType.includes('subscription');
  
  return [
    {
      role: 'bot',
      content: `Great! I understand you're building ${formData.project}. My team has analyzed your requirements for a ${formData.teamSize} team with a ${formData.timeline.replace('-', ' to ')} timeline.\n\nLet me ask a few questions to nail down the architecture.`,
    },
    {
      role: 'bot',
      content: hasAuth 
        ? "My Security Agent noticed you'll need user authentication. Will users have different permission levels (admin, viewer, etc.) or is everyone equal?"
        : "Will your application need user authentication and accounts?",
      suggestions: hasAuth 
        ? ['Yes, role-based access', 'No, everyone equal', 'Not sure yet']
        : ['Yes, with OAuth', 'Email/password only', 'No auth needed'],
    },
    {
      role: 'user',
      content: hasAuth ? 'Yes, role-based access' : 'Yes, with OAuth',
    },
    {
      role: 'bot',
      content: "Perfect, role-based access control noted. ✓\n\nMy Performance Agent is asking about scale: How many users do you expect in the first 6 months? This affects database and caching strategy.",
      suggestions: ['Under 100', '100-1,000', '1,000-10,000', '10,000+'],
      agentConsulting: 'Performance Agent',
    },
    {
      role: 'user',
      content: '100-1,000',
    },
    {
      role: 'bot',
      content: hasPayments
        ? "Good scale - PostgreSQL will handle that easily. Since you mentioned payments, my Payment Agent needs to know: Will you use Stripe, or do you have a different payment provider in mind?"
        : "Good scale - PostgreSQL will handle that easily.\n\nLast question from my Cost Agent: Do you need real-time updates or is refresh-on-demand acceptable? Real-time needs WebSockets but provides better UX.",
      suggestions: hasPayments 
        ? ['Stripe', 'Other provider', 'Decide later']
        : ['Real-time updates', 'Refresh on demand', 'Hybrid approach'],
      agentConsulting: hasPayments ? 'Payment Agent' : 'Cost Agent',
    },
    {
      role: 'user',
      content: hasPayments ? 'Stripe' : 'Real-time updates',
    },
    {
      role: 'bot',
      content: `Excellent! I have everything I need. Based on your ${formData.experience} experience level and ${formData.timeline} timeline, I'm designing an architecture that balances best practices with pragmatic delivery.\n\nLet me show you what my team has designed...`,
    },
  ];
};

export function ChatInterface({ formData, agents, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [consultingAgent, setConsultingAgent] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showComplete, setShowComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const conversationFlow = generateConversation(formData);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentIndex >= conversationFlow.length) {
      setTimeout(() => setShowComplete(true), 1000);
      return;
    }

    const current = conversationFlow[currentIndex];
    
    if (current.role === 'bot') {
      setIsTyping(true);
      if (current.agentConsulting) {
        setConsultingAgent(current.agentConsulting);
      }
      
      const delay = current.agentConsulting ? 2000 : 1500;
      
      setTimeout(() => {
        setIsTyping(false);
        setConsultingAgent(null);
        setMessages(prev => [...prev, {
          ...current,
          id: `msg-${Date.now()}`,
          timestamp: new Date(),
        }]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
    } else {
      // Auto-send user messages after a delay
      setTimeout(() => {
        setMessages(prev => [...prev, {
          ...current,
          id: `msg-${Date.now()}`,
          timestamp: new Date(),
        }]);
        setCurrentIndex(prev => prev + 1);
      }, 1000);
    }
  }, [currentIndex]);

  const handleSuggestionClick = (suggestion: string) => {
    // This would typically send the message, but in demo mode we auto-progress
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-[500px]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Bob</h3>
          <p className="text-xs text-muted-foreground">AI Code Architect • Consulting {agents.length} specialists</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
                
                {/* Suggestions */}
                {msg.suggestions && msg.role === 'bot' && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className={`text-[10px] text-muted-foreground mt-1 ${
                  msg.role === 'user' ? 'text-right' : ''
                }`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                {consultingAgent && (
                  <span className="text-xs text-muted-foreground">
                    Consulting {consultingAgent}...
                  </span>
                )}
                <div className="flex gap-1">
                  <motion.span
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Complete Button or Input */}
      <div className="pt-4 border-t border-border">
        <AnimatePresence mode="wait">
          {showComplete ? (
            <motion.button
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onComplete}
              className="w-full btn-primary group"
            >
              <span>View Architecture</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </motion.button>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled
              />
              <button
                className="px-4 py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
                disabled
              >
                <Send className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

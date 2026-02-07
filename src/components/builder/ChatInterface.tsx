import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ArrowRight } from 'lucide-react';
import { ChatMessage, ProjectFormData, Agent } from './types';

interface ChatInterfaceProps {
  formData: ProjectFormData;
  agents: Agent[];
  onComplete: () => void;
}

// Smart response generator based on context
const generateBotResponse = (
  userMessage: string,
  formData: ProjectFormData,
  conversationHistory: ChatMessage[],
  questionIndex: number
): { content: string; suggestions?: string[]; agentConsulting?: string } => {
  const project = formData.project.toLowerCase();
  const message = userMessage.toLowerCase();
  const teamSize = formData.teamSize;
  const timeline = formData.timeline.replace('-', ' to ');
  
  // Determine context-aware response based on question index
  if (questionIndex === 0) {
    // First user response - about authentication
    if (message.includes('oauth') || message.includes('google') || message.includes('github')) {
      return {
        content: `Perfect! OAuth is a solid choice for a ${teamSize} team. My Security Agent will configure NextAuth.js with Google and GitHub providers.\n\nNow, my Performance Agent is asking about scale: How many users do you expect in the first 6 months?`,
        suggestions: ['Under 100', '100-1,000', '1,000-10,000', '10,000+'],
        agentConsulting: 'Performance Agent',
      };
    } else if (message.includes('role') || message.includes('admin') || message.includes('permission')) {
      return {
        content: `Role-based access control noted. ✓ My Security Agent will implement RBAC with customizable permission levels.\n\nMy Performance Agent needs to know: How many users do you expect in the first 6 months?`,
        suggestions: ['Under 100', '100-1,000', '1,000-10,000', '10,000+'],
        agentConsulting: 'Performance Agent',
      };
    } else if (message.includes('no auth') || message.includes('not needed')) {
      return {
        content: `No authentication needed - that simplifies things! We'll skip the auth layer for now.\n\nNext question from my Performance Agent: What's your expected traffic level in the first 6 months?`,
        suggestions: ['Under 100 users', '100-1,000 users', '1,000+ users'],
        agentConsulting: 'Performance Agent',
      };
    } else {
      return {
        content: `Got it - "${userMessage}". I'll factor that into the security architecture.\n\nMy Performance Agent is asking: How many users do you expect in the first 6 months?`,
        suggestions: ['Under 100', '100-1,000', '1,000-10,000', '10,000+'],
        agentConsulting: 'Performance Agent',
      };
    }
  } else if (questionIndex === 1) {
    // Second response - about scale/users
    let scaleResponse = '';
    if (message.includes('100') && !message.includes('1000') && !message.includes('10000')) {
      scaleResponse = 'Under 100 users - perfect for an MVP! A simple PostgreSQL setup will work great.';
    } else if (message.includes('1000') && !message.includes('10000')) {
      scaleResponse = '100-1,000 users - good scale! PostgreSQL will handle that easily with proper indexing.';
    } else if (message.includes('10000') || message.includes('10,000')) {
      scaleResponse = '10,000+ users - impressive scale! My Performance Agent recommends Redis caching from day one.';
    } else {
      scaleResponse = `"${userMessage}" - noted! I'll optimize the database architecture accordingly.`;
    }
    
    const hasPayments = project.includes('payment') || project.includes('stripe') || project.includes('subscription');
    
    if (hasPayments) {
      return {
        content: `${scaleResponse}\n\nSince you mentioned payments, my Payment Agent needs to know: Will you use Stripe, or do you have a different payment provider in mind?`,
        suggestions: ['Stripe', 'PayPal', 'Other provider', 'Decide later'],
        agentConsulting: 'Payment Agent',
      };
    } else {
      return {
        content: `${scaleResponse}\n\nLast question from my Cost Agent: Do you need real-time updates or is refresh-on-demand acceptable?`,
        suggestions: ['Real-time updates', 'Refresh on demand', 'Hybrid approach'],
        agentConsulting: 'Cost Agent',
      };
    }
  } else if (questionIndex === 2) {
    // Third response - about payments or real-time
    if (message.includes('stripe')) {
      return {
        content: `Stripe it is! ✓ Excellent choice for ${timeline} timeline. My Payment Agent will set up Stripe Checkout with webhooks for subscription management.\n\nI have everything I need. Based on your ${formData.experience} experience level, I'm designing an architecture that balances best practices with pragmatic delivery.\n\nLet me show you what my team has designed...`,
      };
    } else if (message.includes('real-time') || message.includes('realtime')) {
      return {
        content: `Real-time updates - great UX choice! I'll configure WebSockets with proper reconnection handling and fallback polling.\n\nExcellent! I have everything I need. Based on your ${formData.experience} experience level and ${timeline} timeline, I'm designing an architecture optimized for your ${teamSize} team.\n\nLet me show you what my team has designed...`,
      };
    } else if (message.includes('refresh') || message.includes('demand')) {
      return {
        content: `Refresh on demand - simpler and more cost-effective! This is perfect for your timeline.\n\nI have everything I need. My team has designed an architecture that matches your ${formData.experience} level and ${teamSize} team size.\n\nLet me show you the results...`,
      };
    } else if (message.includes('hybrid')) {
      return {
        content: `Hybrid approach - smart choice! Real-time for critical updates, polling for less urgent data.\n\nPerfect! I have all the information needed. Let me show you what my team has designed for your ${timeline} project...`,
      };
    } else {
      return {
        content: `"${userMessage}" - noted and factored into the design!\n\nExcellent! I have everything I need. Based on your requirements, I'm finalizing an architecture optimized for your ${teamSize} team.\n\nLet me show you the results...`,
      };
    }
  }
  
  // Fallback for any additional messages
  return {
    content: `Thanks for that additional context! I've incorporated "${userMessage}" into the architecture design.\n\nI believe I have enough information now. Let me show you what my team has designed...`,
  };
};

// Initial greeting based on project type
const getInitialMessages = (formData: ProjectFormData): Omit<ChatMessage, 'id' | 'timestamp'>[] => {
  const project = formData.project.toLowerCase();
  const hasAuth = project.includes('auth') || project.includes('login') || project.includes('user');
  const hasPayments = project.includes('payment') || project.includes('subscription');
  const hasAnalytics = project.includes('analytics') || project.includes('dashboard');
  
  let questionContent = '';
  let suggestions: string[] = [];
  
  if (hasAuth) {
    questionContent = "My Security Agent noticed you'll need user authentication. Will users have different permission levels (admin, viewer, etc.) or is everyone equal?";
    suggestions = ['Yes, role-based access', 'No, everyone equal', 'Not sure yet'];
  } else if (hasPayments) {
    questionContent = "My Payment Agent sees this involves transactions. What payment provider do you prefer?";
    suggestions = ['Stripe', 'PayPal', 'Multiple providers', 'Decide later'];
  } else if (hasAnalytics) {
    questionContent = "For your analytics dashboard, will you need real-time data updates or is periodic refresh acceptable?";
    suggestions = ['Real-time updates', 'Refresh on demand', 'Hybrid approach'];
  } else {
    questionContent = "Will your application need user authentication and accounts?";
    suggestions = ['Yes, with OAuth', 'Email/password only', 'No auth needed'];
  }
  
  return [
    {
      role: 'bot',
      content: `Great! I understand you're building "${formData.project}". My team has analyzed your requirements for a ${formData.teamSize} team with a ${formData.timeline.replace('-', ' to ')} timeline.\n\nLet me ask a few questions to nail down the architecture.`,
    },
    {
      role: 'bot',
      content: questionContent,
      suggestions,
      agentConsulting: hasAuth ? 'Security Agent' : hasPayments ? 'Payment Agent' : hasAnalytics ? 'Performance Agent' : undefined,
    },
  ];
};

export function ChatInterface({ formData, agents, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [consultingAgent, setConsultingAgent] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showComplete, setShowComplete] = useState(false);
  const [userResponseCount, setUserResponseCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    if (isInitialized) return;
    setIsInitialized(true);
    
    const initialMessages = getInitialMessages(formData);
    
    // Add first message
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{
        ...initialMessages[0],
        id: `msg-${Date.now()}`,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
      
      // Add second message with question
      setTimeout(() => {
        setIsTyping(true);
        if (initialMessages[1].agentConsulting) {
          setConsultingAgent(initialMessages[1].agentConsulting);
        }
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            ...initialMessages[1],
            id: `msg-${Date.now()}`,
            timestamp: new Date(),
          }]);
          setIsTyping(false);
          setConsultingAgent(null);
        }, 1500);
      }, 800);
    }, 1000);
  }, [formData, isInitialized]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || isTyping) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Check if we should end the conversation
    const newResponseCount = userResponseCount + 1;
    setUserResponseCount(newResponseCount);
    
    if (newResponseCount >= 3) {
      // Final response then show complete button
      setIsTyping(true);
      setConsultingAgent('All Agents');
      
      setTimeout(() => {
        const response = generateBotResponse(content, formData, messages, userResponseCount);
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          role: 'bot',
          content: response.content,
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        setConsultingAgent(null);
        
        setTimeout(() => setShowComplete(true), 1500);
      }, 2000);
    } else {
      // Generate contextual response
      setIsTyping(true);
      
      setTimeout(() => {
        const response = generateBotResponse(content, formData, messages, userResponseCount);
        if (response.agentConsulting) {
          setConsultingAgent(response.agentConsulting);
        }
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `msg-${Date.now()}`,
            role: 'bot',
            content: response.content,
            suggestions: response.suggestions,
            agentConsulting: response.agentConsulting,
            timestamp: new Date(),
          }]);
          setIsTyping(false);
          setConsultingAgent(null);
        }, 1500);
      }, 500);
    }
  }, [formData, messages, userResponseCount, isTyping]);

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
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
                {msg.suggestions && msg.role === 'bot' && !showComplete && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={isTyping}
                        className="px-3 py-1.5 text-xs font-medium rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <button
                className="px-4 py-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 transition-opacity hover:bg-primary/90"
                disabled={isTyping || !inputValue.trim()}
                onClick={() => sendMessage(inputValue)}
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

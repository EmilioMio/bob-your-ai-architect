import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, ArrowRight } from 'lucide-react';
import { ChatMessage, ProjectFormData, Agent } from './types';
import { 
  generateGreeting, 
  generateQuestions, 
  acknowledgeResponse, 
  getChatResponse,
  GeneratedQuestion 
} from '@/lib/bob-ai';
import { toast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  formData: ProjectFormData;
  agents: Agent[];
  onComplete: (conversationHistory: ChatMessage[]) => void;
}

export function ChatInterface({ formData, agents, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [consultingAgent, setConsultingAgent] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showComplete, setShowComplete] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fixed scroll - only scrolls the messages container, not the page
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize conversation with AI
  useEffect(() => {
    if (isInitialized) return;
    setIsInitialized(true);
    
    const initializeConversation = async () => {
      setIsTyping(true);
      
      try {
        // Generate AI greeting
        const greeting = await generateGreeting(formData);
        
        const greetingMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'bot',
          content: greeting,
          timestamp: new Date(),
        };
        
        setMessages([greetingMessage]);
        setIsTyping(false);
        
        // Generate contextual questions
        setIsTyping(true);
        setConsultingAgent('Security Agent');
        
        const generatedQuestions = await generateQuestions(formData);
        setQuestions(generatedQuestions);
        
        // Ask first question
        setTimeout(() => {
          if (generatedQuestions.length > 0) {
            const firstQuestion: ChatMessage = {
              id: `msg-${Date.now()}-q`,
              role: 'bot',
              content: generatedQuestions[0].question,
              suggestions: generatedQuestions[0].suggestions,
              agentConsulting: 'Security Agent',
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, firstQuestion]);
          }
          setIsTyping(false);
          setConsultingAgent(null);
        }, 1000);
        
      } catch (error) {
        console.error('Failed to initialize:', error);
        toast({
          title: "Connection issue",
          description: "Using fallback responses. AI features may be limited.",
          variant: "destructive",
        });
        
        // Fallback greeting
        const fallbackMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'bot',
          content: `Let me help you design the architecture for your project. I'll ask a few questions to understand your needs better.`,
          timestamp: new Date(),
        };
        setMessages([fallbackMessage]);
        setIsTyping(false);
        
        // Set fallback questions
        setQuestions([
          { question: "What's the primary purpose of this application?", suggestions: ["Data management", "User interaction", "Automation", "Analytics"] },
          { question: "How many users do you expect?", suggestions: ["Under 100", "100-1,000", "1,000-10,000", "10,000+"] },
          { question: "What's your deployment target?", suggestions: ["Cloud (AWS/GCP/Azure)", "Vercel/Netlify", "On-premise", "Not sure yet"] }
        ]);
        
        setTimeout(() => {
          const firstQuestion: ChatMessage = {
            id: `msg-${Date.now()}-q`,
            role: 'bot',
            content: "What's the primary purpose of this application?",
            suggestions: ["Data management", "User interaction", "Automation", "Analytics"],
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, firstQuestion]);
        }, 500);
      }
    };
    
    setTimeout(initializeConversation, 500);
  }, [formData, isInitialized]);

  const sendMessage = useCallback(async (content: string) => {
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
    
    const nextQuestionIndex = currentQuestionIndex + 1;
    
    // Check if we've completed all questions
    if (nextQuestionIndex >= questions.length) {
      // Final response
      setIsTyping(true);
      setConsultingAgent('All Agents');
      
      try {
        const acknowledgment = await acknowledgeResponse(
          formData,
          questions[currentQuestionIndex]?.question || '',
          content
        );
        
        setTimeout(() => {
          const finalMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'bot',
            content: `${acknowledgment}\n\nExcellent! I have all the information I need. Let me show you what my team has designed...`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, finalMessage]);
          setIsTyping(false);
          setConsultingAgent(null);
          
          setTimeout(() => setShowComplete(true), 1500);
        }, 1500);
      } catch {
        setTimeout(() => {
          const finalMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'bot',
            content: `Perfect! I have all the information I need. Let me show you what my team has designed...`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, finalMessage]);
          setIsTyping(false);
          setConsultingAgent(null);
          
          setTimeout(() => setShowComplete(true), 1500);
        }, 1000);
      }
    } else {
      // Generate acknowledgment and ask next question
      setIsTyping(true);
      const agentNames = ['Performance Agent', 'Cost Agent', 'Architecture Agent'];
      setConsultingAgent(agentNames[nextQuestionIndex % agentNames.length]);
      
      try {
        const acknowledgment = await acknowledgeResponse(
          formData,
          questions[currentQuestionIndex]?.question || '',
          content
        );
        
        setTimeout(() => {
          // Add acknowledgment
          const ackMessage: ChatMessage = {
            id: `msg-${Date.now()}-ack`,
            role: 'bot',
            content: acknowledgment,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, ackMessage]);
          
          // Add next question
          setTimeout(() => {
            const nextQuestion = questions[nextQuestionIndex];
            const questionMessage: ChatMessage = {
              id: `msg-${Date.now()}-q`,
              role: 'bot',
              content: nextQuestion.question,
              suggestions: nextQuestion.suggestions,
              agentConsulting: agentNames[nextQuestionIndex % agentNames.length],
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, questionMessage]);
            setCurrentQuestionIndex(nextQuestionIndex);
            setIsTyping(false);
            setConsultingAgent(null);
          }, 800);
        }, 1200);
      } catch {
        // Fallback
        setTimeout(() => {
          const nextQuestion = questions[nextQuestionIndex];
          const fallbackMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'bot',
            content: `Got it! ${nextQuestion.question}`,
            suggestions: nextQuestion.suggestions,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, fallbackMessage]);
          setCurrentQuestionIndex(nextQuestionIndex);
          setIsTyping(false);
          setConsultingAgent(null);
        }, 800);
      }
    }
  }, [formData, messages, questions, currentQuestionIndex, isTyping]);

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

  const handleComplete = () => {
    onComplete(messages);
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

      {/* Messages - Fixed scroll container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto py-4 space-y-4 pr-2"
      >
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
      </div>

      {/* Complete Button or Input */}
      <div className="pt-4 border-t border-border">
        <AnimatePresence mode="wait">
          {showComplete ? (
            <motion.button
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleComplete}
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
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={isTyping || !inputValue.trim()}
                className="px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

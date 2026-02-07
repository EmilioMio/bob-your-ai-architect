import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
  message: string;
  isBot?: boolean;
  delay?: number;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function ChatBubble({ 
  message, 
  isBot = false, 
  delay = 0,
  suggestions,
  onSuggestionClick 
}: ChatBubbleProps) {
  return (
    <motion.div
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      <div className={`flex flex-col gap-2 ${isBot ? 'items-start' : 'items-end'} max-w-[80%]`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? 'bg-muted text-foreground rounded-tl-md'
              : 'bg-primary text-primary-foreground rounded-tr-md'
          }`}
        >
          {message}
        </div>
        
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestions.map((suggestion, idx) => (
              <motion.button
                key={idx}
                className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-muted transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: delay + 0.3 + idx * 0.1 }}
                onClick={() => onSuggestionClick?.(suggestion)}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

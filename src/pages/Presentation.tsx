import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Layers, Brain, Shield, Zap, Users, Code2, Rocket, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Bob AI',
    subtitle: 'Code Architect',
    content: (
      <div className="space-y-8">
        <motion.p 
          className="text-2xl md:text-4xl font-light text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Bob builds your architecture.
        </motion.p>
        <motion.p 
          className="text-xl md:text-3xl font-light text-muted-foreground/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          You build your product.
        </motion.p>
      </div>
    ),
  },
  {
    id: 2,
    title: 'The Problem',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        {[
          { icon: '⏰', text: 'Hours spent on project structure' },
          { icon: '🔄', text: 'Inconsistent patterns across teams' },
          { icon: '📚', text: 'Tribal knowledge gets lost' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-card/50 backdrop-blur rounded-2xl p-8 border border-border text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.15 }}
          >
            <span className="text-5xl mb-4 block">{item.icon}</span>
            <p className="text-lg text-foreground">{item.text}</p>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: 3,
    title: 'The Solution',
    subtitle: 'AI-Powered Architecture',
    content: (
      <div className="flex flex-col items-center gap-8">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-foreground">Bob AI</h3>
            <p className="text-muted-foreground">Your intelligent code architect</p>
          </div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {['Analyze', 'Design', 'Generate', 'Enforce'].map((step, idx) => (
            <div key={idx} className="bg-accent/10 rounded-xl p-4 text-center">
              <span className="text-accent font-semibold">{step}</span>
            </div>
          ))}
        </motion.div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'How It Works',
    content: (
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        {[
          { icon: Code2, label: 'Describe', color: 'bg-primary' },
          { icon: Brain, label: 'Analyze', color: 'bg-accent' },
          { icon: Layers, label: 'Generate', color: 'bg-purple-500' },
          { icon: Rocket, label: 'Deploy', color: 'bg-rose-500' },
        ].map((step, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.15 }}
          >
            <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-3`}>
              <step.icon className="w-8 h-8 text-white" />
            </div>
            <span className="font-medium text-foreground">{step.label}</span>
            {idx < 3 && (
              <ChevronRight className="hidden md:block absolute -right-6 text-muted-foreground" />
            )}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: 5,
    title: 'Multi-Agent System',
    content: (
      <div className="relative max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Security Agent', desc: 'Auth & permissions', color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { icon: Zap, title: 'Performance Agent', desc: 'Speed optimization', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { icon: Users, title: 'Cost Agent', desc: 'Budget analysis', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          ].map((agent, idx) => (
            <motion.div
              key={idx}
              className={`${agent.bg} rounded-2xl p-6 border border-border`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <agent.icon className={`w-10 h-10 ${agent.color} mb-4`} />
              <h3 className="font-semibold text-foreground mb-1">{agent.title}</h3>
              <p className="text-sm text-muted-foreground">{agent.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
            <Brain className="w-5 h-5 text-accent" />
            <span className="text-accent font-medium">AI Synthesis</span>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 6,
    title: 'Key Features',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {[
          { icon: Layers, title: 'Instant Scaffolding', desc: 'Production-ready structure in seconds' },
          { icon: Brain, title: 'Adapts to Experience', desc: 'Beginner-friendly or expert-level' },
          { icon: Shield, title: 'Live Enforcement', desc: 'Real-time pattern validation' },
          { icon: CheckCircle, title: 'Consistency Checker', desc: 'Every file validated automatically' },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            className="flex items-start gap-4 bg-card/50 rounded-xl p-5 border border-border"
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: 7,
    title: 'Supported Stacks',
    content: (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
        {[
          { name: 'Next.js SaaS', color: 'bg-black text-white' },
          { name: 'React Native', color: 'bg-[#61DAFB] text-black' },
          { name: 'Python API', color: 'bg-[#3776AB] text-white' },
          { name: 'Monorepo', color: 'bg-cyan-500 text-white' },
        ].map((stack, idx) => (
          <motion.div
            key={idx}
            className={`${stack.color} rounded-2xl p-6 text-center font-semibold`}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, type: 'spring' }}
          >
            {stack.name}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: 8,
    title: 'VS Code Integration',
    content: (
      <motion.div 
        className="bg-card rounded-2xl border border-border overflow-hidden max-w-2xl shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-[hsl(var(--code-bg))] px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-warning" />
            <div className="w-3 h-3 rounded-full bg-accent" />
          </div>
          <span className="text-[hsl(var(--code-comment))] text-sm ml-2">VS Code - Bob Extension</span>
        </div>
        <div className="bg-[hsl(var(--code-bg))] p-6">
          <pre className="text-sm font-mono">
            <code>
              <span className="text-[hsl(var(--code-keyword))]">function</span>
              <span className="text-[hsl(var(--code-function))]"> Dashboard</span>
              <span className="text-[hsl(var(--code-text))]">() {'{'}</span>
              {'\n'}
              <span className="text-[hsl(var(--code-comment))]">  {'// '}Bob: ✓ Following patterns</span>
              {'\n'}
              <span className="text-[hsl(var(--code-keyword))]">  return</span>
              <span className="text-[hsl(var(--code-text))]"> {'<'}Dashboard /{'>'}</span>
              {'\n'}
              <span className="text-[hsl(var(--code-text))]">{'}'}</span>
            </code>
          </pre>
        </div>
      </motion.div>
    ),
  },
  {
    id: 9,
    title: 'Get Started',
    subtitle: 'Build with confidence',
    content: (
      <div className="flex flex-col items-center gap-8">
        <motion.div
          className="text-6xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          🚀
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <a href="/" className="btn-primary">
            Try Bob Now
          </a>
          <button className="btn-ghost">
            View on GitHub
          </button>
        </motion.div>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Free to start • No credit card required
        </motion.p>
      </div>
    ),
  },
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          navigate('/');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, navigate]);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Home className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="text-sm text-muted-foreground">
          {currentSlide + 1} / {slides.length}
        </div>
      </header>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide content */}
      <main className="flex-1 flex items-center justify-center px-8 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="w-full max-w-6xl text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {slide.title}
            </motion.h1>
            {slide.subtitle && (
              <motion.p
                className="text-xl md:text-2xl text-primary mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {slide.subtitle}
              </motion.p>
            )}
            <div className="flex justify-center mt-8">
              {slide.content}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation buttons */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-3 rounded-full bg-card border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Slide dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 translate-y-12 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentSlide ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground hidden md:block">
        Use ← → arrows or click to navigate • ESC to exit
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Monitor, Brain, Shield, Zap, Coins, Database, Rocket, FolderTree, FileCode, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

const slides: Slide[] = [
  // Slide 1: Title
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
  // Slide 2: Tell Bob About Your Project
  {
    id: 2,
    title: 'Tell Bob About Your Project',
    subtitle: 'The first step to perfect architecture',
    content: (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Input form mockup */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-6 text-left shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Project Description</label>
                <div className="bg-muted/50 rounded-lg p-3 text-foreground text-sm">
                  "A SaaS dashboard with auth, analytics, and team management"
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Framework</label>
                  <div className="bg-primary/10 text-primary rounded-lg p-2 text-sm font-medium text-center">Next.js</div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Team Size</label>
                  <div className="bg-accent/10 text-accent rounded-lg p-2 text-sm font-medium text-center">5-10</div>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Experience Level</label>
                <div className="flex gap-2">
                  {['Beginner', 'Mid', 'Senior'].map((level, idx) => (
                    <div key={idx} className={`flex-1 rounded-lg p-2 text-sm text-center ${idx === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {level}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: What Bob learns */}
          <motion.div
            className="flex flex-col justify-center gap-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { icon: Monitor, text: 'Project scope & features', color: 'text-primary' },
              { icon: Brain, text: 'Team expertise level', color: 'text-accent' },
              { icon: Shield, text: 'Security requirements', color: 'text-purple-500' },
              { icon: Zap, text: 'Performance needs', color: 'text-amber-500' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-3 bg-card/50 rounded-xl p-4 border border-border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="text-foreground">{item.text}</span>
                <Check className="w-5 h-5 text-accent ml-auto" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    ),
  },
  // Slide 3: See Bob in Action
  {
    id: 3,
    title: 'See Bob in Action',
    subtitle: 'Multi-agent analysis at work',
    content: (
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Security Agent', desc: 'Analyzing auth patterns & permissions', color: 'text-purple-500', bg: 'bg-purple-500/10', borderColor: 'border-purple-500/40' },
            { icon: Zap, title: 'Performance Agent', desc: 'Optimizing for speed & scalability', color: 'text-amber-500', bg: 'bg-amber-500/10', borderColor: 'border-amber-500/40' },
            { icon: Coins, title: 'Cost Agent', desc: 'Balancing features with budget', color: 'text-emerald-500', bg: 'bg-emerald-500/10', borderColor: 'border-emerald-500/40' },
          ].map((agent, idx) => (
            <motion.div
              key={idx}
              className={`${agent.bg} rounded-2xl p-6 border-2 ${agent.borderColor}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.15, type: 'spring' }}
            >
              <agent.icon className={`w-12 h-12 ${agent.color} mb-4`} />
              <h3 className="font-semibold text-foreground text-lg mb-2">{agent.title}</h3>
              <p className="text-sm text-muted-foreground">{agent.desc}</p>
              <motion.div 
                className="mt-4 h-2 bg-muted rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <motion.div
                  className={`h-full ${agent.bg.replace('/10', '')}`}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.6 + idx * 0.15, duration: 1.5 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="inline-flex items-center gap-3 bg-accent/10 px-6 py-3 rounded-full border border-accent/30">
            <Brain className="w-6 h-6 text-accent" />
            <span className="text-accent font-semibold">AI Synthesis Complete</span>
          </div>
        </motion.div>
      </div>
    ),
  },
  // Slide 4: What Bob Creates
  {
    id: 4,
    title: 'What Bob Creates',
    subtitle: 'Production-ready architecture',
    content: (
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File tree */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-6 text-left shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <FolderTree className="w-5 h-5 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">my-saas-app/</span>
            </div>
            <div className="space-y-1 font-mono text-sm">
              {[
                { name: 'src/', indent: 0, isFolder: true },
                { name: 'app/', indent: 1, isFolder: true },
                { name: '(auth)/', indent: 2, isFolder: true },
                { name: '(dashboard)/', indent: 2, isFolder: true },
                { name: 'components/', indent: 1, isFolder: true, badge: '20 files' },
                { name: 'lib/', indent: 1, isFolder: true },
                { name: 'hooks/', indent: 1, isFolder: true },
                { name: 'package.json', indent: 0, isFolder: false },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-2"
                  style={{ paddingLeft: `${item.indent * 16}px` }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  {item.isFolder ? (
                    <FolderTree className="w-4 h-4 text-primary" />
                  ) : (
                    <FileCode className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={item.isFolder ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{item.badge}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rules */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card rounded-xl border border-border p-5">
              <h4 className="font-semibold text-foreground mb-3">Generated Rules</h4>
              <div className="space-y-2">
                {[
                  'Server components by default',
                  'Client components only when needed',
                  'No business logic in page files',
                  'Consistent naming conventions',
                ].map((rule, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                  >
                    <Check className="w-4 h-4 text-accent flex-shrink-0" />
                    {rule}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-accent/10 rounded-xl border border-accent/30 p-5">
              <h4 className="font-semibold text-accent mb-2">Ready to Download</h4>
              <p className="text-sm text-muted-foreground">Complete project structure with README, configs, and boilerplate code</p>
            </div>
          </motion.div>
        </div>
      </div>
    ),
  },
  // Slide 5: Visualize the Flow
  {
    id: 5,
    title: 'Visualize the Flow',
    subtitle: 'How Bob\'s engine works',
    content: (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {[
            { icon: Monitor, label: 'Input', desc: 'Describe project', color: 'bg-primary', iconColor: 'text-primary-foreground' },
            { icon: Brain, label: 'Analyze', desc: 'AI synthesis', color: 'bg-accent', iconColor: 'text-accent-foreground' },
            { icon: Database, label: 'Design', desc: 'Architecture', color: 'bg-blue-500', iconColor: 'text-white' },
            { icon: Rocket, label: 'Deploy', desc: 'Export & build', color: 'bg-rose-500', iconColor: 'text-white' },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.15 }}
            >
              <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mb-3 shadow-lg`}>
                <step.icon className={`w-10 h-10 ${step.iconColor}`} />
              </div>
              <span className="font-semibold text-foreground">{step.label}</span>
              <span className="text-xs text-muted-foreground">{step.desc}</span>
              
              {/* Connector */}
              {idx < 3 && (
                <motion.div 
                  className="hidden md:block absolute top-10 -right-8 w-12"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.4 + idx * 0.15 }}
                >
                  <div className="h-0.5 bg-gradient-to-r from-border to-primary/50 w-full" />
                  <ChevronRight className="absolute -right-1 -top-2 w-4 h-4 text-primary/50" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  // Slide 6: VS Code Integration
  {
    id: 6,
    title: 'VS Code Integration',
    subtitle: 'Live enforcement as you code',
    content: (
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl"
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
            <span className="text-[hsl(var(--code-comment))] text-sm ml-2">VS Code - Bob Extension Active</span>
            <div className="ml-auto bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs font-medium">Live</div>
          </div>
          <div className="bg-[hsl(var(--code-bg))] p-6">
            <pre className="text-sm font-mono text-left">
              <code>
                <span className="text-[hsl(var(--code-keyword))]">function</span>
                <span className="text-[hsl(var(--code-function))]"> Dashboard</span>
                <span className="text-[hsl(var(--code-text))]">() {'{'}</span>
                {'\n'}
                <span className="text-[hsl(var(--code-comment))]">  {'// '}Bob: ✓ Following component patterns</span>
                {'\n'}
                <span className="text-[hsl(var(--code-keyword))]">  const</span>
                <span className="text-[hsl(var(--code-text))]"> data = </span>
                <span className="text-[hsl(var(--code-function))]">useDashboardData</span>
                <span className="text-[hsl(var(--code-text))]">();</span>
                {'\n\n'}
                <span className="text-[hsl(var(--code-keyword))]">  return</span>
                <span className="text-[hsl(var(--code-text))]"> {'<'}</span>
                <span className="text-[hsl(var(--code-string))]">DashboardLayout</span>
                <span className="text-[hsl(var(--code-text))]">{'>'}</span>
                <span className="text-[hsl(var(--code-text))]">...</span>
                <span className="text-[hsl(var(--code-text))]">{'</'}</span>
                <span className="text-[hsl(var(--code-string))]">DashboardLayout</span>
                <span className="text-[hsl(var(--code-text))]">{'>'}</span>
                {'\n'}
                <span className="text-[hsl(var(--code-text))]">{'}'}</span>
              </code>
            </pre>
            
            {/* Warning tooltip */}
            <motion.div 
              className="mt-4 flex items-start gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-warning text-lg">⚠️</span>
              <div>
                <p className="text-sm text-warning font-medium">Architectural suggestion</p>
                <p className="text-xs text-warning/80">Consider moving data fetching to a server component for better performance</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-8 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <a href="/" className="btn-primary">
            Try Bob Now
          </a>
          <button className="btn-ghost">
            Get VS Code Extension
          </button>
        </motion.div>
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

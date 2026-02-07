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
  // Slide 3: See Bob in Action (VS Code)
  {
    id: 3,
    title: 'See Bob in Action',
    subtitle: 'Live enforcement in VS Code',
    content: (
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* VS Code title bar */}
          <div className="bg-[hsl(var(--code-bg))] px-4 py-3 flex items-center gap-2 border-b border-[hsl(var(--code-comment))]/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-accent" />
            </div>
            <span className="text-[hsl(var(--code-comment))] text-sm ml-2">UserService.ts — my-saas-app</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">B</div>
              <span className="text-[hsl(var(--code-comment))] text-xs">Bob Active</span>
            </div>
          </div>
          
          {/* VS Code editor */}
          <div className="bg-[hsl(var(--code-bg))] flex">
            {/* Line numbers */}
            <div className="py-4 px-3 text-right text-[hsl(var(--code-comment))] text-sm font-mono select-none border-r border-[hsl(var(--code-comment))]/10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className={n === 4 ? 'text-warning' : ''}>{n}</div>
              ))}
            </div>
            
            {/* Code content */}
            <div className="flex-1 p-4">
              <pre className="text-sm font-mono text-left">
                <code>
                  <span className="text-[hsl(var(--code-keyword))]">export class</span>
                  <span className="text-[hsl(var(--code-function))]"> UserService</span>
                  <span className="text-[hsl(var(--code-text))]"> {'{'}</span>
                  {'\n'}
                  <span className="text-[hsl(var(--code-keyword))]">  async</span>
                  <span className="text-[hsl(var(--code-function))]"> fetchUsers</span>
                  <span className="text-[hsl(var(--code-text))]">() {'{'}</span>
                  {'\n'}
                  <span className="text-[hsl(var(--code-comment))]">    {'// '}TODO: Add error handling</span>
                  {'\n'}
                  <motion.span 
                    className="bg-warning/20 block -mx-4 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="text-[hsl(var(--code-keyword))]">    const</span>
                    <span className="text-[hsl(var(--code-text))]"> response = </span>
                    <span className="text-[hsl(var(--code-keyword))]">await</span>
                    <span className="text-[hsl(var(--code-function))]"> fetch</span>
                    <span className="text-[hsl(var(--code-text))]">(</span>
                    <span className="text-[hsl(var(--code-string))]">'/api/users'</span>
                    <span className="text-[hsl(var(--code-text))]">);</span>
                  </motion.span>
                  <span className="text-[hsl(var(--code-keyword))]">    return</span>
                  <span className="text-[hsl(var(--code-text))]"> response.</span>
                  <span className="text-[hsl(var(--code-function))]">json</span>
                  <span className="text-[hsl(var(--code-text))]">();</span>
                  {'\n'}
                  <span className="text-[hsl(var(--code-text))]">  {'}'}</span>
                  {'\n'}
                  <span className="text-[hsl(var(--code-text))]">{'}'}</span>
                </code>
              </pre>
            </div>
          </div>
          
          {/* Bob warning panel */}
          <motion.div 
            className="bg-warning/10 border-t border-warning/30 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-warning text-xl">⚠️</span>
              <div className="flex-1 text-left">
                <p className="text-warning font-semibold text-sm">Architectural Pattern Violation</p>
                <p className="text-warning/80 text-xs mt-1">API calls should use the centralized apiClient from /lib/api — Rule: "All API calls through services layer"</p>
              </div>
              <motion.div 
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <button className="px-3 py-1.5 text-xs bg-warning text-warning-foreground rounded-lg font-medium">
                  Auto-fix
                </button>
                <button className="px-3 py-1.5 text-xs bg-transparent border border-warning/50 text-warning rounded-lg">
                  Ignore
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.p
          className="mt-6 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Bob monitors your code in real-time and flags violations of your architectural rules
        </motion.p>
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
  // Slide 5: Visualize the Flow (Tree diagram like website)
  {
    id: 5,
    title: 'Visualize the Flow',
    subtitle: 'How Bob\'s architecture engine works',
    content: (
      <div className="max-w-5xl mx-auto">
        {/* Tree structure visualization */}
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {/* Level 1: Input */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-2xl bg-card border-2 border-primary/40 p-4 w-28 text-center shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Input</h3>
              <p className="text-xs text-muted-foreground">Describe project</p>
            </div>
          </motion.div>

          {/* Connector */}
          <motion.div 
            className="w-8 h-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 }}
          />

          {/* Level 2: Agents */}
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: Shield, title: 'Security', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/40' },
              { icon: Zap, title: 'Performance', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/40' },
              { icon: Coins, title: 'Cost', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' },
            ].map((agent, idx) => (
              <motion.div
                key={idx}
                className={`rounded-xl ${agent.bg} border ${agent.border} p-2 w-24 text-center`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <agent.icon className={`w-5 h-5 ${agent.color} mx-auto mb-1`} />
                <p className="text-xs font-medium text-foreground">{agent.title}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Connector */}
          <motion.div 
            className="w-8 h-0.5 bg-gradient-to-r from-amber-500/50 to-accent/50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6 }}
          />

          {/* Level 3: Synthesis */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="rounded-2xl bg-card border-2 border-accent/40 p-4 w-28 text-center shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-2">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Analyze</h3>
              <p className="text-xs text-muted-foreground">AI synthesis</p>
            </div>
          </motion.div>

          {/* Connector */}
          <motion.div 
            className="w-8 h-0.5 bg-gradient-to-r from-accent/50 to-rose-500/50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8 }}
          />

          {/* Level 4: Outputs */}
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            {[
              { icon: Database, title: 'Design', desc: 'Architecture', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/40' },
              { icon: Rocket, title: 'Deploy', desc: 'Export & build', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/40' },
            ].map((output, idx) => (
              <motion.div
                key={idx}
                className={`rounded-xl ${output.bg} border ${output.border} p-3 w-28 text-center`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + idx * 0.1 }}
              >
                <output.icon className={`w-5 h-5 ${output.color} mx-auto mb-1`} />
                <p className="text-xs font-medium text-foreground">{output.title}</p>
                <p className="text-[10px] text-muted-foreground">{output.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <a href="/" className="btn-primary">
            Try Bob Now
          </a>
          <button className="btn-ghost">
            View on GitHub
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

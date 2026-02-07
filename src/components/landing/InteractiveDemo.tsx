import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Info, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { ChatBubble } from './ChatBubble';
import { ArchitectureVisual } from './ArchitectureVisual';

const techOptions = ['React', 'Vue', 'Next.js', 'Python', 'Node.js', 'TypeScript', 'Go', 'Rust'];

const chatFlow = [
  {
    bot: "Nice! A SaaS analytics dashboard sounds exciting. Let me ask a few questions to design the perfect architecture.",
    delay: 0
  },
  {
    bot: "Will you need user authentication?",
    suggestions: ["Yes, with OAuth", "Email/password only", "No auth needed"],
    delay: 0.5
  },
  {
    user: "Yes, with OAuth",
    delay: 1
  },
  {
    bot: "Great choice for a SaaS. Are you expecting high traffic from day one, or will you scale gradually?",
    suggestions: ["Start small, scale later", "High traffic expected", "Not sure yet"],
    delay: 1.5
  },
  {
    user: "Start small, scale later",
    delay: 2
  },
  {
    bot: "Perfect. For a 5-person team with a 3-month timeline, I recommend a modular monolith that's easy to split later. I'll design an architecture with clear boundaries between features.",
    delay: 2.5
  },
];

export function InteractiveDemo() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    project: '',
    teamSize: '',
    timeline: '',
    experience: '',
    techPreferences: [] as string[],
  });
  const [showTechOptions, setShowTechOptions] = useState(false);
  const [chatMessages, setChatMessages] = useState<typeof chatFlow>([]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      // Simulate chat messages appearing
      setTimeout(() => {
        setChatMessages([chatFlow[0]]);
        setTimeout(() => setChatMessages([chatFlow[0], chatFlow[1]]), 1000);
        setTimeout(() => setChatMessages([chatFlow[0], chatFlow[1], chatFlow[2]]), 2000);
        setTimeout(() => setChatMessages([chatFlow[0], chatFlow[1], chatFlow[2], chatFlow[3]]), 3000);
        setTimeout(() => setChatMessages([...chatFlow.slice(0, 5)]), 4000);
        setTimeout(() => setChatMessages(chatFlow), 5000);
      }, 500);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const toggleTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techPreferences: prev.techPreferences.includes(tech)
        ? prev.techPreferences.filter(t => t !== tech)
        : [...prev.techPreferences, tech]
    }));
  };

  return (
    <section id="demo" className="py-24 md:py-32 bg-background">
      <div className="section-container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tell Bob what you're building
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience how Bob transforms your idea into a production-ready architecture
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    s <= step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-all ${
                      s < step ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="card-elevated p-6 md:p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1: Project Basics */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      What are you building?
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., SaaS analytics dashboard, mobile fitness app..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={formData.project}
                      onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Team size
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          value={formData.teamSize}
                          onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
                        >
                          <option value="">Select...</option>
                          <option value="solo">Solo</option>
                          <option value="2-5">2-5</option>
                          <option value="6-10">6-10</option>
                          <option value="11-50">11-50</option>
                          <option value="50+">50+</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Timeline
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          value={formData.timeline}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        >
                          <option value="">Select...</option>
                          <option value="week">This week</option>
                          <option value="month">This month</option>
                          <option value="quarter">This quarter</option>
                          <option value="6+">6+ months</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        Experience level
                        <div className="group relative">
                          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Bob adapts complexity to your level
                          </div>
                        </div>
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          value={formData.experience}
                          onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        >
                          <option value="">Select...</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="expert">Expert</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Tech preferences */}
                  <div>
                    <button
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowTechOptions(!showTechOptions)}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${showTechOptions ? 'rotate-180' : ''}`} />
                      Tech preferences (optional)
                    </button>
                    
                    <AnimatePresence>
                      {showTechOptions && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-2 mt-4">
                            {techOptions.map((tech) => (
                              <button
                                key={tech}
                                onClick={() => toggleTech(tech)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                  formData.techPreferences.includes(tech)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background text-foreground border-border hover:border-primary/50'
                                }`}
                              >
                                {tech}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={handleNext}
                    className="btn-primary w-full group"
                  >
                    Next: Chat with Bob
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Chat Interface */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Bob</h3>
                      <p className="text-xs text-muted-foreground">AI Code Architect</p>
                    </div>
                  </div>

                  <div className="space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto pr-2">
                    {chatMessages.map((msg, idx) => (
                      <ChatBubble
                        key={idx}
                        message={('bot' in msg ? msg.bot : msg.user) || ''}
                        isBot={'bot' in msg}
                        delay={0}
                        suggestions={'suggestions' in msg ? msg.suggestions : undefined}
                      />
                    ))}
                  </div>

                  {chatMessages.length >= 6 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 pt-4"
                    >
                      <button
                        onClick={() => { setStep(1); setChatMessages([]); }}
                        className="btn-ghost flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="btn-primary flex-1 group"
                      >
                        Generate Architecture
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Architecture Proposal */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArchitectureVisual onBack={() => { setStep(2); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { FileText, Brain, Layers, FileStack, Code2, Shield } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Input',
    description: 'Describe your project',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Bob understands context',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: Layers,
    title: 'Architecture Design',
    description: 'Blueprint creation',
    color: 'bg-code-keyword/10 text-code-keyword',
  },
  {
    icon: FileStack,
    title: 'File Generation',
    description: 'Structure scaffolding',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: Code2,
    title: 'VS Code Integration',
    description: 'Seamless workflow',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Shield,
    title: 'Live Enforcement',
    description: 'Continuous validation',
    color: 'bg-accent/10 text-accent',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-background">
      <div className="section-container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From idea to enforced architecture in minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bob's intelligent workflow transforms your concepts into production-ready structures
          </p>
        </motion.div>

        {/* Isometric Flow - Desktop */}
        <div className="hidden lg:block relative">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Isometric Card */}
                <div
                  className="relative w-24 h-24 bg-card border border-border rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                  style={{
                    transform: 'perspective(1000px) rotateX(10deg) rotateY(-5deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className={`absolute inset-0 flex items-center justify-center rounded-xl ${step.color}`}>
                    <step.icon className="w-10 h-10" />
                  </div>
                  {/* 3D effect shadow */}
                  <div 
                    className="absolute -bottom-2 -right-2 w-full h-full bg-border/50 rounded-xl -z-10"
                    style={{ transform: 'translateZ(-10px)' }}
                  />
                </div>

                {/* Label */}
                <div className="mt-4 text-center">
                  <p className="font-semibold text-foreground text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                </div>

                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <motion.svg
                    className="absolute top-12 -right-16 w-32 h-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.3 }}
                  >
                    <motion.path
                      d="M0 16 Q32 0 64 16 T128 16"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1 + 0.3 }}
                    />
                    <motion.circle
                      cx="128"
                      cy="16"
                      r="3"
                      fill="hsl(var(--primary))"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.1 + 0.8 }}
                    />
                  </motion.svg>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Flow - Vertical */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${step.color}`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {idx < steps.length - 1 && (
                <div className="absolute left-8 top-full w-0.5 h-8 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
